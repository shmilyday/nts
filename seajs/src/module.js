/**
 * see: https://github.com/lifesinger/lifesinger.github.com/issues
 * and: https://github.com/seajs/seajs/issues/952
 * and: https://github.com/justin-zhengyi-wu/blogs/issues/7
 * and: http://www.zhihu.com/question/20342350
 * and: http://www.zhihu.com/question/20351507
 */


/**
 * module.js - The core of module loader
 */

var cachedMods = seajs.cache = {}
var anonymousMeta

var fetchingList = {}
var fetchedList = {}
var callbackList = {}

var STATUS = Module.STATUS = {
    // 1 - The `module.uri` is being fetched
    FETCHING: 1,
    // 2 - The meta data has been saved to cachedMods
    SAVED: 2,
    // 3 - The `module.dependencies` are being loaded
    LOADING: 3,
    // 4 - The module are ready to execute
    LOADED: 4,
    // 5 - The module is being executed
    EXECUTING: 5,
    // 6 - The `module.exports` is available
    EXECUTED: 6
}


function Module(uri, deps) {
    this.uri = uri //当前模块的uri，刚开始可能是a/b/c.js等，但是到最后会被resolve成http://xxx/a/b/c.js类似的绝对路径
    this.dependencies = deps || [] //当前模块依赖的模块
    this.exports = null
    this.status = 0  //加载状态的，初始化为0，是最开始的状态，以后会被赋值为STATUS几个值。

    // Who depends on me
    this._waitings = {} //父模块的引用，如果在a.js中的define中require了b.js，最后会在b的Module类中赋值_waitings = {a:Module}

    // The number of unloaded dependencies
    this._remain = 0 //依赖的、还没有loaded的子模块 的个数
}

// Resolve module.dependencies
// 解析当前模块的依赖，
Module.prototype.resolve = function () {
    var mod = this
    var ids = mod.dependencies
    var uris = []

    for (var i = 0, len = ids.length; i < len; i++) {
        // resolve负责解析一系列的require或者use传入的id的不规范
        uris[i] = Module.resolve(ids[i], mod.uri)
    }
    return uris
}

// Load module.dependencies and fire onload when all done
/**
 * 当前模块的load方法
 */
Module.prototype.load = function () {
    var mod = this

    // If the module is being loaded, just wait it onload call
    // 如果当前模块的状态正在加载，退出
    if (mod.status >= STATUS.LOADING) {
        return
    }

    // 将当前状态制定为 加载中
    mod.status = STATUS.LOADING

    // Emit `load` event for plugins such as combo plugin
    var uris = mod.resolve() //该方法，负责提取中子模块的所有的uri
    emit("load", uris) // 触发load事件，用于插件回调

    var len = mod._remain = uris.length // 是的，当前状况下，没加载的子模块的个数为全部uris.length
    var m

    // Initialize modules and register waitings
    // 初始化子模块，给子模块的_waitings赋值（也就是说每有一个父模块，这个值+1）
    for (var i = 0; i < len; i++) {
        m = Module.get(uris[i]) // new子模块

        if (m.status < STATUS.LOADED) {
            // 如果还没有加载的情况下，弄。
            // Maybe duplicate: When module has dupliate dependency, it should be it's count, not 1
            m._waitings[mod.uri] = (m._waitings[mod.uri] || 0) + 1
        }
        else { // 如果该子模块加载过了，把当前模块的_remain减一，这种情况下，说的是：多个父模块（a,b）共同引用了一个子模块，在a模块中加载完该子模块之后，在b中就不需要重新加载了
            mod._remain--
        }
    }

    // 如果终于没有剩余的子模块要处理了，ok，执行onload
    if (mod._remain === 0) {
        mod.onload()
        return
    }

    // Begin parallel loading
    // 执行并行加载，这里的requestCache会在子模块的fetch中进行赋值（对象是引用的）
    var requestCache = {}

    for (i = 0; i < len; i++) {
        m = cachedMods[uris[i]]

        if (m.status < STATUS.FETCHING) {
            m.fetch(requestCache)
        }
        else if (m.status === STATUS.SAVED) {
            m.load()
        }
    }

    /**
     * 在m.fetch这一步对requestCache赋值完成之后，遍历之，逐个执行之。
     * 实际上：这些执行，才是真正的script的插入，好绕。
     * 这里之所以这样处理，是因为一个BUG，玉伯有详细的解释，see:https://github.com/seajs/seajs/issues/808
     */

    // Send all requests at last to avoid cache bug in IE6-9. Issues#808
    for (var requestUri in requestCache) {
        if (requestCache.hasOwnProperty(requestUri)) {
            requestCache[requestUri]()
        }
    }
}

// Call this method when module is loaded
Module.prototype.onload = function () {
    var mod = this
    mod.status = STATUS.LOADED
    // 这个时候，状态终于是LOADED了！而这个callback也只有在seajs.use的时候才会用到！
    // 下面转到入口use的callback方法！
    if (mod.callback) {
        mod.callback()
    }

    // Notify waiting modules to fire onload
    // 这个时候，可能本模块的父模块还在等待着本模块的加载完成之后才触发onload方法，所以，有以下判断：
    var waitings = mod._waitings
    var uri, m

    /**
     * 遍历父模块，如果有子模块中包含本模块，将父模块的_remain减去该模块被等待的次数
     * 如果_remain为0，说明：父模块的子模块终于TM的加载完了，OK，执行父模块的onload方法！
     */
    for (uri in waitings) {
        if (waitings.hasOwnProperty(uri)) {
            m = cachedMods[uri]
            m._remain -= waitings[uri]
            if (m._remain === 0) {
                m.onload()
            }
        }
    }

    // Reduce memory taken //最后，垃圾回收
    delete mod._waitings
    delete mod._remain
}

// Fetch a module
/**
 * 这个方法，才真正处理script插入
 * @param requestCache
 */
Module.prototype.fetch = function (requestCache) {
    var mod = this
    var uri = mod.uri

    mod.status = STATUS.FETCHING //更新状态，我是在fetch啊

    // Emit `fetch` event for plugins such as combo plugin
    var emitData = {uri: uri}
    emit("fetch", emitData) // 这里为什么要有个requestUri，see:https://github.com/seajs/seajs/issues/952
    var requestUri = emitData.requestUri || uri // 无论如何，找到了要加载的uri

    // Empty uri or a non-CMD module 如果是个空，或者已经加载过了，别进行了，直接触发onload事件去吧！
    if (!requestUri || fetchedList[requestUri]) {
        mod.load()
        return
    }

    if (fetchingList[requestUri]) { //如果当前模块正在fetch，说明有多个模块引用到该模块了，把这个的模块插入到callbackList中，等时机到了，再触发这个模块的load方法
        callbackList[requestUri].push(mod)
        return
    }

    fetchingList[requestUri] = true //标志着，我正在被fetch呢。
    callbackList[requestUri] = [mod] // 弄到callbackList中，等script标签的onload事件触发时，再用。

    // Emit `request` event for plugins such as text plugin
    // 触发request事件，顺便进行变量赋值，哎。
    // uri为当前的id，requestUri是可能增加的uri，onRequest为回调
    emit("request", emitData = {
        uri: uri,
        requestUri: requestUri,
        onRequest: onRequest,
        charset: data.charset
    })

    // 如果还没有请求过的话，给requestCache赋值，这句很关键哦，在load方法中，就是遍历这个requestCache执行的，执行的是啥？当然是sendRequest了！
    // 如果已经请求过了，ok，别等到插入script成功后了，直接执行sendRequest了
    if (!emitData.requested) {
        requestCache ?
            requestCache[emitData.requestUri] = sendRequest :
            sendRequest()
    }

    /**
     * 这里，调用seajs.request，进行script的插入，回调为onRequest方法。
     * 这里需要说明一下，流程是这样的：
     *
     * 1.插入script标签
     * 2.成功后会立即执行script引入的js内容，js是啥？当然是seajs的define的东西啊，这里，逻辑就跳到了该块的define方法了
     * 3.在define方法中，会对anonymousMeta赋值，不要纳闷
     * 4.define完了之后，会触发script.onload方法，走进onRequest方法
     */
    function sendRequest() {
        seajs.request(emitData.requestUri, emitData.onRequest, emitData.charset)
    }

    function onRequest() {
        delete fetchingList[requestUri] // 先删除fetchingList列表，表示：我fetch完了。
        fetchedList[requestUri] = true // 加入到fetch完了的列表

        // Save meta data of anonymous module
        if (anonymousMeta) { //define中可能会有赋值
            Module.save(uri, anonymousMeta) // 这个save，会将STATUS的值变成SAVED，是2哦
            anonymousMeta = null
        }

        // Call callbacks
        var m, mods = callbackList[requestUri]
        delete callbackList[requestUri]
        while ((m = mods.shift())) m.load()
        /**
         * 这里，有点绕，又去调用load方法了！
         * 回调已经调了，这个时候，script状态已经是loaded了！但是status依然是SAVED哦，为什么不是LOADED呢，因为还不确定：这个模块是否还有子模块木有加载！
         * 如果该模块还有子模块没有加载，进入load方法：
         *  1.搞定_remain和_waitings变量，获得子模块
         *  2.继续进行子模块的fetch，递归递归！！！
         * 如果该模块没有子模块要加载了，就会这样：
         *  1.在load中_remain为0,
         *  2.直接去调用onload了，所以onload的意义是：不仅当前模块加载完毕，而且该模块的子模块也加在完毕~~~
         */
    }
}

// Execute a module
Module.prototype.exec = function () {
    var mod = this

    // When module is executed, DO NOT execute it again. When module
    // is being executed, just return `module.exports` too, for avoiding
    // circularly calling
    // 如果执行过了，mod.exports有值，就别执行了，直接返回吧！
    if (mod.status >= STATUS.EXECUTING) {
        return mod.exports
    }

    // 给予标志，该模块执行过了！
    mod.status = STATUS.EXECUTING

    // Create require
    var uri = mod.uri

    // 下面这些，就是在define内部执行的require
    function require(id) {
        return Module.get(require.resolve(id)).exec() //内部只是得到该模块的引用，因为得define中，已经分析过依赖了
    }

    require.resolve = function (id) { // 处理不合规矩的id
        return Module.resolve(id, uri)
    }

    require.async = function (ids, callback) { //用的是Module.use，跟入口相似，链式调用啊！
        Module.use(ids, callback, uri + "_async_" + cid())
        return require
    }

    // Exec factory
    var factory = mod.factory

    var exports = isFunction(factory) ? //如果factory是个函数，执行该函数，如果返回值exports是undefined，就拿mod.exports
        factory(require, mod.exports = {}, mod) :
        factory

    if (exports === undefined) {
        exports = mod.exports
    }

    // Reduce memory leak
    delete mod.factory

    mod.exports = exports
    mod.status = STATUS.EXECUTED // 终于执行完毕了

    // Emit `exec` event
    emit("exec", mod) // OK,触发exec，插件钩子

    return exports
}

// Resolve id to uri
Module.resolve = function (id, refUri) {
    // Emit `resolve` event for plugins such as text plugin
    var emitData = {id: id, refUri: refUri}
    emit("resolve", emitData)

    return emitData.uri || seajs.resolve(emitData.id, refUri)
}

// Define a module
Module.define = function (id, deps, factory) {
    var argsLen = arguments.length

    // define(factory)
    if (argsLen === 1) {
        factory = id
        id = undefined
    }
    else if (argsLen === 2) {
        factory = deps

        // define(deps, factory)
        if (isArray(id)) {
            deps = id
            id = undefined
        }
        // define(id, factory)
        else {
            deps = undefined
        }
    }

    // 上面这一堆，处理参数的传递
    // 下面，是分析factory代码的依赖(define中的require啊之类的)
    // Parse dependencies according to the module factory code
    if (!isArray(deps) && isFunction(factory)) {
        deps = parseDependencies(factory.toString())
    }

    // 组成一个元数据
    var meta = {
        id: id,
        uri: Module.resolve(id),
        deps: deps,
        factory: factory
    }

    // Try to derive uri in IE6-9 for anonymous modules
    // 处理IE6-9的获取不到uri的问题，思路简单
    if (!meta.uri && doc.attachEvent) {
        var script = getCurrentScript()

        if (script) {
            meta.uri = script.src
        }

        // NOTE: If the id-deriving methods above is failed, then falls back
        // to use onload event to get the uri
    }


    // Emit `define` event, used in nocache plugin, seajs node version etc
    emit("define", meta) // 触发define，给插件留着。

    meta.uri ? Module.save(meta.uri, meta) : // 保存meta数据，便于script.onload触发时用到！
        // Save information for "saving" work in the script onload event
        anonymousMeta = meta
}

// Save meta data to cachedMods
Module.save = function (uri, meta) {
    var mod = Module.get(uri)

    // Do NOT override already saved modules
    if (mod.status < STATUS.SAVED) {
        mod.id = meta.id || uri
        mod.dependencies = meta.deps || []
        mod.factory = meta.factory
        mod.status = STATUS.SAVED

        emit("save", mod)
    }
}

// Get an existed module or create a new one
Module.get = function (uri, deps) {
    return cachedMods[uri] || (cachedMods[uri] = new Module(uri, deps))
}

// Use function is equal to load a anonymous module
Module.use = function (ids, callback, uri) {
    // 执行Module.get方法，new出一个Module类，其中，随机的uri为id，真正的入口子模块id作为依赖传入
    var mod = Module.get(uri, isArray(ids) ? ids : [ids])

    //给mod对象赋予callback回调，做最后的处理
    //该入口loaded之后，来到这里！
    mod.callback = function () {
        var exports = []
        var uris = mod.resolve()

        // 因为是入口，所以要拿到所有的子模块，进行执行！
        for (var i = 0, len = uris.length; i < len; i++) {
            exports[i] = cachedMods[uris[i]].exec()
        }

        if (callback) { // 如果传入的有callback，那么执行之
            callback.apply(global, exports)
        }

        delete mod.callback
    }

    //执行load过程（经过处理，执行当前模块的子模块的script标签插入）
    mod.load()
}


// Public API
/**
 * seajs的入口，ids为入口的js，callback为所有的依赖加载完成之后执行
 */
seajs.use = function (ids, callback) {
    // Module.use -> function use(deps,callback,uri)
    // 这里的用意为：模拟一个虚拟的父模块，把引入的入口模块作为其子模块，以便完成seajs的统一的加载过程
    // uri为随机制定的，data.cwd的location.href的最后路径 http://www.com/a/b/c.js -> http://www.com/a/b/
    Module.use(ids, callback, data.cwd + "_use_" + cid())
    return seajs
}

Module.define.cmd = {}
global.define = Module.define


// For Developers

seajs.Module = Module
data.fetchedList = fetchedList
data.cid = cid

seajs.require = function (id) {
    var mod = Module.get(Module.resolve(id))
    if (mod.status < STATUS.EXECUTING) {
        mod.onload()
        mod.exec()
    }
    return mod.exports
}


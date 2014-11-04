/**
 * file: mod.js
 * ver: 1.0.7
 * update: 2014/4/14
 *
 * https://github.com/zjcqoo/mod
 */
var require, define;

(function(global) {
    var head = document.getElementsByTagName('head')[0],
        loadingMap = {},
        factoryMap = {},
        modulesMap = {},
        scriptsMap = {},
        resMap = {},
        pkgMap = {};



    function createScript(url, onerror) {
        if (url in scriptsMap) return; //已经加载过了，跳出
        scriptsMap[url] = true; //设定已经加载的标志位

        var script = document.createElement('script');
        if (onerror) {
            var tid = setTimeout(onerror, require.timeout);  //设置超时，如果在超时时间内还没有加载上来，那就执行onerror

            // see: http://www.cnblogs.com/rubylouvre/archive/2011/02/12/1952160.html
            // and: http://www.cnblogs.com/snandy/archive/2011/04/29/2032376.html
            // and: http://www.cnblogs.com/chyingp/archive/2012/11/15/scriptOnerrorNotSupportedInIE6to8.html
            // 这里的onerror是有问题的，也是无奈？
            // 在IE 6 7 8 Opera中，只有在超时的时候才会触发onerror，而支持error的浏览器是直接触发的
            script.onerror = function() { //在script标签上注册error事件，在其中，清楚timeout计时，执行传入的onerror
                clearTimeout(tid);
                onerror();
            };

            function onload() { //onload做的很简单，直接清除settimeout的计时
                clearTimeout(tid);
            }

            //下面为script.onload 的事件兼容，目的为：在script上注册onload事件
            // see: http://zhangyaochun.iteye.com/blog/1198701
            if ('onload' in script) {
                script.onload = onload;
            }
            else {
                script.onreadystatechange = function() {
                    if (this.readyState == 'loaded' || this.readyState == 'complete') {
                        onload();
                    }
                }
            }
        }
        script.type = 'text/javascript'; //没什么可说的，将script加入到head中，赋值src，加载之
        script.src = url;
        head.appendChild(script);
        return script;
    }

    function loadScript(id, callback, onerror) {
        var queue = loadingMap[id] || (loadingMap[id] = []);
        queue.push(callback);

        //
        // resource map query
        //
        var res = resMap[id] || {};
        var pkg = res.pkg;
        var url;

        if (pkg) {
            url = pkgMap[pkg].url;
        } else {
            url = res.url || id;
        }

        createScript(url, onerror && function() { //调用createScript，传入onerror
            onerror(id);
        });
    }

    define = function(id, factory) { //维护一个factorMap对象，id:factory
        factoryMap[id] = factory;

        var queue = loadingMap[id]; //队列，等会再看
        if (queue) {
            for(var i = 0, n = queue.length; i < n; i++) {
                queue[i]();
            }
            delete loadingMap[id];
        }
    };

    require = function(id) {
        id = require.alias(id); // var alias = function (id) {return id;} 暂时还没发现有什么用

        var mod = modulesMap[id]; //如果之前有定义的话，直接返回了，所以这里一定要注意不能让两个模块的id相同，要不然第二个就没有用了
        if (mod) {
            return mod.exports;
        }

        //
        // init module
        //
        var factory = factoryMap[id];
        if (!factory) {
            throw '[ModJS] Cannot find module `' + id + '`'; //如果没有define，则直接简单的报错
        }

        mod = modulesMap[id] = { //后面会将执行过的ret保存到这里，免得会有多次重复的调用
            exports: {}
        };

        //
        // factory: function OR value
        //
        var ret = (typeof factory == 'function') //如果是个函数，执行之（传入require,exports,mod::{exports:{}}），在define的时候，会给mod.exports赋值
            ? factory.apply(mod, [require, mod.exports, mod])
            : factory;

        if (ret) {
            mod.exports = ret; //如果有返回值的话，会将mod的值给改变
        }

        // 在define中，如果module.exports = {}赋值的话，先生效，如果有return的话，则按照return的值

        return mod.exports;
    };

    /**
     * require.async(['b.js','c.js'],function () {},function () {console.log('error');});
     */
    require.async = function(names, onload, onerror) {
        if (typeof names == 'string') { //name可以传入数组，如果传的是字符串，包装成数组
            names = [names];
        }

        for(var i = 0, n = names.length; i < n; i++) { //逐个调用别名，现在还没什么用
            names[i] = require.alias(names[i]);
        }

        var needMap = {};
        var needNum = 0;

        function findNeed(depArr) {
            for(var i = 0, n = depArr.length; i < n; i++) {
                //
                // skip loading or loaded
                //
                var dep = depArr[i];
                if (dep in factoryMap || dep in needMap) { //如果已经define的话，或者正在加载，退出
                    continue;
                }

                needMap[dep] = true; // 设置标志位
                needNum++;
                loadScript(dep, updateNeed, onerror);

                var child = resMap[dep];
                if (child && 'deps' in child) {
                    findNeed(child.deps);
                }
            }
        }

        function updateNeed() {
            if (0 == needNum--) {
                var args = [];
                for(var i = 0, n = names.length; i < n; i++) {
                    args[i] = require(names[i]);
                }

                onload && onload.apply(global, args);
            }
        }

        findNeed(names);
        updateNeed();
    };

    /**
     * 这个API没有公开
     * require.responseMap({
     *  res:{
     *      moduleAId:{
     *          pkg:moduleAPkg
     *      }
     *  },
     *  pkg:{
     *      moduleAPkg:{
     *          url:'moduleA.js'
     *      }
     *  }
     * });
     */
    require.resourceMap = function(obj) {
        var k, col;

        // merge `res` & `pkg` fields
        col = obj.res;
        for(k in col) {
            if (col.hasOwnProperty(k)) {
                resMap[k] = col[k];
            }
        }

        col = obj.pkg;
        for(k in col) {
            if (col.hasOwnProperty(k)) {
                pkgMap[k] = col[k];
            }
        }
    };

    require.loadJs = function(url) {
        createScript(url);
    };

    require.loadCss = function(cfg) {
        if (cfg.content) {
            var sty = document.createElement('style');
            sty.type = 'text/css';

            if (sty.styleSheet) {       // IE
                sty.styleSheet.cssText = cfg.content;
            } else {
                sty.innerHTML = cfg.content; //W3C
            }
            head.appendChild(sty);
        }
        else if (cfg.url) {
            var link = document.createElement('link'); //创建一个link标签，塞进head中
            link.href = cfg.url;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            head.appendChild(link);
        }
    };


    require.alias = function(id) {return id}; //估计是要有这个功能木有实现吧

    require.timeout = 5000; //默认超时时间

})(this);
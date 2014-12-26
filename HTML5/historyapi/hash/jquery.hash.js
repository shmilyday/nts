/**
 * Created by yangluguang on 2014/12/18.
 */
(function ($) {
    var uniquePrefixNumber = 0,
        prefixCache = [];

    function uniquePrefix() {
        return 'abcdefghijklmnopqrstuvwxyz'.split('')[uniquePrefixNumber++];
    }

    function getRandomPrefix() {
        var up = uniquePrefix();
        return prefixCache.indexOf(up) !== -1 ? getRandomPrefix() : up;
    }

    function getRawHash() {
        return location.hash.split('#')[1] || '';
    }

    function encodeHash(obj) {
        var ret = [],
            ele, v;
        for (ele in obj) {
            if (!obj.hasOwnProperty(ele)) continue;
            v = obj[ele];
            if ($.isArray(v)) {
                v = v.join(',');
            }
            ret.push(ele + '=' + v);
        }
        return '#' + ret.join('&');
    }

    function decodeHash(rawHash) {
        var kvs = rawHash.split('&'), key, values, ret = {};

        for (var i = 0, len = kvs.length; i < len; i++) {
            values = kvs[i];
            if (!values) continue;
            values = values.split('=');
            ret[values[0]] = values[1];
        }

        return ret;
    }

    var hashCache = {};

    /**
     * 构造函数
     * @param prefix
     * @param noPrefix
     * @constructor
     */
    function Hash(prefix, noPrefix) {
        this.noPrefix = noPrefix;
        if (hashCache[prefix]) {
            throw 'prefix:' + prefix + ' is exist , please replace other one';
        }

        this.prefix = prefix || getRandomPrefix();
        prefixCache.push(this.prefix);

        hashCache[this.prefix] = {
            keys: [],
            handleObj: []
        };
    }

    Hash.prototype = {
        constructor: Hash,
        _getPrefixKey: function (key) {
            return !this.noPrefix ? this.prefix + '|' + key : key;
        },
        _getCleanKey: function (key) {
            return !this.noPrefix ? key.replace(this.prefix + '|', '') : key;
        },
        autoSet: function () {
            var hashObj = decodeHash(getRawHash()),
                ret = {};

            if (this.noPrefix) {
                ret = hashObj;
            } else {
                for (var o in hashObj) {
                    if (o.indexOf(this.prefix + '|') === 0) {
                        ret[this._getCleanKey(o)] = hashObj[o];
                    }
                }
            }

            this.set(ret);
            return this;
        },
        /**
         * 设置hash值
         * 1.set('a','somename')
         * 2.set({
         *      a: 'somename',
         *      age: 123
         *  })
         */
        set: (function () {
            var _setSingle = function (kk, vv, hashObj) {
                var hashKeyCache = hashCache[this.prefix].keys;
                kk = this._getPrefixKey(kk);
                hashObj[kk] = vv;
                if (vv == null) {
                    delete hashObj[kk];
                }
                $.inArray(kk, hashKeyCache) === -1 && hashKeyCache.push(kk);

                return hashObj;
            };

            return function (key, value) {
                var hashObj = decodeHash(getRawHash()),
                    hashKeyCache = hashCache[this.prefix].keys;
                if (typeof key === 'object') {
                    for (var ele in key) {
                        if (!key.hasOwnProperty(ele)) continue;
                        hashObj = _setSingle.call(this, ele, key[ele], hashObj);
                    }
                }
                else {
                    hashObj = _setSingle.call(this, key, value, hashObj);
                }
                location.hash = encodeHash(hashObj);
                return this;
            }
        })(),
        /**
         * 获取hash值
         * @param key 如果key为空，则获取该模块下的所有hash值
         * @returns {*}
         */
        get: function (key) {
            var hashObj = decodeHash(getRawHash());
            if (key == null) {
                var keys = hashCache[this.prefix].keys,
                    ret = {};
                for (var i = 0, len = keys.length; i < len; i++) {
                    ret[this._getCleanKey(keys[i])] = hashObj[keys[i]];
                }
                return ret;
            }
            key = this._getPrefixKey(key);
            if ($.inArray(key, hashCache[this.prefix].keys) === -1) return;
            return hashObj[key];
        },
        /**
         * 移除hash值，remove('a','b','c')，也可以用set('a',null) 代替
         * @returns {Hash}
         */
        remove: function () {
            var ret = {},
                args = Array.prototype.slice.call(arguments, 0);
            for (var i = 0; i < args.length; i++) {
                ret[args[i]] = null;
            }
            this.set(ret);
            return this;
        },
        /**
         * 注册函数（在hash值发生变化时触发）
         * @param option 可以是一个function，也可以是{fn:function () {},scope:{someobject}}
         * @returns {Hash}
         */
        on: function (option) {
            if ($.isFunction(option)) {
                option = {fn: option};
            }

            var fn = option.fn || option.callback || function () {
                    },
                scope = option.scope || this;
            hashCache[this.prefix].handleObj.push({
                fn: fn,
                scope: scope
            });
            return this;
        },
        /**
         * 解绑函数
         * 如果传入空值，则将该模块下的所有方法全部解绑，如果传入函数，则只解绑该函数
         * @returns {Hash}
         */
        off: function () {
            var args = Array.prototype.slice.call(arguments, 0);
            if (args.length === 0) {
                hashCache[this.prefix].handleObj = [];
            } else {
                var handleObj = hashCache[this.prefix].handleObj;
                var dels = [];

                for (var i = 0, len = handleObj.length; i < len; i++) {
                    var ho = handleObj[i];
                    $.inArray(ho.fn, args) !== -1 && dels.push(ho);
                }

                for (var i = 0, len = dels.length; i < len; i++) {
                    hashCache[this.prefix].handleObj.splice($.inArray(dels[i], handleObj), 1);
                }
            }
            return this;
        },
        /**
         * 手动触发已注册过的函数
         * @param force 如果hash值为空的话，默认情况是不会触发已注册过的函数的。如果force为true，则强制触发
         * @returns {Hash} 链式调用
         */
        trigger: function (force) {
            if (!force) {
                var hashRaw = getRawHash();
                if (!force && hashRaw === '') return;
            }

            var nsCache = hashCache[this.prefix],
                handleObj = nsCache.handleObj,
                ele;
            for (var i = 0, len = nsCache.handleObj.length; i < len; i++) {
                ele = nsCache.handleObj[i];
                ele.fn.call(ele.scope, nsCache.keys, nsCache.keys);
            }
            return this;
        },
        /**
         * 得到该模块的前缀
         * @returns {*|Hash.prefix}
         */
        getPrefix: function () {
            return this.prefix;
        },
        /**
         * 销毁对象
         */
        dispose: function () {
            hashCache[this.prefix] = {
                keys: [],
                handleObj: []
            };
        }
    };

    function containArray(keys, changeArray) {
        var ret = false;
        for (var i = 0, len = changeArray.length; i < len; i++) {
            if ($.inArray(changeArray[i], keys) !== -1) {
                ret = true;
                break;
            }
        }
        return ret;
    }

    // see: http://zhangyaochun.iteye.com/blog/1698191
    // and: https://developer.mozilla.org/en-US/docs/Web/Events/hashchange
    // and: http://www.ruanyifeng.com/blog/2011/03/url_hash.html
    // IE9+

    $(window).on('hashchange', function (e) {
        var hashChangeEvent = e.originalEvent,
            newHashObj = decodeHash(hashChangeEvent.newURL.split('#')[1] || ''),
            oldHashObj = decodeHash(hashChangeEvent.oldURL.split('#')[1] || ''),
            changeKey = [], ele, ns, nsCache;

        for (ele in newHashObj) {
            oldHashObj[ele] !== newHashObj[ele] && $.inArray(ele, changeKey) === -1 && changeKey.push(ele);
        }

        for (ele in oldHashObj) {
            oldHashObj[ele] !== newHashObj[ele] && $.inArray(ele, changeKey) === -1 && changeKey.push(ele);
        }

        for (ns in hashCache) {
            nsCache = hashCache[ns];
            if (!containArray(nsCache.keys, changeKey)) continue;
            for (var i = 0, len = nsCache.handleObj.length; i < len; i++) {
                ele = nsCache.handleObj[i];
                ele.fn.call(ele.scope, nsCache.keys, changeKey);
            }
        }
    });

    $.extend({
        hash: {
            /**
             *
             * @param prefix 前缀，也是唯一标示，最好是一个字母，如果不指定，会默认制定
             * @param noPrefix 强制不加前缀，不建议
             * @returns {Hash} 返回Hash对象
             */
            init: function (prefix, noPrefix) {
                var hash = new Hash(prefix, noPrefix);

                //init的时候，尝试触发
                hash.autoSet();
                return hash;
            }
        }
    });
})(jQuery);
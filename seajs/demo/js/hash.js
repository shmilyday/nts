/**
 * Created by yangluguang@baidu.com on 2014/11/12.
 */

define(function (require, exports, module) {

    var uniqueNumber = 0;

    function uniqueId() {
        return 'hash_namespace_' + uniqueNumber++;
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
            if (Object.prototype.toString.call(v) === '[object Array]') {
                v = v.join(',')
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

    function Hash(namespace) {
        this.namespace = namespace || uniqueId();

        if (hashCache[namespace]) {
            throw '该命名空间已经有注册，请换个';
        }

        hashCache[this.namespace] = {
            keys: [],
            handleObj: []
        };
    }

    Hash.prototype = {
        constructor: Hash,
        set: function (key, value) {
            var hashObj = decodeHash(getRawHash()),
                hashKeyCache = hashCache[this.namespace].keys;
            if (typeof key === 'object') {
                for (var ele in key) {
                    if (key.hasOwnProperty(ele)) hashObj[ele] = key[ele];
                    hashKeyCache.indexOf(ele) === -1 && hashKeyCache.push(ele);
                }
            }
            else {
                hashObj[key] = value;
                hashKeyCache.indexOf(key) === -1 && hashKeyCache.push(key);
            }
            location.hash = encodeHash(hashObj);
        },
        get: function (key) {
            if (hashCache[this.namespace].keys.indexOf(key) === -1) return;
            var hashObj = decodeHash(getRawHash());
            return hashObj[key];
        },
        on: function (option) {
            var fn = option.fn || option.callback || function () {
                    },
                scope = option.scope || this;
            hashCache[this.namespace].handleObj.push({
                fn: fn,
                scope: scope
            });
        },
        getNS: function () {
            return this.namespace;
        }
    };

    function containArray(keys, changeArray) {
        var ret = false;
        for (var i = 0, len = changeArray.length; i < len; i++) {
            if (keys.indexOf(changeArray[i]) !== -1) {
                ret = true;
                break;
            }
        }
        return ret;
    }

    window.onhashchange = function (hashChangeEvent) {
        var newHashObj = decodeHash(hashChangeEvent.newURL.split('#')[1] || ''),
            oldHashObj = decodeHash(hashChangeEvent.oldURL.split('#')[1] || ''),
            changeKey = [], ele, ns, nsCache;

        for (ele in newHashObj) {
            oldHashObj[ele] !== newHashObj[ele] && changeKey.indexOf(ele) === -1 && changeKey.push(ele);
        }

        for (ele in oldHashObj) {
            oldHashObj[ele] !== newHashObj[ele] && changeKey.indexOf(ele) === -1 && changeKey.push(ele);
        }

        for (ns in hashCache) {
            nsCache = hashCache[ns];
            if (!containArray(nsCache.keys, changeKey)) continue;
            for (var i = 0, len = nsCache.handleObj.length; i < len; i++) {
                ele = nsCache.handleObj[i];
                typeof ele.fn === 'function' && ele.fn.call(ele.scope, changeKey, nsCache);
            }
        }
    };

    return Hash;
});
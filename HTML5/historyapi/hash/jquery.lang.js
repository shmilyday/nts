/**
 * Created by yangluguang@baidu.com on 2014/11/13.
 */

$.extend({
    string: {
        format: function (format) {
            var args = Array.prototype.slice.call(arguments, 1);
            if (Object.prototype.toString.call(format) === '[object Array]') format = format.join('');
            return format.replace(/\{(\d+)\}/g, function (m, i) {
                return args[i];
            });
        }
    },
    function: {
        /**
         * 函数节流
         * see: http://www.cnblogs.com/ambar/archive/2011/10/08/throttle-and-debounce.html
         * and: http://underscorejs.org/#throttle
         * and:
         * @param func
         * @param wait
         * @returns {Function}
         */
        throttle: function (func, wait) {
            var context, args, timeout, result;
            var previous = 0;
            var later = function () {
                previous = new Date;
                timeout = null;
                result = func.apply(context, args);
            };
            return function () {
                var now = new Date;
                var remaining = wait - (now - previous);
                context = this;
                args = arguments;
                if (remaining <= 0) {
                    clearTimeout(timeout);
                    timeout = null;
                    previous = now;
                    result = func.apply(context, args);
                } else if (!timeout) {
                    timeout = setTimeout(later, remaining);
                }
                return result;
            };
        },
        /**
         * 函数去抖
         * see: http://underscorejs.org/#debounce
         * @param func 传入的执行函数
         * @param wait 等待的时间
         * @param immediate 是否第一次触发
         * @returns {Function}
         */
        debounce: function (func, wait, immediate) {
            var timeout, result;
            return function () {
                var context = this, args = arguments;
                var later = function () {
                    timeout = null;
                    if (!immediate) result = func.apply(context, args);
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) result = func.apply(context, args);
                return result;
            };
        }
    },

    number: {
        local: function (value) {
            if (typeof value !== 'number') {
                return value || '-';
            }

            var valueString = value + '', dotIndex, littleString;

            if ((dotIndex = valueString.indexOf('.')) !== -1) {
                littleString = valueString.substring(dotIndex + 1);
                if (littleString.length === 1) {
                    valueString += '0';
                }
            } else {
                valueString = valueString + '.00';
            }

            var dotIndex = valueString.indexOf('.'),
                isNeg = valueString.substring(0, 1) === '-';

            var prefix = valueString.substring(isNeg ? 1 : 0, dotIndex),
                suffix = valueString.substring(dotIndex + 1),
                prefixRet = [],
                len = prefix.length, curr = 0;

            //console.log(prefix, suffix);

            while (len--) {
                if (curr++ % 3 === 0) {
                    curr !== 1 && prefixRet.unshift(',');
                }
                prefixRet.unshift(prefix[len]);
            }

            return '￥' + (isNeg ? '-' : '') + prefixRet.join('') + '.' + suffix;
        }
    },
    utils: {
        clearSorter: function (v1, v2) {
            v1 = parseFloat(v1.replace('小时', '').replace('%', ''));
            v2 = parseFloat(v2.replace('小时', '').replace('%', ''));
            return v1 - v2;
        }
    }
});
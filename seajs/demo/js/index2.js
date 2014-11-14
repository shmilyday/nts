/**
 * Created by yangluguang on 2014/11/14.
 */

define(function (require, exports, module) {
    //seajs.resolve('twojs/hash.js');

    //测试replace

    var math = require('js/math');

    var fmt = '{0}是一个{1}人';

    var ret = format(fmt, '我', '中国');

    console.log(ret);

    function format(fmt) {
        var args = Array.prototype.slice.call(arguments, 1);
        return fmt.replace(/{(\d+)}/g, function (m, i) {
            //console.log(arguments);
            return args[i];
        });
    }
});
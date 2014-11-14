/**
 * Created by yangluguang on 2014/11/12.
 */

define(function (require, exports, module) {
    function inherit(parent, child) {
        var f = function () {
        }
        f.prototype = parent.prototype;
        child.prototype = new f();
        child.prototype.constructor = child;
        child.prototype.superclass = parent.prototype;
    }

    return {
        inherit: inherit
    };
});
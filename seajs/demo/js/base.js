/**
 * Created by yangluguang on 2014/11/12.
 */

define(function (require, exports, module) {
    function Base(name) {
        this.name = name;
    }

    Base.prototype.sayName = function () {
        return 'hello , ' + this.name;
    }

    return Base;
});
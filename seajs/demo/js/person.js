/**
 * Created by yangluguang on 2014/11/12.
 */

define(function (require, exports, module) {
    var Base = require('base'),
        utils = require('utils');

    function Person(name, age) {
        //Base.call(this, name);
        Person.prototype.superclass.constructor.call(this, name);
        this.age = age;
    }

    utils.inherit(Base, Person);

    Person.prototype.sayName = function () {
        return 'hello , ' + this.name + ' , ' + this.age;
    };

    Person.prototype.saySuperName = function () {
        return Person.prototype.superclass.sayName.call(this);
    };

    return Person;
});
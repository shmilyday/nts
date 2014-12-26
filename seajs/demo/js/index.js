/**
 * Created by yangluguang on 2014/11/12.
 */

define(function (require, exports, module) {
    var hashinit = require('hash');

    var hash1 = hashinit('namespace1', 's');
    var hash2 = hashinit('namespace2', 'f');

    function fn1(changeKey, keys) {
        console.log('hash1', changeKey, keys);
    }

    function fn2(changeKey, keys) {
        console.log('hash11111', changeKey, keys);
    }

    hash1.on({
        fn: fn1,
        scope: this
    });

    hash1.on({
        fn: fn2,
        scope: this
    });

    hash1.off(fn1);


    /*hash2.on({
     fn: function (changeKey, handleObj) {
     console.log('hash2', changeKey, handleObj);
     },
     scope: this
     });

     hash2.on({
     fn: function (changeKey, handleObj) {
     console.log('hash2222222222222222222', changeKey, handleObj);
     },
     scope: this
     });

     hash2.on({
     fn: function (changeKey, handleObj) {
     console.log('hash22222', changeKey, handleObj);
     },
     scope: this
     });*/


    //hash1.set({a: 'b', c: 'd', e: 'f'});
    //hash1.set({aa: 'bb', cc: 'dd', ee: 'ff'});
    //hash1.set('a', Math.random());

    hash1.set('a', Math.random());

    //console.log('----------------------------------');

    //hash2.set({'aaaa': 'bbbbbb'});

    //hash1.set('a', null);
    //hash1.remove('a', 'e');

});
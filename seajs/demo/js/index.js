/**
 * Created by yangluguang on 2014/11/12.
 */

define(function (require, exports, module) {
    var hashinit = require('hash');

    var hash1 = hashinit('namespace1', 's');
    var hash2 = hashinit('namespace2', 'f');

    hash1.on({
        fn: function (changeKey, handleObj) {
            console.log('hash1', changeKey, handleObj);
        },
        scope: this
    });

    hash1.on({
        fn: function (changeKey, handleObj) {
            console.log('hash11111', changeKey, handleObj);
        },
        scope: this
    });


    hash2.on({
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
    });


    hash1.set({a: 'b', c: 'd', e: 'f'});

    console.log('----------------------------------');

    hash2.set({'aaaa': 'bbbbbb'});

    //hash1.set('a', null);
    hash1.remove('a', 'e');

});
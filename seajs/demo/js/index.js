/**
 * Created by yangluguang on 2014/11/12.
 */

define(function (require, exports, module) {
    var Hash = require('hash');

    var ahash = new Hash();

    var hash1 = new Hash('namespace1');
    var hash2 = new Hash('namespace2');

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



});
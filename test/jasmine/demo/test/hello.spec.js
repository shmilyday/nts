describe('hello,world', function() {
    it('say hello', function() {
        expect(hello()).toEqual('Hello,World');
    });
    

    it('test toContain method', function() {
        expect(hello()).toContain('World');
    });

    it('test other method', function() {
        expect(hello()).toContain('Hello');
    });


    it('test 1 and 1', function() {
        expect(1).toEqual(1);
    });

    it('test toBe', function() {
        expect({
            a: 'b'
        }).toEqual({
            a: 'b'
        });
    });

    it('test toBe other', function() {
        expect({
            a: 'b'
        }).not.toBe({
            a: 'b'
        });
    });

    it('test toBe primary', function() {
        expect('1').toBe('1');
    });

    it('test ToBeTruthy', function() {
        expect(1).toBeTruthy();
    });

    it('test toBeFalsy', function() {
        expect(null).toBeFalsy();
    });

    it('test true', function() {
        expect(true).toEqual(true);
    });

    it('test false', function() {
        expect(false).toEqual(false);
    });

    it('test not hello', function() {
        expect(hello()).not.toEqual('aaaaa');
    });

    it('test not contain', function() {
        expect(hello()).not.toContain('abbbbb');
    });

    it('test toContain', function() {
        expect([1, 2, 3, 4, 5, 6, 7]).toContain(2);
    });

    it('test toContain object', function() {
        expect({
            a: 'b',
            c: 'd',
            e: 'f'
        }).not.toContain({
            a: 'b'
        });
    });

    it('test toContaine array', function() {
        expect([{
            a: 'b'
        }, {
            c: 'd'
        }]).toContain({
            a: 'b'
        });
    });


    it('test toContain object Array', function() {
        expect([{
            a: 'b'
        }, {
            c: 'd'
        }]).not.toContain({
            a: 'cccc'
        });
    });

    it('test toBeDefined',function () {
        expect('hello').toBeDefined();
    });

    it('test toBeDefined 2',function () {
        var a;
        expect(a).not.toBeDefined();
    });

    it('test toBeUndefined',function () {
        var b;
        expect(b).toBeUndefined();
    });

    it('test ToBeNull',function () {
        expect(null).toBeNull();
    });

    it('test toBeNaN',function () {
        expect(0/0).toBeNaN();
    });

    it('test toBeGreaterThan',function () {
        expect(8).toBeGreaterThan(5);
        expect(3).toBeLessThan(12);
        expect('a').toBeLessThan('z');
    });


    var someVar = 123;

    beforeEach(function () {
        someVar = 456;
    });

    it('test beforeEach',function () {
        expect(someVar).toEqual(456);
    });

    afterEach(function () {
        someVar = undefined;
    });

    xit('test x',function () {
        // xxxxxx

        alert(1);
    });


});
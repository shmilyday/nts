var fn1 = function(a, b, c) {
	return a + b + c;
};
console.log(fn1.length);
console.log(fn1.toString());
var fn1String = fn1.toString();
var fn2 = new Function('a', 'b', 'c', 'alert(1);');
console.dir(fn2);

function add1() {
	var ret = 0;
	for (var i = 0; i < arguments.length; i++) {
		ret += arguments[i];
	}
	return ret;
}

function add2() {
	var ret = 0,
		args = Array.prototype.slice.call(arguments, 0);
	for (var i = 0; i < args.length; i++) {
		ret += args[i];
	}
	return ret;
}
console.time('add1');
for (var i = 0; i < 1000000; i++) {
	add1(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
}
console.timeEnd('add1');

console.time('add2');
for (var i = 0; i < 1000000; i++) {
	add2(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
}
console.timeEnd('add2');
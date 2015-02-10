var person1 = {
	name: 'lonelyclick'
};

console.log('name' in person1);
console.log('toString' in person1);
console.log(person1.hasOwnProperty('name'));
console.log(person1.hasOwnProperty('toString'));

console.log();
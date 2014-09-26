require(
[
    '../src/zrender', '../src/shape/Path'
], function( zrender, PathShape )
{

	var box = document.getElementById('box');
	var zr = zrender.init(box);

	zr.addShape(new PathShape(
	{
		style:
		{
			x: 0,
			y: 0,
			path: 'M80 80 A 45 45, 0, 0, 0, 125 125 L 125 80 Z',
			color: '#F60',
			textPosition: 'inside',
			textColor: 'red',
			strokeColor: 'black'
		},
		draggable: true
	}));
	
	zr.addShape(new PathShape(
	{
		style:
		{
			x: 0,
			y: 0,
			path: 'M230 80 A 45 45, 0, 1, 0, 275 125 L 275 80 Z',
			color: '#F60',
			textPosition: 'inside',
			textColor: 'red',
			strokeColor: 'black'
		},
		draggable: true
	}));

	zr.render();
});

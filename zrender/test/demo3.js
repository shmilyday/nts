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
			path: 'M 10 315 L 110 215 A 30 50 0 0 1 162.55 162.45 L 172.55 152.45 A 30 50 -45 0 1 215.1 109.9 L 315 10',
			color: 'black',
			text: 'path',
			textPosition: 'inside',
			textColor: 'red',
			strokeColor: 'black'
		},
		draggable: true
	}));

	zr.render();
});

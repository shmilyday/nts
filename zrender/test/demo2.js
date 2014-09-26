require(
[
    '../src/zrender', '../src/shape/Image', '../src/shape/Text', '../src/shape/Circle', '../src/loadingEffect/Bar', '../src/shape/Line'
], function( zrender, ImageShape, TextShape, CircleShape, BarEffect, LineShape )
{

	var box = document.getElementById('box');
	var zr = zrender.init(box);

	/*
	 * zr.addShape(new CircleShape( { style: { x: 120, y: 120, r: 50, color: 'red' }, // hoverable: true, clickable: true, onclick: function() { // alert('click
	 * on red shape!')
	 * 
	 * zr.showLoading(new BarEffect( { textStyle: { text: '加载中' } })); } }));
	 */

	var imageShape = new ImageShape(
	{
		style:
		{
			x: 0,
			y: 0,
			image: '../../blog/dom.png'
		}
	});

	// zr.addShape(imageShape);

	zr.addShape(new LineShape(
	{
		style:
		{
			xStart: 0,
			yStart: 100,
			xEnd: 300,
			yEnd: 100,
			strokeColor: 'black',
			lineWidth: 1
		}
	}));

	zr.addShape(new LineShape(
	{
		style:
		{
			xStart: 100,
			yStart: 0,
			xEnd: 100,
			yEnd: 300,
			strokeColor: 'black',
			lineWidth: 1
		}
	}));

	zr.addShape(new TextShape(
	{
		style:
		{
			x: 100,
			y: 100,
			color: 'red',
			text: 'Align:right;\nBaseline:bottom',
			textAlign: 'right',
			textBaseline: 'bottom'
		},
		hoverable: true,
		zlevel: 2
	}));
	
	zr.addShape(new TextShape(
	{
		style:
		{
			x: 100,
			y: 100,
			color: 'red',
			text: 'Align:right;\nBaseline:top',
			textAlign: 'right',
			textBaseline: 'top'
		},
		hoverable: true,
		zlevel: 2
	}));
	
	zr.addShape(new TextShape(
	{
		style:
		{
			x: 100,
			y: 100,
			color: 'red',
			text: 'Align:left;\nBaseline:bottom',
			textAlign: 'left',
			textBaseline: 'bottom'
		},
		hoverable: true,
		zlevel: 2
	}));
	
	zr.addShape(new TextShape(
	{
		style:
		{
			x: 100,
			y: 100,
			color: 'red',
			text: 'Align:left;\nBaseline:top',
			textAlign: 'left',
			textBaseline: 'top'
		},
		hoverable: true,
		zlevel: 2
	}));

	zr.render();
});

export default function renderPieChart(context, x, y, radius, value) {
	context.fillStyle = 'black';
	context.beginPath();
	drawArc(context, x, y, radius, 0, 1);
	context.fill();

	context.fillStyle = 'white';
	context.beginPath();
	drawArc(context, x, y, radius, 0, value.pieChartValuePositive / 2);
	context.fill();
	context.beginPath();
	drawArc(context, x, y, radius, -value.pieChartValueNegative / 2, 0);
	context.fill();
}

function drawArc(context, x, y, radius, start, end) {
	let transformAngle = a => (a - 0.5) * Math.PI * 2;
	context.moveTo(x, y);
	context.arc(x, y, radius, transformAngle(start), transformAngle(end), false);
	context.lineTo(x, y);
}

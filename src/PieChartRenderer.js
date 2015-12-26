export default function renderPieChart(context, x, y, radius, value) {
	context.fillStyle = 'green';
	drawArc(context, x, y, radius, 0, value.pieChartValuePositive / 2);
	context.fillStyle = 'red';
	drawArc(context, x, y, radius, -value.pieChartValueNegative / 2, 0);
}

function drawArc(context, x, y, radius, start, end) {
	let transformAngle = a => (a - 0.5) * Math.PI * 2;
	context.beginPath();
	context.moveTo(x, y);
	context.arc(x, y, radius, transformAngle(start), transformAngle(end));
	context.lineTo(x, y);
	context.fill();
}

function Icicle(container) {
	var width = 960;
	var height = 500;

	var x = d3.scale.linear()
			.range([0, width]);

	var y = d3.scale.linear()
			.range([0, height]);

	var color = d3.scale.category20c();

	var partition = d3.layout.partition()
			.children(function (d) {
				return d.children;
			})
			.value(function (d) {
				return 1;
			});

	var svg = d3.select(container)
			.append('svg')
			.attr("width", width)
			.attr("height", height);

	this.update = function(tree) {
		var rect = svg.selectAll("rect")
		rect = rect
				.data(partition(tree.root))
				.enter().append("rect")
				.attr("x", function (d) {
					return x(d.x);
				})
				.attr("y", function (d) {
					return y(d.y);
				})
				.attr("width", function (d) {
					return x(d.dx);
				})
				.attr("height", function (d) {
					return y(d.dy);
				})
				.attr("fill", function (d) {
					return color((d.children ? d : d.parent).key);
				})
				.attr("title", function (d) {
					return d.key;
				})
				.on("click", clicked);

	};
	function clicked(d) {
		x.domain([d.x, d.x + d.dx]);
		y.domain([d.y, 1]).range([d.y ? 20 : 0, height]);

		rect.transition()
				.duration(750)
				.attr("x", function (d) {
					return x(d.x);
				})
				.attr("y", function (d) {
					return y(d.y);
				})
				.attr("width", function (d) {
					return x(d.x + d.dx) - x(d.x);
				})
				.attr("height", function (d) {
					return y(d.y + d.dy) - y(d.y);
				});
	}
}

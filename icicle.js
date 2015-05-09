function createIcicle(tree, container) {
	var width = 300;
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
			.attr("height", height)
			.attr("class", "icicle");

    var rect = svg.selectAll("rect")
    rect = rect
            .data(partition(tree.root))
            .enter().append("rect")
            .attr("x", function (d) {
                return x(d.y);
            })
            .attr("y", function (d) {
                return y(d.x);
            })
            .attr("width", function (d) {
                return x(d.dy);
            })
            .attr("height", function (d) {
                return y(d.dx);
            })
            .attr("fill", function (d) {
                return color((d.children ? d : d.parent).key);
            })
            .attr("title", function (d) {
                return d.key;
            });
}

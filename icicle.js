function createIcicle(tree, containerSelector, comparisonTree) {
	var width = 300;
	var height = 500;

	var x = d3.scale.linear()
			.range([0, width]);

	var y = d3.scale.linear()
			.range([0, height]);

	var color = d3.scale.category20c();
    var color2 = d3.scale.linear().range(['#eee', '#000']);

	var partition = d3.layout.partition()
			.children(function (d) {
				return d.children;
			})
			.value(function (d) {
				return 1;
			});

    var colorFunc;
    if (comparisonTree) {
        colorFunc = function(node) {
            return color2(node.getMaxSimilarity(comparisonTree.root));
        }
    } else {
        colorFunc = function(node) { return color(node.qualifiedName); }
    }
	var container = d3.select(containerSelector).append('div').attr('class', 'icicle');

	container.append('h3').text(tree.couplingConcept);

	var svg = container
			.append('svg')
			.attr("width", width)
			.attr("height", height);

	var defs = svg.append('defs');
	var gradient = defs.append('linearGradient')
		.attr('id', 'shadow-gradient')
		.attr('x1', '0').attr('x2', '0').attr('y1', '0').attr('y2', '1');
	gradient.append('stop').attr('offset', '0%').attr('style', 'stop-color: rgba(0,0,0,0)');
	gradient.append('stop').attr('offset', '80%').attr('style', 'stop-color: rgba(0,0,0,0)');
	gradient.append('stop').attr('offset', '100%').attr('style', 'stop-color: rgba(0,0,0,0.1)');


    var rect = svg.selectAll("rect")
    rect = rect .data(partition(tree.root)).enter();

	rect.append("rect")
		    .attr("class", "node")
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
            .attr("fill", colorFunc)
            .attr("title", function (d) {
                return d.key;
            });
	rect.append("rect")
			.attr("class", "node")
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
			.attr("fill", 'url(#shadow-gradient)');
	rect.append("line")
		.attr("x1", function(d) { return x(d.y);})
		.attr("y1", function(d) { return y(d.x);})
		.attr("x2", function(d) { return x(d.y);})
		.attr("y2", function(d) { return y(d.x + d.dx);})
		.attr("stroke", "white")
		.attr("stroke-width", "1")
}

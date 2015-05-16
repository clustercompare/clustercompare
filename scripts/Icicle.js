define(function() {
	function createIcicle(tree, containerSelector, comparisonTree) {
		var width = 50 * tree.root.getDepth();
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
			colorFunc = function (node) {
				return color2(node.getMaxSimilarity(comparisonTree.root));
			}
		} else {
			colorFunc = function (node) {
				return color(node.qualifiedName);
			}
		}
		var realColorFunc = function (node) {
			if (node.isLeaf()) {
				return '#aaaaff';
			}
			return colorFunc(node)
		};
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
		rect = rect.data(partition(tree.root)).enter();

		function nodeX(d) {
			return x(d.y);
		} // x and y reversed for horizontal icicle plots
		function nodeY(d) {
			return y(d.x);
		}

		function nodeW(d) {
			return x(d.dy) * (d.isLeaf() ? 0.5 : 1);
		}

		function nodeH(d) {
			return y(d.dx);
		}

		function nodeY2(d) {
			return nodeY(d) + nodeH(d);
		}

		rect.append("rect")
				.attr("class", "node")
				.attr("x", nodeX)
				.attr("y", nodeY)
				.attr("width", nodeW)
				.attr("height", nodeH)
				.attr("fill", realColorFunc)
		rect.append("rect")
				.attr("class", "node")
				.attr("x", nodeX)
				.attr("y", nodeY)
				.attr("width", nodeW)
				.attr("height", nodeH)
				.attr("fill", 'url(#shadow-gradient)')
				.append('title').text(function (d) {
					return d.getLabel();
				})
		rect.append("line")
				.attr("x1", nodeX)
				.attr("y1", nodeY)
				.attr("x2", nodeX)
				.attr("y2", nodeY2)
				.attr("stroke", "white")
				.attr("stroke-width", "1")
	}

	return {
		create: createIcicle
	};
});

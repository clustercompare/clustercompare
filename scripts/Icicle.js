define(['EventEmitter'], function(EventEmitter) {
	function Icicle(tree, containerSelector, valueFunction) {
		EventEmitter.call(this);
		var self = this;
		this._valueCache = new Map();
		this.valueFunction = valueFunction;

		var width = 50 * tree.root.getDepth();
		var height = 500;

		var x = d3.scale.linear()
				.range([0, width]);

		var y = d3.scale.linear()
				.range([0, height]);


		var partition = d3.layout.partition()
				.children(function (d) {
					return d.children;
				})
				.value(function (d) {
					return 1;
				});

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


		var rect = svg.selectAll("rect");
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
				.attr("class", function(n) { return "node main-rect node--" + n.getID(); })
				.attr("x", nodeX)
				.attr("y", nodeY)
				.attr("width", nodeW)
				.attr("height", nodeH)
				.attr("fill", function(n) { return makeColor(self.getValue(n), n.isLeaf(), false)});
		rect.append("rect")
				.attr("class", "node shadow-rect")
				.attr("x", nodeX)
				.attr("y", nodeY)
				.attr("width", nodeW)
				.attr("height", nodeH)
				.attr("fill", 'url(#shadow-gradient)')
				.on("click", function(d) {
					console.log('test');
					self.emit('nodeclick', d);
				})
				.append('title').text(function (d) {
					return d.getLabel();
				});
		rect.append("line")
				.attr("x1", nodeX)
				.attr("y1", nodeY)
				.attr("x2", nodeX)
				.attr("y2", nodeY2)
				.attr("stroke", "white")
				.attr("stroke-width", "1");

		this.svg = svg;
	}

	Icicle.prototype = Object.create(EventEmitter.prototype);

	Icicle.prototype.updateSelection = function(selectionFunction) {
		var self = this;
		this.svg.selectAll("rect.main-rect").attr("fill", function(node) {
			return makeColor(self.getValue(node), node.isLeaf(), selectionFunction(node));
		});
	};

	Icicle.prototype.getValue = function(node) {
		if (this._valueCache.has(node)) {
			return this._valueCache.get(node);
		}
		var value = this.valueFunction(node);
		this._valueCache.set(node, value);
		return value;
	};

	function makeColor(value, isLeaf, selected) {
		var colorScale = d3.scale.linear().range([selected ? '#fdd' : '#eee', selected ? '#800' : '#000']);

		var color = isLeaf ? (selected ? '#800000' : '#aaaaff') : colorScale(value);
		return color;
	}

	return Icicle;
});

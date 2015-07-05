import EventEmitter from 'node-event-emitter';
import d3 from 'd3'
import * as TextUtils from './TextUtils';

export default class Icicle extends EventEmitter {
	constructor(tree, containerSelector, valueFunction) {
		super();

		this._valueCache = new Map();
		this.valueFunction = valueFunction;

		var INNER_NODE_WIDTH = 25;
		var ROOT_NODE_WIDTH = 5;
		var LEAF_WIDTH = 15;
		// the deepest level is guaranteed to only contain leaves
		var depth = tree.root.height;
		var width = INNER_NODE_WIDTH * (depth - 2) + LEAF_WIDTH + ROOT_NODE_WIDTH;
		var height = 500;
		var VERTICAL_LABEL_PADDING = 3;

		// these scales are only used for inner nodes, so map positions of first and last inner node
		var x = d3.scale.linear()
				.domain([1 / depth, 1 - 1 / depth])
				.range([ROOT_NODE_WIDTH, width - LEAF_WIDTH]);

		var y = d3.scale.linear()
				.range([0, height]);


		var partition = d3.layout.partition()
				.children(d => d._children)
				.value(d => 1);

		var svg = d3.select(containerSelector)
				.append('svg')
				.attr("width", width)
				.attr("height", '100%');

		var defs = svg.append('defs');
		var gradient = defs.append('linearGradient')
				.attr('id', 'shadow-gradient')
				.attr('x1', '0').attr('x2', '0').attr('y1', '0').attr('y2', '1');
		gradient.append('stop').attr('offset', '0%').attr('style', 'stop-color: rgba(0,0,0,0)');
		gradient.append('stop').attr('offset', '80%').attr('style', 'stop-color: rgba(0,0,0,0)');
		gradient.append('stop').attr('offset', '100%').attr('style', 'stop-color: rgba(0,0,0,0.1)');

		var filter = defs.append('filter')
				.attr('id', 'drop-shadow-filter')
				.attr('width', '200%')
				.attr('height', '200%');

		filter.append("feOffset")
				.attr("in", "SourceGraphic")
				.attr("dx", 1)
				.attr("dy", 1)
				.attr("result", "offset");
		filter.append("feGaussianBlur")
				.attr("in", "offset")
				.attr("stdDeviation", 2)
				.attr("result", "blur");
		filter.append("feComposite")
				.attr("in", "blur")
				.attr("in2", "SourceGraphic")
				.attr("operator", "out")
				.attr("result", "diff");

		var rect = svg.selectAll("rect");
		rect = rect.data(partition(tree.root)).enter();

		function nodeX(d) {
			if (d.isRoot) {
				return 0;
			}
			return x(d.y);
		} // x and y reversed for horizontal icicle plots
		function nodeY(d) {
			return y(d.x);
		}

		function nodeW(d) {
			if (d.isRoot) {
				return ROOT_NODE_WIDTH;
			}
			if (d.isLeaf) {
				return LEAF_WIDTH;
			}
			return INNER_NODE_WIDTH;
		}

		function nodeH(d) {
			return y(d.dx);
		}

		function nodeY2(d) {
			return nodeY(d) + nodeH(d);
		}

		function createRect() {
			return rect.append("rect")
					.attr("x", nodeX)
					.attr("y", nodeY)
					.attr("width", nodeW)
					.attr("height", nodeH)
					.attr('class', n => 'node--' + n.key)
					.classed("root", n => n.isRoot)
					.classed("leaf", n => n.isLeaf)
					.classed("node", true);
		}

		createRect()
				.classed('main-rect', true)
				// color is set by css for leaves and roots
				.attr("fill", n => n.isRoot || n.isLeaf ? null : makeColor(this.getValue(n)));
		createRect()
				.classed('shadow-rect', true)
				.attr("fill", 'url(#shadow-gradient)')
				.attr('filter', 'url(#drop-shadow-filter)');
		rect.append("line")
				.attr("x1", nodeX)
				.attr("y1", nodeY)
				.attr("x2", nodeX)
				.attr("y2", nodeY2)
				.attr("stroke", "white")
				.attr("stroke-width", "1");

		rect
				.append("text")
				.attr("transform", d => `translate(${nodeX(d) + 10}, ${nodeY(d) + VERTICAL_LABEL_PADDING}) rotate(90)`)
				.attr("text-anchor", "start")
				.filter(d => d.shortLabel)
				.classed("node-text", true)
				.text(d => TextUtils.truncate(d.shortLabel, nodeH(d) - VERTICAL_LABEL_PADDING, "node-text"));

		createRect()
				.classed('highlight-rect', true)
				.attr('filter', 'url(#drop-shadow-filter)')
				.on("mouseenter", d => this.emit('nodehover', d, d3.event))
				.on("click", d => {
					this.emit('nodeclick', d, d3.event);
					d3.event.stopPropagation();
				})
				.on("mousemove", d => d3.event.stopPropagation())
				.append('title').text(d => d.label);

		svg.on('mouseleave', () => this.emit('mouseleave', d3.event));
		svg.on('mousedown', () => d3.event.preventDefault());

		this.updateHeight = function() {
			height = parseInt(svg.style('height'));
			y.range([0, height]);
			svg.selectAll('.node').attr('y', nodeY).attr('height', nodeH);
			svg.selectAll('line').attr('y1', nodeY).attr('y2', nodeY2);
			svg.selectAll('.node-text').attr("transform", d => `translate(${nodeX(d) + 10}, ${nodeY(d) + VERTICAL_LABEL_PADDING}) rotate(90)`);
		};

		window.addEventListener('resize', this.updateHeight, true);

		this.svg = svg;
	}

	updateSelection(selectionName, selectedKeys) {
		var self = this;
		this.svg.selectAll("rect.main-rect.selected-" + selectionName)
				.classed('selected-' + selectionName, false);
		for (var key of selectedKeys) {
			var node = this.svg.select('rect.main-rect.node--' + key);
			node.classed('selected-' + selectionName, true);
		}
	}

	getValue(node) {
		if (this._valueCache.has(node)) {
			return this._valueCache.get(node);
		}
		var value = this.valueFunction(node);
		this._valueCache.set(node, value);
		return value;
	}
}

function makeColor(value) {
	var colorScale = d3.scale.linear().range(['#eee', '#000']);
	return colorScale(value);
}

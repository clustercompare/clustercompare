import EventEmitter from 'node-event-emitter';
import d3 from 'd3';
import $ from 'jquery';
import * as TextUtils from './TextUtils';

export default class CanvasIcicle extends EventEmitter {
    constructor(tree, containerSelector, valueFunction) {
        super();
        var self = this;

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
            .value(d => d.sortOrder)
            .sort((a,b) => a.sortOrder - b.sortOrder);
        var elements = partition(tree.root);
        for (let element of elements) {
            element.selections = {};
        }
        this.elements = elements;

        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        $(containerSelector).append(canvas);
        $(canvas).css({width: width + 'px', height: '100%'});
        context.imageSmoothingEnabled = false;

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

        function nodeColor(d) {
            if (d.isRoot) {
                return '#000080';
            }
            if (d.isLeaf) {
                let color = d3.rgb(d.selections.main ? 'rgb(64, 64, 192)' : '#FAEB9E');
                if (d.selections.hover) {
                    color = color.darker();
                }
                return color.toString();
            }
            return makeColor(self.getValue(d));
        }

        this.updateHeight = function() {
            height = canvas.clientHeight;
            y.range([0, height]);
            canvas.height = height;
            canvas.width = width;
            context.clearRect(0, 0, width, height);

            for (let d of elements) {
                let x = nodeX(d);
                let y = nodeY(d);
                let w = nodeW(d);
                let h = nodeH(d);

                // main color
                context.fillStyle = nodeColor(d);
                context.fillRect(x, y, w, h);
            }

            // separating vertical line
            context.strokeStyle = 'white';
            context.translate(0.5, 0.5);
            for (let i = 1; i <= depth; i++) {
                let xx = x(i / depth);
                console.log(xx);
                context.beginPath();
                context.moveTo(xx, 0);
                context.lineTo(xx, height);
                context.stroke();
            }
        };

        window.addEventListener('resize', () => this.updateHeight(), true);
        setTimeout(() => this.updateHeight(), 0); // height may only be available at next tick
    }

    updateSelection(selectionName, selectedKeys) {
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

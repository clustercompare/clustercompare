import EventEmitter from 'node-event-emitter';
import d3 from 'd3';
import $ from 'jquery';
import * as TextUtils from './TextUtils';
import * as Sets from './Sets';

// Set this to greater values to render icicles with higher resolutions so that zooming in
// will not pixelate the images as quick
const RESOLUTION = 2;

/**
 * An implementation of the icicle plot visualization with the Canvas API
 */
export default class CanvasIcicle extends EventEmitter {
    constructor(tree, containerSelector, valueFunction) {
        super();
        var self = this;

        this._valueCache = new Map();
        this.valueFunction = valueFunction;

        var INNER_NODE_WIDTH = 25;
        var ROOT_NODE_WIDTH = 5;
        var LEAF_WIDTH = 15;

        var VERTICAL_LABEL_PADDING = 3;
        var TOOLTIP_HEIGHT = 20;

        const SIDE_LINE_WIDTH = 4;
        const LABEL_LEFT_OFFSET = 7;

        var depth = tree.root.height;
        // the deepest level is guaranteed to only contain leaves, so we can use LEAF_WIDTH instead
        // of INNER_NODE_WIDTH for the last column
        var width = INNER_NODE_WIDTH * (depth - 2) + LEAF_WIDTH + ROOT_NODE_WIDTH;

        // initial height, will be replaced by actual canvas height on resize event
        var height = 500;

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
        this.leafElementByKey = {};
        this.previousSelections = {};
        for (let element of elements) {
            element.selections = {};
            if (element.isLeaf) {
                this.leafElementByKey[element.key] = element;
            }
        }
        this.elements = elements;

        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        $(containerSelector).append(canvas);
        $(canvas).css({width: width + 'px', height: '100%'});
        context.imageSmoothingEnabled = false;
        this.canvas = canvas;
        this.context = context;

        var gradient = context.createLinearGradient(0, 0, 0, 5);
        gradient.addColorStop(0, 'rgba(0,0,0,0.0)');
        gradient.addColorStop(1, 'rgba(0,0,0,0.1)');

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
                return 'black';
            }
            if (d.isLeaf) {
                let colors = [['#FAEB9E', '#f3cd0d'], ['#4040c0', '#1a1a4d']];
                return colors[d.selections.main ? 1 : 0][d.selections.hover ? 1 : 0];
            }
            return makeColor(self.getValue(d).intensity);
        }

        this._drawNode = function(d, options) {
            let x = nodeX(d);
            let y = nodeY(d);
            let w = nodeW(d) - 1 /* vertical spacing */;
            let h = nodeH(d);
            let y2 = y + h;
            let x2 = x + w;
            let xAligned = Math.round(x * RESOLUTION);
            let yAligned = Math.round(y * RESOLUTION);
            let y2Aligned = Math.round(y2 * RESOLUTION);
            let x2Aligned = Math.round(x2 * RESOLUTION);

            let sideColor = self.getValue(d).sideColor;
            let hasSideBar = sideColor && !d.isLeaf && !d.isRoot;
            if (hasSideBar) {
                x2Aligned -= (SIDE_LINE_WIDTH + 1) * RESOLUTION;
            }

            let hAligned = y2Aligned - yAligned;
            let wAligned = x2Aligned - xAligned;

            // main color
            context.fillStyle = nodeColor(d);
            context.fillRect(xAligned, yAligned, wAligned, hAligned);

            // labels
            if (!d.isLeaf) {
                context.save();
                context.translate(xAligned + LABEL_LEFT_OFFSET * RESOLUTION, yAligned + VERTICAL_LABEL_PADDING * RESOLUTION);
                context.rotate(Math.PI / 2);
                context.font = (12 * RESOLUTION) + 'px "Open Sans"';
                context.fillStyle = 'white';
                // TextUtils.truncate uses constant 12px, so do not multiply with RESOLUTION here
                context.fillText(TextUtils.truncate(d.shortLabel, h - VERTICAL_LABEL_PADDING * 2), 0, 0);
                context.restore();
            }

            // inset shadow at bottom
            if (!d.isLeaf && hAligned > 2) {
                context.fillStyle = gradient;
                let gradientHeight = Math.min(5 * RESOLUTION, hAligned);
                context.save();
                context.translate(xAligned, (y2Aligned - gradientHeight));
                context.fillRect(0, 0, wAligned, gradientHeight);
                context.restore();
            }

            if (hasSideBar) {
                // colored side bar
                context.fillStyle = sideColor;
                context.fillRect(x2Aligned + 1 * RESOLUTION, yAligned, SIDE_LINE_WIDTH * RESOLUTION, hAligned);
            }
        };

        /**
         * Should be called when the canvas is resized
         */
        this.updateHeight = function() {
            height = canvas.clientHeight;
            y.range([0, height]);
            canvas.height = RESOLUTION * height;
            canvas.width = RESOLUTION * width;
            context.clearRect(0, 0, width * RESOLUTION, height * RESOLUTION);

            for (let d of elements) {
                this._drawNode(d);
            }
        };

        canvas.addEventListener('mousemove', e => {
            let node = findNodeAtPosition(e.offsetX, e.offsetY);
            if (node) {
                this.emit('nodehover', node, e);
                e.stopPropagation();
            } else {
                this.emit('mouseleave', e);
            }
        });

        canvas.addEventListener('click', e => {
            let node = findNodeAtPosition(e.offsetX, e.offsetY);
            if (node) {
                this.emit('nodeclick', node, e);
                e.stopPropagation();
            }
        });
        canvas.addEventListener('mousedown', e => e.stopPropagation());
        canvas.addEventListener('mouseleave', e => this.emit('mouseleave', e));

        function findNodeAtPosition(posX, posY) {
            let xx = Math.floor(x.invert(posX) * depth);
            let yy = y.invert(posY);
            let node = tree.root;
            for (let i = 0; i < xx; i++) {
                // find the child at the correct vertical position (icicles are rotated, thus x)
                let child = null;
                for (let j = 0; j < node.children.length; j++) {
                    if (node.children[j].x + node.children[j].dx >= yy) {
                        child = node.children[j];
                        break;
                    }
                }
                if (child) {
                    node = child;
                } else {
                    return null;
                }
            }
            return node;
        }

        this._showLabelTooltip = (node) => {
            if (!this._labelTooltip) {
                this._labelTooltip = document.createElement('span');
                this._labelTooltip.setAttribute('class', 'label-tooltip');
                $(this._labelTooltip).insertAfter(this.canvas);
            }
            let tooltipHTML = this.getValue(node).tooltipHTML;
            if (tooltipHTML) {
                this._labelTooltip.innerHTML = tooltipHTML;
            } else {
                this._labelTooltip.textContent = node.label;
            }

            var canvasOffset = $(canvas).offset();
            this._labelTooltip.style.left = canvasOffset.left + nodeX(node) + nodeW(node) + 'px';
            this._labelTooltip.style.top = canvasOffset.top + nodeY(node) - TOOLTIP_HEIGHT / 2 + 'px';
            $(this._labelTooltip).show();
            $(this._labelTooltip).click(() => this._hideLabelTooltip());
        };

        this._hideLabelTooltip = () => {
            if (this._labelTooltip) {
                $(this._labelTooltip).hide();
            }
        };

        window.addEventListener('resize', () => this.updateHeight(), true);
        setTimeout(() => this.updateHeight(), 0); // height may only be available at next tick

        this.on('nodehover', node => {
            if (true || node.isLeaf) {
                this._showLabelTooltip(node);
            } else {
                this._hideLabelTooltip();
            }
        });

        this.on('mouseleave', () => this._hideLabelTooltip());
    }

    /**
     * Overrides the leaf node list of a given selection (e.g. hover or main)
     * @param selectionName
     * @param selectedKeys
     */
    updateSelection(selectionName, selectedKeys) {
        let previousSelection = this.previousSelections[selectionName];
        if (!previousSelection) {
            previousSelection = new Set();
        }
        this.previousSelections[selectionName] = selectedKeys;

        let additions = Sets.subtract(selectedKeys, previousSelection);
        let removals = Sets.subtract(previousSelection, selectedKeys);

        for (let key of additions) {
            let element = this.leafElementByKey[key];
            element.selections[selectionName] = true;
            this._drawNode(element);
        }

        for (let key of removals) {
            let element = this.leafElementByKey[key];
            element.selections[selectionName] = false;
            this._drawNode(element);
        }
    }

    getValue(node) {
        if (this._valueCache.has(node)) {
            return this._valueCache.get(node);
        }
        var value = this.valueFunction(node);
        if (typeof value !== 'object') {
            value = {
                intensity: value
            }
        }
        this._valueCache.set(node, value);
        return value;
    }
}

function makeColor(value) {
    var colorScale = d3.scale.linear().range(['#eee', '#000']);
    return colorScale(value);
}

// note: use the new CanvasIcicle implementation which provides better performance
import Icicle from './CanvasIcicle';
import * as ColorGenerator from './ColorGenerator';
import $ from 'jquery';
import renderPieChart from './PieChartRenderer.js';
import { RESOLUTION } from './config';

/**
 * An icicle plot visualization that is bound bidirectionally to the model
 */
export default class BoundIcicle extends Icicle {
	constructor(tree, containerSelector, viewModel) {
		super(tree, containerSelector, BoundIcicle._getValueFunction(tree, viewModel));
		this._viewModel = viewModel;
		this._model = viewModel.model;
		this._initEvents();
	}

	_initEvents() {
		this.on('nodehover', node => this._viewModel.hoverSelection.select(node.isRoot ? null : node));
		this.on('mouseleave', () => this._viewModel.hoverSelection.select(null));
		this.on('nodeclick', (node, e) => {
			if (e.ctrlKey) {
				if (node.isRoot) {
					return;
				}
				if (this._viewModel.mainSelection.isSelected(node)) {
					this._viewModel.mainSelection.removeFromSelection(node);
				} else {
					this._viewModel.mainSelection.addToSelection(node);
				}
			} else {
				this._viewModel.mainSelection.select(node.isRoot ? null : node);
			}
		});

		this._viewModel.mainSelection.on('change', () =>
			this.updateSelection('main', this._viewModel.mainSelection.selectedKeys));
		this._viewModel.hoverSelection.on('change', () =>
			this.updateSelection('hover', this._viewModel.hoverSelection.selectedKeys));
	}

	static _getValueFunction(tree, viewModel) {
		return node => {
			let info = viewModel.similarityProvider.getSimilarityInfo(node);
			if (!info) {
				return { intensity: 0 };
			}
			let result = {
				intensity: info.similarity
			};
			if (node.root.isPrimaryHierarchy && info.node) {
				result.sideColor = ColorGenerator.colorForClustering(info.node.root.clustering);
				result.tooltipFn = () => { return $('<span>').addClass('extended-tooltip').append(
					$('<span>').addClass('node-name').text(node.label),
					$('<br>'),
					$('<span>').text('Most similar to '),
					$('<span>').css({color: result.sideColor, 'font-weight': 'bold'}).text(info.node.root.clustering),
					$('<span>').text(' » ' + info.node.label),
					$('<span>').css('opacity', '50%').text(', ' + Math.round(info.similarity * 100) + '%')
				)};
			} else if (!node.root.isPrimaryHierarchy && info.node) {
				if (info.isWinner) {
					result.sideColor = ColorGenerator.colorForClustering(node.root.clustering);
				}
				let additions = info.totalCount - info.node.leaves.size;
				let removals = info.node.leaves.size - info.intersection;
				result.pieChartValuePositive = additions / info.totalCount;
				result.pieChartValueNegative = removals / info.totalCount;

				result.tooltipFn = () => {
					let pieRadius = 12;
					let canvas = $('<canvas>').attr('width', pieRadius * 2 * RESOLUTION).attr('height', pieRadius * 2 * RESOLUTION)
						.css({width: pieRadius * 2 + 'px', height: pieRadius * 2 + 'px'});
					renderPieChart(canvas[0].getContext('2d'), pieRadius * RESOLUTION, pieRadius * RESOLUTION, pieRadius * RESOLUTION, result);
					return $('<span>').addClass('extended-tooltip').append(
						$('<span>').addClass('node-name').text(node.label),
						$('<br>'),
						$('<span>').text('Most similar to ' + info.node.label),
						$('<span>').css('opacity', '50%').text(', ' + Math.round(info.similarity * 100) + '%'),
						$('<span>').text(' (is winner cluster)').toggle(info.isWinner),
						$('<br>'),
						canvas,
						$('<span>').text(additions + ' additions, ' + removals + ' removals')
				)};
			}
			return result;
		};
	}
}

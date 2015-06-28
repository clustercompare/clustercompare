import Icicle from './Icicle';

export default class BoundIcicle extends Icicle {
	constructor(tree, containerSelector, viewModel) {
		super(tree, containerSelector, BoundIcicle._getValueFunction(tree, viewModel.model));
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

	static _getValueFunction(tree, model) {
		if (tree.couplingConcept == 'packages') {
			return node => Math.max.apply(null,
					model.couplingTrees.map(tree => node.getMaxSimilarity(tree.root)));
		}

		var packagesTree = model.packagesTree;
		return node => node.getMaxSimilarity(packagesTree.root);
	}
}

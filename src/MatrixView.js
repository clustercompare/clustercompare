import $ from 'jquery';

export default class MatrixView {
	// Maps an index in icicle order to the index in the values array
	_mapping = [];

	constructor(matrix, tree, containerSelector) {
		this.matrix = matrix;
		this.tree = tree;
		this.size = this.matrix.classNames.length;

		this.canvas = document.createElement('canvas');
		$(this.canvas).css('height', '100%');
		this.canvas.width = this.size;
		this.canvas.height = this.size;
		this.context = this.canvas.getContext('2d');
		$(containerSelector).append(this.canvas);
		window.addEventListener('resize', () => this.updateHeight(), true);
		this.updateHeight();

		this.generateIndexMap();
		this.draw();
	}

	/**
	 * Should be called when the canvas is resized
	 */
	updateHeight() {
		$(this.canvas).css('width', this.canvas.clientHeight + 'px');
	};

	generateIndexMap() {
		let mapping = [];
		for (let node of this.tree.root.leavesInOrder) {
			console.log(node.sortOrder + ' ' + node.data.qualifiedName);
			mapping.push(this.matrix.classNames.indexOf(node.data.qualifiedName));
		}
		this._mapping = mapping;
	}

	draw() {
		// TODO sorting
		let imageData = this.context.createImageData(this.size, this.size);
		for (let y = 0; y < this.size; y++) {
			for (let x = 0; x < this.size; x++) {
				let offset = y * this.size * 4 + x * 4;
				for (let i = 0; i < 3; i++) {
					let value = this.matrix.values[this._mapping[y]][this._mapping[x]];
					imageData.data[offset + i] = value * 255;
				}
				imageData.data[offset + 3] = 255;
			}
		}
		this.context.putImageData(imageData, 0, 0);
	}
}

import EventEmitter from 'node-event-emitter';
import * as Sets from './Sets';

const DEBOUNCE_DELAY = 100;

export default class Selection extends EventEmitter {
	_changeTimeout = null;

	constructor() {
		super();
		this._selectedKeys = new Set();
		this._selectedClustering = null;
	}

	selectKeys(keys) {
		if (Sets.equal(this._selectedKeys, keys)) {
			return;
		}
		this._selectedKeys = keys;
		this._onChange();
	}

	_onChange() {
		if (this._changeTimeout) {
			clearTimeout(this._changeTimeout);
		}
		this._changeTimeout = setTimeout(() => {
			this.emit('change');
			this._changeTimeout = null;
		}, DEBOUNCE_DELAY);
	}

	_selectClustering(node) {
		if (node == this._selectedClustering) {
			return;
		}
		this._selectedClustering = node;
		this.emit('changeclustering');
	}

	select(object, options = {}) {
		if (object == null) {
			this._selectClustering(null);
			this.selectKeys(new Set());
		} else {
			this._selectClustering(options.selectClustering ? object.root : null);
			this.selectKeys(object.leaveKeys);
		}
	}

	addToSelection(node) {
		if (node == null) {
			return;
		}

		this.selectKeys(Sets.merge(this.selectedKeys, node.leaveKeys));
	}

	removeFromSelection(node) {
		if (node == null) {
			return;
		}

		this.selectKeys(Sets.subtract(this.selectedKeys, node.leaveKeys));
	}

	get selectedKeys() {
		return this._selectedKeys;
	}

	get selectedClustering() {
		return this._selectedClustering;
	}

	isSelected(node) {
		return Sets.containsAll(this.selectedKeys, node.leaveKeys);
	}
}

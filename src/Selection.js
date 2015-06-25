import EventEmitter from 'node-event-emitter';
import * as Sets from './Sets';

export default class Selection extends EventEmitter {
	constructor() {
		super();
		this._selectedKeys = new Set();
	}

	selectKeys(keys) {
		this._selectedKeys = keys;
		this.emit('change');
	}

	select(object) {
		if (object == null) {
			this.selectKeys(new Set());
		} else {
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

	isSelected(node) {
		return Sets.containsAll(this.selectedKeys, node.leaveKeys);
	}
}

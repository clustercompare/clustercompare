import EventEmitter from 'node-event-emitter';
import * as Sets from './Sets';

export default class Selection extends EventEmitter {
	constructor() {
		super();
		this.selectedKeys = new Set();
	}

	selectKeys(keys) {
		this.selectedKeys = keys;
		this.emit('change');
	}

	select(object) {
		if (object == null) {
			this.selectKeys(new Set());
		} else {
			this.selectKeys(object.getLeaveKeys());
		}
	}

	addToSelection(node) {
		if (node == null) {
			return;
		}

		this.selectKeys(Sets.merge(this.selectedKeys, node.getLeaveKeys()));
	}

	removeFromSelection(node) {
		if (node == null) {
			return;
		}

		this.selectKeys(Sets.subtract(this.selectedKeys, node.getLeaveKeys()));
	}

	getSelectedKeys() {
		return this.selectedKeys;
	}

	isSelected(node) {
		return Sets.containsAll(this.getSelectedKeys(), node.getLeaveKeys());
	}
}

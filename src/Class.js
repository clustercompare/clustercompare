import Node from './Node';

/**
 * A leaf node
 */
export default class Class extends Node {
	get key() {
		return this.data.qualifiedName.replace(/\./g, '_');
	}

	get label() {
		return this.data.qualifiedName;
	}

	get shortLabel() {
		// There is never enough space to display class labels
		return '';
	}

	_generateLeaveKeySet() {
		return new Set([this.key]);
	}
}

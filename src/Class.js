import Node from './Node';

export default class Class extends Node {
	get key() {
		return this.data.qualifiedName.replace(/\./g, '_');
	}

	get label() {
		return this.data.qualifiedName;
	}

	get shortLabel() {
		return '';//this.getLabel().substr(this.getLabel().lastIndexOf('.') + 1);
	}

	_generateLeaveKeySet() {
		return new Set([this.key]);
	}
}

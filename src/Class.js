import Node from './Node';

export default class Class extends Node {
	constructor(data) {
		super(data);
	}

	getKey() {
		return this.data.qualifiedName.replace(/\./g, '_');
	}

	getLabel() {
		return this.data.qualifiedName;
	}

	getShortLabel() {
		return '';//this.getLabel().substr(this.getLabel().lastIndexOf('.') + 1);
	}

	_generateLeaveKeySet() {
		return new Set([this.getKey()]);
	}
}

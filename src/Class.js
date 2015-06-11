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

	_generateLeaveKeySet() {
		return new Set([this.getKey()]);
	}
}

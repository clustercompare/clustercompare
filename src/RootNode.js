import Node from './Node';

export default class RootNode extends Node {
	get label() {
		return 'root';
	}

	get shortLabel() {
		return '';
	}
}

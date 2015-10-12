import Node from './Node';

/**
 * A root node of any hierarchy
 */
export default class RootNode extends Node {
	get label() {
		return 'root';
	}

	get shortLabel() {
		return '';
	}
}

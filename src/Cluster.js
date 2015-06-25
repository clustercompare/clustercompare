import InnerNode from './InnerNode';

export default class Cluster extends InnerNode {
	get label() {
		return "Cluster " + this.completeKey;
	}
	
	get shortLabel() {
		return this.data.key;
	}

	get completeKey() {
		if (this.parent instanceof Cluster) {
			return this.parent.data.key + '.' + this.data.key;
		}
		return this.data.key;
	}
}

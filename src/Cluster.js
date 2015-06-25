import InnerNode from './InnerNode';

export default class Cluster extends InnerNode {
	getLabel() {
		return "Cluster " + this.getCompleteKey();
	}

	getCompleteKey() {
		if (this.getParent() instanceof Cluster) {
			return this.getParent().data.key + '.' + this.data.key;
		}
		return this.data.key;
	}
}

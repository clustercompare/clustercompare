import InnerNode from './InnerNode';
import * as StringUtils from './StringUtils';

export default class Cluster extends InnerNode {
	get label() {
		return "Cluster " + this.completeKeyBase26;
	}
	
	get shortLabel() {
		return this.keyBase26;
	}

	get completeKeyBase26() {
		if (this.parent instanceof Cluster) {
			return this.parent.completeKeyBase26 + '.' + this.keyBase26;
		}
		return this.keyBase26;
	}

	get keyBase26() {
		let number = parseInt(this.data.key);
		return StringUtils.numberToBase26(number - 1 /* zero-based */);
	}
}

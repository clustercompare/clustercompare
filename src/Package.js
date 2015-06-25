import InnerNode from './InnerNode';
import * as StringUtils from './StringUtils';

export default class Package extends InnerNode {
	getLabel() {
		return this.data.qualifiedName;
	}

	getShortLabel() {
		if (this.getParent().isRoot()) {
			return StringUtils.getSubstringAfterLastOccurrence(this.getLabel(), '.');
		}
		return this.getLabel().substr(this.getParent().getLabel().length + 1);
	}
}

import InnerNode from './InnerNode';
import * as StringUtils from './StringUtils';

/**
 * An inner node of the primary hierarchy
 */
export default class Package extends InnerNode {
	get label() {
		return this.data.qualifiedName;
	}

	get shortLabel() {
		if (this.parent.isRoot) {
			return StringUtils.getSubstringAfterLastOccurrence(this.label, '.');
		}
		return this.label.substr(this.parent.label.length + 1);
	}
}

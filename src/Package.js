import InnerNode from './InnerNode';

export default class Package extends InnerNode {
	getLabel() {
		return this.data.key;
	}
}

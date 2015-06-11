import InnerNode from './InnerNode';
	function Package(data) {
		InnerNode.call(this, data);
	}

	Package.prototype = Object.create(InnerNode.prototype);

	export default Package;


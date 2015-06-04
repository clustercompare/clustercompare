define(['InnerNode'], function(InnerNode) {
	function Package(data) {
		InnerNode.call(this, data);
	}

	Package.prototype = Object.create(InnerNode.prototype);

	return Package;
});

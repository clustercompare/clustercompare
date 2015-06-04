define(function() {
	function update(selectedLeaves) {
		$('#selection-heading').text(makeSelectionHeading(selectedLeaves));
	}

	function makeSelectionHeading(leaves) {
		if (!leaves.length) {
			return "Nothing selected";
		}
		if (leaves.length == 1) {
			leaves[0].getLabel();
		}
		return leaves.length + " classes selected";
	}

	return {
		update: update
	}
});

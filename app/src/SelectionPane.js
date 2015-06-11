import $ from 'jquery';

	function update(selectedLeaves) {
		$('#selection-heading').text(makeSelectionHeading(selectedLeaves));

		$('#selection-class-list').empty();
		selectedLeaves.forEach(function(clazz) {
			$('#selection-class-list').append(
					$('<li>').text(clazz.getLabel())
			);
		});
	}

	function makeSelectionHeading(leaves) {
		if (!leaves.length) {
			return "Nothing selected";
		}
		if (leaves.length == 1) {
			return leaves[0].getLabel();
		}
		return leaves.length + " classes selected";
	}

	export default {
		update: update
	}


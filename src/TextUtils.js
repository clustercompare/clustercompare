// thanks to linkvt @ https://github.com/VisualDataWeb/WebVOWL/blob/master/src/js/graph/util/general.js

import d3 from 'd3';

var ELLIPSIS = '';//"...";

/**
 * Add String function to calculate the text field length.
 * @param textStyle The optional special style.
 * @returns {number} The width of the text.
 */
export function measureWidth(string, textStyle) {
	// Set a default value
	if (!textStyle) {
		textStyle = "text";
	}
	var d = d3.select("body")
					.append("span")
					.attr("class", textStyle)
					.attr("id", "width-test") // tag this element to identify it
					.text(string),
			w = document.getElementById("width-test").offsetWidth;
	d.remove();
	return w;
}

/**
 * Function to truncate a string.
 * @param string the string to truncate
 * @param maxLength The maximum length of the text block.
 * @param textStyle The optional special style.
 * @returns {String} The truncated String.
 */
export function truncate(string, maxLength, textStyle) {
	if (isNaN(maxLength) || maxLength <= 0) {
		return '';
	}

	if (!string) {
		return '';
	}

	if (measureWidth(string, textStyle) <= maxLength) {
		return string;
	}

	do {
		string = string.substring(0, string.length - 1);
		if (!string.length) {
			return '';
		}
	} while (measureWidth(string + ELLIPSIS, textStyle) > maxLength);

	return string + ELLIPSIS;
}

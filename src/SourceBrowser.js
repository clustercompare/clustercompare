import $ from 'jquery';
import hljs from 'highlight.js'

export function showForClass(clazz) {
	var url = 'data/' + clazz.root.project + '/src/' + clazz.data.qualifiedName.replace(/\./g, '/') + '.java';
	$.get(url, function(contents) {
		$('#source-browser .source').text(contents).addClass('java');
		hljs.highlightBlock($('#source-browser .source')[0]);
		$('#icicles').hide();
		$('#source-browser').show();
	});
}

$('#close-source-button').click(function() {
	$('#icicles').show();
	$('#source-browser').hide();
});

import $ from 'jquery';

export function init(viewModel) {
	let indicator = $('<div>').addClass('progress-indicator').insertAfter('#icicles');
	indicator.append('<div class="spinner"><div></div><div></div><div></div><div></div><div></div></div>');
	indicator.hide();

	viewModel.similarityProvider.on('analyzing', () =>
		indicator.show());
	viewModel.similarityProvider.on('analyzed', () =>
		indicator.hide());
}

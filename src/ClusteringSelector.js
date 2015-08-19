import $ from 'jquery';
import template from './templates/clustering-selection.hbs';

var visible = false;
var viewModel;
var pane;

export function init(viewModel_) {
    viewModel = viewModel_;
    pane = $('#clustering-selection-pane');
    pane.html(template(viewModel.model.clusterings)).addClass('with-footer');
    pane.find('.apply-button').click(apply);
    pane.find('.reset-button').click(reset);
    hide();
    reset();
}

export function show() {
    $('#selection-pane').hide();
    $('#clustering-selection-pane').show();
}

export function hide() {
    $('#selection-pane').show();
    $('#clustering-selection-pane').hide();
}

export function toggle() {
    visible = !visible;
    if (visible) {
        show();
    } else {
        hide();
    }
}

function apply() {
    let checkboxes = Array.from(pane.find('.clustering-checkbox:checked'));
    let keys = checkboxes.map(b => $(b).data('clustering'));
    viewModel.selectedClusterings.selectItemsPreserveOrder(keys);
}

function reset() {
    pane.find('.clustering-checkbox').each(function() {
        $(this).prop('checked', viewModel.selectedClusterings.items.indexOf($(this).data('clustering')) >= 0);
    });
}

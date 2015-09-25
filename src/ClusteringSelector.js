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
    pane.find('.select-all-button').click(selectAll);
    pane.find('.select-none-button').click(selectNone);
    pane.find('.invert-selection-button').click(invertSelection);
    pane.find('.clustering-checkbox').click(enableApplyAndResetButtons);
    hide();
    reset();
    disableApplyAndResetButtons();
}

export function show() {
    $('#selection-pane').hide();
    $('#clustering-selection-pane').show();
    $('#clusterings-button').toggleClass('active', true);
}

export function hide() {
    $('#selection-pane').show();
    $('#clustering-selection-pane').hide();
    $('#clusterings-button').toggleClass('active', false);
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
    disableApplyAndResetButtons();
}

function reset() {
    pane.find('.clustering-checkbox').each(function() {
        $(this).prop('checked', viewModel.selectedClusterings.items.indexOf($(this).data('clustering')) >= 0);
    });
    disableApplyAndResetButtons();
}

function selectAll() {
    pane.find('.clustering-checkbox').prop('checked', true);
    enableApplyAndResetButtons();
}

function selectNone() {
    pane.find('.clustering-checkbox').prop('checked', false);
    enableApplyAndResetButtons();
}

function invertSelection() {
    pane.find('.clustering-checkbox').prop('checked', function() { return !$(this).prop('checked'); });
    enableApplyAndResetButtons();
}

function disableApplyAndResetButtons() {
    pane.find('.apply-button, .reset-button').prop('disabled', true);
}

function enableApplyAndResetButtons() {
    pane.find('.apply-button, .reset-button').prop('disabled', false);
}

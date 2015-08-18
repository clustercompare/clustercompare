import $ from 'jquery';
import template from './templates/clustering-selection.hbs';

var visible = false;

export function init(model) {
    $('#clustering-selection-pane')
        .html(template(model.clusterings))
        .addClass('with-footer');
    hide();
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

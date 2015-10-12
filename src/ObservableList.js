import EventEmitter from 'node-event-emitter';
import { moveInArray } from './ArrayUtils';

/**
 * A list that fires events when it changes
 */
export default class ObservableList extends EventEmitter {
    _items = [];
    _eventsDeferred = false;
    _deferredChange = false;

    get items() {
        return this._items;
    }

    set items(value) {
        this._items = value;
        this._onChange();
    }

    contains(value) {
        return this._items.indexOf(value) >= 0;
    }
    
    selectItemsPreserveOrder(items) {
        let newItems = [];
        for (let item of this._items) {
            if (items.indexOf(item) >= 0) {
                newItems.push(item);
            }
        }
        for (let item of items) {
            if (this._items.indexOf(item) < 0) {
                newItems.push(item);
            }
        }
        this.items = newItems;
    }

    beginUpdate() {
        this._eventsDeferred = true;
    }

    endUpdate() {
        if (this._deferredChange) {
            this.emit('change');
        }
        this._deferredChange = false;
        this._eventsDeferred = false;
    }

    _onChange() {
        if (this._eventsDeferred) {
            this._deferredChange = true;
        } else {
            this.emit('change');
        }
    }

    moveBefore(key, otherKey) {
        let newPos = this._items.indexOf(otherKey);
        let oldPos = this._items.indexOf(key);
        if (newPos < 0 || oldPos < 0) {
            throw new Error('either new or old pos not found');
        }
        // moving forwards means inserting at the index *before* the other item
        // moving backwards means inserting *at* the index of the other item
        if (newPos > oldPos) {
            newPos--;
        }
        moveInArray(this._items, oldPos, newPos);
        this._onChange();
    }

    moveToEnd(key) {
        moveInArray(this._items, this._items.indexOf(key), this._items.length - 1);
    }
}

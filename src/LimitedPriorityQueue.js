export default class LimitedPriorityQueue {
	_valueFn = null;
	_items = [];
	_limit = 0;
	_min = null;
	_max = null;

	constructor(valueFn, limit) {
		this._valueFn = valueFn;
		this._limit = limit;
	}

	enqueue(item) {
		let value = this._valueFn(item);

		// special case: first entry
		if (this.isEmpty) {
			this._items.push(item);
			this._min = value;
			this._max = value;
			return;
		}

		if (!this._accepts(value)) {
			return;
		}

		// insert at correct posotion and adjust min/max
		this._items.push(item);
		this._items.sort((a, b) => this._valueFn(b) - this._valueFn(a)); // reverse
		this._items = this._items.slice(0, this._limit);
	}

	get items() {
		return this._items;
	}

	_accepts(value) {
		// special case: enough room for everything
		if (this._items.length < this._limit) {
			return true;
		}

		return value > this._min;
	}

	get isEmpty() {
		return this._items.length == 0;
	}
}

import Sets from './Sets';
import pako from 'pako';
import EventEmitter from 'node-event-emitter';
	function SelectionHistory(leaveKeys) {
		EventEmitter.call(this);
		this.leaveKeys = Sets.sorted(leaveKeys);
		window.addEventListener('hashchange', this._onHashChange.bind(this));
	}

	SelectionHistory.prototype = Object.create(EventEmitter.prototype);

	SelectionHistory.prototype.init = function() {
		if (location.hash.length > 1) {
			this._onHashChange();
		}
	};

	SelectionHistory.prototype.push = function(keys) {
		location.hash = this.encode(keys);
	};

	SelectionHistory.prototype._onHashChange = function() {
		var code = location.hash.substring(1);
		var keys = this.decode(code);
		this.emit('change', keys);
	};

	SelectionHistory.prototype.encode = function(keys) {
		if (!keys.size) {
			return '';
		}
		var bytes = new Uint8Array(this.leaveKeys.size);
		var index = 0;
		for (var key of this.leaveKeys) {
			bytes[index] = keys.has(key) ? 1 : 0;
			index++;
		}
		var compressed = pako.deflate(bytes);
		var base64encoded = btoa(String.fromCharCode.apply(null, compressed));
		return base64encoded;
	};

	SelectionHistory.prototype.decode = function(code) {
		if (!code) {
			return new Set();
		}
		var compressed = new Uint8Array(atob(code).split("").map(function(c) { return c.charCodeAt(0); }));
		var bytes = pako.inflate(compressed);
		if (bytes.length < this.leaveKeys.size) {
			console.log('code too short (is ' + bytes.length + ', but expected ' + this.leaveKeys.size);
			return new Set();
		}
		var keys = new Set();
		var index = 0;
		for (var key of this.leaveKeys) {
			if (bytes[index]) {
				keys.add(key);
			}
			index++;
		}
		return keys;
	};

	export default SelectionHistory;


import ObservableList from '../../src/ObservableList';

describe('ObservableList', () => {
	it('is initially empty', () => {
		expect(new ObservableList().items).toEqual([]);
	});

	it('gets set items', () => {
		let list = new ObservableList();
		list.items = [1,2,3];
		expect(list.items).toEqual([1,2,3]);
	});

	it('emits event when set', () => {
		let list = new ObservableList();
		let spy = {observer: () => false};
		spyOn(spy, 'observer');
		list.on('change', spy.observer);
		list.items = [1,2,3];
		expect(spy.observer).toHaveBeenCalled();
	});

	it('supports moving items before other items', () => {
		let list = new ObservableList();
		list.items = [0, 1, 2, 3, 4, 5];
		list.moveBefore(4, 2);
		expect(list.items).toEqual([0, 1, 4, 2, 3, 5]);
	});

	it('supports moving items forwards', () => {
		let list = new ObservableList();
		list.items = [0, 1, 2, 3, 4, 5];
		list.moveBefore(1, 4);
		expect(list.items).toEqual([0, 2, 3, 1, 4, 5]);
	});

	it('does nothing when moveBefore gets two neighbors as parameters', () => {
		let list = new ObservableList();
		list.items = [0, 1, 2, 3, 4, 5];
		list.moveBefore(2, 3);
		expect(list.items).toEqual([0, 1, 2, 3, 4, 5]);
	});

	it('supports moving items to the end', () => {
		let list = new ObservableList();
		list.items = [0, 1, 2, 3, 4, 5];
		list.moveToEnd(2);
		expect(list.items).toEqual([0, 1, 3, 4, 5, 2]);
	});

	it('supports adding and removing items preserving their original order', () => {
		let list = new ObservableList();
		list.items = [ 'first', 'second', 'third', 'fourth' ];
		list.selectItemsPreserveOrder( [ 'fourth', 'second', 'fifth' ]);
		expect(list.items).toEqual([ 'second', 'fourth', 'fifth' ]);
	});
});

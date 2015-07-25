import * as TreeUtils from '../../src/TreeUtils';

describe('TreeUtils', () => {
    describe('upackOnlyChild', () => {
       it('works for simple tree', () => {
           let result = TreeUtils.unpackOnlyChild({
               key: 'root',
               children: [{
                   key: 'child',
                   children: []
               }]
           });

           expect(result).toDeepEqual({
               key: 'root.child',
               children: []
           });
       });
       it('does not unpack twins', () => {
            let result = TreeUtils.unpackOnlyChild({
                key: 'root',
                children: [{
                    key: 'child1',
                    children: []
                }, {
                    key: 'child2',
                    children: []
                }]
            });

            expect(result).toDeepEqual({
                key: 'root',
                children: [{
                    key: 'child1',
                    children: []
                }, {
                    key: 'child2',
                    children: []
                }]
            });
        });
        it('unpacks recursively', () => {
            let result = TreeUtils.unpackOnlyChild({
                key: 'root',
                children: [{
                    key: 'child',
                    children: [{
                        key: 'grandchild',
                        children: [{
                            key: 'leaf1',
                            children: []
                        },{
                            key: 'leaf2',
                            children: []
                        }]
                    }]
                }]
            });

            expect(result).toDeepEqual({
                key: 'root.child.grandchild',
                children: [{
                    key: 'leaf1',
                    children: []
                }, {
                    key: 'leaf2',
                    children: []
                }]
            });
        })
    });
});

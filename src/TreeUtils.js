export function unpackOnlyChilds(nodes) {
    if (nodes.length == 1) {
        var node = nodes[0];
        for (var child of nodes[0].children) {
            child.key = node.key + '.' + child.key;
        }
        return unpackOnlyChilds(node.children);
    }
    return nodes;
}

export function unpackOnlyChild(node) {
    if (node.children.length == 1) {
        var child = node.children[0];
        child.key = node.key + '.' + child.key;
        return unpackOnlyChild(child);
    }
    return node;
}

// source: https://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another
export function moveInArray(array, from, to) {
    if (to >= array.length) {
        var k = to - array.length;
        while ((k--) + 1) {
            array.push(undefined);
        }
    }
    array.splice(to, 0, array.splice(from, 1)[0]);
}

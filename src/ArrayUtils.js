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

export function average(arr) {
    let sum = 0;
    let count = 0;
    for (var val of arr) {
        if (val !== null) {
            sum += val;
            count++;
        }
    }
    return sum / count;
}

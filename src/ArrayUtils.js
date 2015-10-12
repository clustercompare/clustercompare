// source: https://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another

/**
 * Moves one element to a different position within an array
 * @param array the array to modify
 * @param from source index
 * @param to target index
 */
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

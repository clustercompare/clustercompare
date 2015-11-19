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

export function maxByValue(array, valueProvider) {
    let maxValue = null;
    let maxItem = null;
    for (let item of array) {
        let value = valueProvider(item);
        if (maxValue == null || value > maxValue) {
            maxValue = value;
            maxItem = item;
        }
    }
    return maxItem;
}

export function groupBy(array, keyFn) {
    let map = {};
    for (let item of array) {
        let key = keyFn(item);
        if (!(key in map)) {
            map[key] = [];
        }
        map[key].push(key);
    }
    return map;
}

export function aggregate(array, fn) {
    let value = null;
    for (item of array) {
        value = fn(item, value);
    }
    return value;
}

export function mapValues(obj, fn) {
    for (let key in obj) {
        obj[key] = fn(obj[key]);
    }
    return obj;
}


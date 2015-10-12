import data from './clusterings.json';
import * as ColorGenerator from './ColorGenerator';

let _instances = [];
let _groups = [];
for (let groupKey in data) {
    let group = data[groupKey];
    group.key = groupKey;
    group.color = ColorGenerator.colorForClustering(group.key);
    let groupInstances = [];
    for (let instanceKey in group.instances) {
        let instance = group.instances[instanceKey];
        instance.key = group.key + '.' + instanceKey;
        instance.color = ColorGenerator.colorForClustering(instance.key);
        _instances.push(instance);
        groupInstances.push(instance);
    }
    group.isntances = groupInstances;
    _groups.push(group);
}

export default class Clusterings {
    /**
     * Gets the all keys, like SD.Agg, as array of strings
     * @returns {Array}
     */
    get instanceKeys() {
        return _instances.map(i => i.key);
    }

    /**
     * Gets the metadata of all clusterings
     * @returns {Array}
     */
    get instances() {
        return _instances;
    }

    /**
     * Gets the metadata of clusterings grouped by "group", i.e., SD or FO
     * @returns {Array}
     */
    get groups() {
        return _groups;
    }
}

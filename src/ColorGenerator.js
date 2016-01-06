import d3 from 'd3';
import sha256 from 'sha256';

const ISODOMINANT_COLORS = true;

const PREDEFINED_COLORS = ['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#a65628'];//['#66c2a5','#fc8d62','#8da0cb','#e78ac3','#a6d854','#ffd92f'];
const PREDEFINED_GROUPS = [ "CC", "CO", "EC", "FO", "SD", "SS"];

export function colorForClustering(clusteringName) {
	if (clusteringName == 'packages') {
		return d3.hsl(0, 0, 0.3); // grey
	}

	let [group, instance] = clusteringName.split('.', 2);
	if (PREDEFINED_GROUPS.indexOf(group) >= -1) {
		return PREDEFINED_COLORS[PREDEFINED_GROUPS.indexOf(group)];
	}

	let hue = stringHash(group) * 360;
	let lightness = !ISODOMINANT_COLORS && instance ? stringHash(instance) : 0.5;
	return d3.hsl(hue, 0.5, lightness * 0.5 + 0.25);
}

function stringHash(str) {
	var bytes = sha256(str, { asBytes: true });
	return (bytes[0] + bytes[1] * 0x100) / 0x10000;
}


import d3 from 'd3';
import sha256 from 'sha256';

export function colorForClustering(clusteringName) {
	if (clusteringName == 'packages') {
		return d3.rgb('#808080');
	}

	let [group, instance] = clusteringName.split('.', 2);
	let hue = stringHash(group) * 360;
	let lightness = instance ? stringHash(instance) : 0.5;
	return d3.hsl(hue, 0.5, lightness * 0.5 + 0.25);
}

function stringHash(str) {
	var bytes = sha256(str, { asBytes: true });
	return (bytes[0] + bytes[1] * 0x100) / 0x10000;
}


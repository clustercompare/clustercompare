import * as ArrayUtils from './ArrayUtils';
import SimilarityProvider from './SimilarityProvider';
import Model from './Model.js';
import $ from 'jquery';

const clusteringKeys = [
	'SD.Inh',
	'SD.Agg',
	'SD.Use',
	'FO.InhI',
	'FO.AggI',
	'FO.UseI',
	'EC.Sup',
	'EC.Conf',
	'CC.I',
	'SS.Tfidf'
];

export default class Analyzer {
	constructor(model) {
		this.model = model;
	}

	countClusteringWins() {
		let similarityProvider = new SimilarityProvider();
		similarityProvider.packagesRoot = this.model.packagesTree.root;
		similarityProvider.clusteringRoots = clusteringKeys.map(key => this.model.getTree(key).root);
		let infos = this.model.packagesTree.root.innerNodes.map(packagesNode => similarityProvider.getSimilarityInfo(packagesNode));
		return ArrayUtils.mapValues(ArrayUtils.groupBy(infos, info => info.node.root.clustering), list => list.length);
	}

	getCompleteLatexTable() {
		this.loadAllProjects(models => {
			let table = '';
			let index = 0;
			let sums = [];
			let totalPackageCount = 0;
			for (let model of models) {
				console.log('Analyzing project ' + (index + 1) + ' of ' + models.length + ' (' + model.project + ')...');
				index++;

				let percentages = new Analyzer(model).getClusteringWinPercentages();
				for (let i = 0; i < percentages.length; i++) {
					sums[i] = (sums[i] || 0) + percentages[i];
				}
				let packageCount = model.packagesTree.root.innerNodes.length;
				totalPackageCount += packageCount;
				table += this.formatLatexTableRow(percentages, [ model.project, packageCount ], a => a);
			}

			let averages = sums.map(a => a / models.length);
			let footer = this.formatLatexTableRow(averages, [ 'avg', totalPackageCount ] , a => '\\textbf{' + a + '}');
			console.log(table + '\\midrule\n' + footer);
		})
	}

	loadAllProjects(callback) {
		$.get('data/projects.json', projects => {
			projects = projects.projects.map(project => project.id);
			let models = projects.map(project => new Model(project));
			let readyCount = 0;
			for (let model of models) {
				model.on('ready', () => {
					readyCount++;
					if (readyCount == projects.length) {
						callback(models);
					}
				})
			}
		});
	}

	getClusteringWinPercentages() {
		let map = this.countClusteringWins();
		let packageCount = this.model.packagesTree.root.innerNodes.length;
		return clusteringKeys
			.map(key => map[key] || 0)
			.map(wins => wins / packageCount );
	}

	formatLatexTableRow(percentages, prefixCells, cellWrapper) {
		function color(percentage) {
			let thresholds = [ 0.000000001, 0.1, 0.3];
			for (let i = thresholds.length - 1; i >= 0; i--) {
				if (percentage >= thresholds[i]) {
					return i + 1;
				}
			}
			return 0;
		}

		let formatValue = percentage => percentage == 0 ? '-' : Math.round(percentage * 100) + '\\%';

		let cells = percentages
				.map(percentage => '\\cellcolor{c' + color(percentage) + '}' + formatValue(percentage))

		cells = prefixCells.concat(cells);

		return cells
			.map(cellWrapper)
			.join(' & ')
			+ ' \\\\\n';
	}
}

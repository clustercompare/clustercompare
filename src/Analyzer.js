import * as ArrayUtils from './ArrayUtils';
import SimilarityProvider from './SimilarityProvider';
import Model from './Model.js';
import $ from 'jquery';

export default class Analyzer {
	constructor(model) {
		this.model = model;
	}

	countClusteringWins() {
		let similarityProvider = new SimilarityProvider();
		similarityProvider.packagesRoot = this.model.packagesTree.root;
		similarityProvider.clusteringRoots = this.model.couplingTrees.map(tree => tree.root);
		let infos = this.model.packagesTree.root.innerNodes.map(packagesNode => similarityProvider.getSimilarityInfo(packagesNode));
		return ArrayUtils.mapValues(ArrayUtils.groupBy(infos, info => info.node.root.clustering), list => list.length);
	}

	getCompleteLatexTable() {
		this.loadAllProjects(models => {
			let table = '';
			let index = 0;
			for (let model of models) {
				console.log('Analyzing project ' + (index + 1) + ' of ' + models.length + ' (' + model.project + ')...');
				table += new Analyzer(model).getClusteringWinsAsLatexTable();
				index++;
			}
			console.log(table);
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

	getClusteringWinsAsLatexTable() {
		let keys = [
			'SD.Inh',
			'SD.Agg',
			'SD.Use',
			'FO.InhE',
			'FO.AggE',
			'FO.UseE',
			'FO.InhI',
			'FO.AggI',
			'FO.UseI',
			'EC.Sup',
			'EC.Conf',
			'CO.Bin',
			'CO.Prop',
			'CC.I', +
			'CC.II',
			'SS.Tfidf',
			'SS.LSI'
		];

		function color(percentage) {
			let thresholds = [ 0.125, 0.25, 0.5];
			for (let i = thresholds.length - 1; i >= 0; i--) {
				if (percentage >= thresholds[i]) {
					return i + 1;
				}
			}
			return 0;
		}

		let formatValue = percentage => percentage == 0 ? '-' : Math.round(percentage * 100) + '\\%';

		let map = this.countClusteringWins();
		let packageCount = this.model.packagesTree.root.innerNodes.length;
		let cells = keys
			.map(key => map[key] || 0)
			.map(wins => wins / packageCount )
			.map(percentage => '\\cellcolor{c' + color(percentage) + '}' + formatValue(percentage))
			.join(' & ');

		return this.model.project + ' & ' + cells + ' \\\\\n';
	}
}

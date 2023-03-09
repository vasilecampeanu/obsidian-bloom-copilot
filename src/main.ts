import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

import { DEFAULT_SETTINGS, BloomCopilotSettings, BloomCopilotSettingTab } from './settings'
import { BLOOM_COPILOT_VIEW_TYPE } from './constants'

import { BloomCopilotView } from './components/BloomCopilotView';

export default class BloomCopilot extends Plugin {
	settings: BloomCopilotSettings;

	async onload() {
		// Display a message when loading
		console.log('obsidian-bloom-copilot loading ...');

		// Load Settings
		await this.loadSettings();

		// States
		await this.initStates();

		// Init listeners
		this.initListeners();

		// Register Views
		this.registerView(BLOOM_COPILOT_VIEW_TYPE, (leaf) => new BloomCopilotView(leaf, this));

		// Bind plugin components
		this.app.workspace.onLayoutReady(this.onLayoutReady.bind(this));
	}

	onunload() {
		new Notice(`Bloom Copilot Disabled`);
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	private async initStates() {
	}

	private async initListeners() {
	}

	openBloomCopilot = async () => {
		let leafs = this.app.workspace.getLeavesOfType(BLOOM_COPILOT_VIEW_TYPE);

		if (leafs.length == 0) {
			let leaf = this.app.workspace.getRightLeaf(false);
			await leaf.setViewState({ type: BLOOM_COPILOT_VIEW_TYPE });
			this.app.workspace.revealLeaf(leaf);
		} else {
			leafs.forEach((leaf) => this.app.workspace.revealLeaf(leaf));
		}
	};

	async onLayoutReady(): Promise<void> {
		// Settings Tab
		this.addSettingTab(new BloomCopilotSettingTab(this.app, this));

		// Commands
		this.addCommand({
			id: "open-bloom-copilot",
			name: "Open Bloom Copilot",
			callback: () => this.openBloomCopilot(),
			hotkeys: []
		});
	}
}

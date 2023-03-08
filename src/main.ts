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
		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'selectionchange', (evt: MouseEvent) => {
			let view = this.app.workspace.getActiveViewOfType(MarkdownView);

			if (!view) {
				// View can be null some times. Can't do anything in this case.
			} else {
				let view_mode = view.getMode(); // "preview" or "source" (can also be "live" but I don't know when that happens)
				
				switch (view_mode) {
					case "preview":
						// The leaf is in preview mode, which makes things difficult.
						// I don't know how to get the selection when the editor is in preview mode :(
						break;
					case "source":
						// Ensure that view.editor exists!
						if ("editor" in view) {
							// Good, it exists.
							// @ts-ignore We already know that view.editor exists.
							let selection = view.editor.getSelection(); // THIS IS THE SELECTED TEXT, use it as you wish.

							if (selection.length) {
								console.log(`Selected text: ${selection}`);
							}
						}
						// If we get here, then 'view' does not have a property named 'editor'.
						break;
					default:
						// If we get here, then we did not recognise 'view_mode'.
						break;
				}
			}
		});
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

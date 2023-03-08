import { App, PluginSettingTab, Setting } from "obsidian";
import BloomCopilot from "main";

export interface BloomCopilotSettings {}

export const DEFAULT_SETTINGS: BloomCopilotSettings = {}

export class BloomCopilotSettingTab extends PluginSettingTab {
	plugin: BloomCopilot;

	constructor(app: App, plugin: BloomCopilot) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();
		containerEl.createEl('h1', { text: 'Bloom Copilot Settings' });
	}
}

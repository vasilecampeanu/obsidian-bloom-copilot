import { ItemView, WorkspaceLeaf, Platform } from 'obsidian';

import { BLOOM_COPILOT_VIEW_TYPE } from '../constants';
import BloomCopilot from '../main'

export class BloomCopilotView extends ItemView {
	private readonly plugin: BloomCopilot;

	constructor(leaf: WorkspaceLeaf, plugin: BloomCopilot) {
		super(leaf);
		this.plugin = plugin;
	}

	async onOpen(): Promise<void> {
		this.constructBloomCopilotView();
	}

	async onClose(): Promise<void> {
	}

	onResize() {
		super.onResize();
	}

	getIcon(): string {
		return 'flower';
	}

	getDisplayText(): string {
		return 'Bloom Copilot';
	}	

	getViewType(): string {
		return BLOOM_COPILOT_VIEW_TYPE;
	}

	constructBloomCopilotView() {
		const viewContent = this.containerEl.querySelector(
			".view-content"
		) as HTMLElement;

		if (viewContent) {
			viewContent.classList.add("bloom-copilot-view");
			this.appendBloomCopilot(viewContent);
		} else {
			console.error("Could not find view content!");
		}
	}

	private appendBloomCopilot(viewContent: HTMLElement) {
	}
}

import { App, MarkdownView, Plugin, setIcon } from "obsidian";
import BloomCopilot from "main";

import * as React from "react";
import { useEffect, useState } from "react";

interface BloomChatProps {
	plugin: BloomCopilot;
}

export const BloomChat = (props: BloomChatProps) => {
	const { plugin } = props;
	const [selectedText, setSelectedText] = useState<string>('');

	useEffect(() => {
		let selectionTimeout: NodeJS.Timeout;

		const handleSelectionChange = (evt: any) => {
			let view = app.workspace.getActiveViewOfType(MarkdownView);

			if (!view) {
				// View can be null some times. Can't do anything in this case.
			} else {
				// "preview" or "source" (can also be "live" but I don't know when that happens)
				let view_mode = view.getMode();

				switch (view_mode) {
					case "preview":
						// The leaf is in preview mode, which makes things difficult.
						// I don't know how to get the selection when the editor is in preview mode :(
						break;
					case "source":
						if ("editor" in view) {
							clearTimeout(selectionTimeout);

							selectionTimeout = setTimeout(() => {
								let selection = view?.editor.getSelection();

								if (selection?.length) {
									console.log(selection);
									setSelectedText(selection);
								}
							}, 500)
						}
						break;
					default:
						// If we get here, then we did not recognise 'view_mode'.
						break;
				}
			}
		};

		plugin.registerDomEvent(document, 'selectionchange', handleSelectionChange);
	}, []);

	return (
		<div className="bloom-chat-wrapper">
			<div className="messages">
				{selectedText}
			</div>
			<div className="chat-actions">
				<button className="clear-button">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
				</button>
				<div className="chat-box">
					<div className="textarea">
						<label className="input-sizer stacked">
							<textarea placeholder="Ask me anything..."></textarea>
						</label>
						<button className="sent-button">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
						</button>
					</div>
					<div className="info">
						<p>0/2000</p>
						<button className="pin-button">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="17" x2="12" y2="22"></line><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path></svg>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

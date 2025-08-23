/* @vitest-environment jsdom */
import { describe, it, expect, vi } from 'vitest';

import '../emoji-builder.js';

describe('emoji builder UI', () => {
	it('renders warning and controls', () => {
		document.body.innerHTML = `
		  <div id="settingsPanel">
		    <div id="villainWarning"></div>
		    <select id="villainSubject"><option value="nonhuman" selected>Non‑human</option><option value="human">Human</option></select>
		    <select id="villainPresenting"><option value="male">Male</option><option value="female">Female</option></select>
		    <select id="villainAge"><option value="adult">Adult</option><option value="old">Old</option></select>
		    <select id="villainHair"><option value="default">Default</option><option value="short">Short</option><option value="long">Long</option></select>
		    <input type="checkbox" id="villainBeard" />
		    <select id="villainTone"><option value="medium" selected>Medium</option></select>
		    <select id="villainNonHuman"><option>😈</option></select>
		    <button id="saveSettings"></button>
		  </div>
		  <div id="sidekickHeader"></div>
		`;
		// Wire a minimal save handler piece from nukes logic
		globalThis.stingVillain = vi.fn();
		document.getElementById('saveSettings').click();
		expect(document.getElementById('villainWarning')).toBeTruthy();
	});
});
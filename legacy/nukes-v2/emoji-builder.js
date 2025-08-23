const SKIN = {
	light: '\u{1F3FB}',
	mediumLight: '\u{1F3FC}',
	medium: '\u{1F3FD}',
	mediumDark: '\u{1F3FE}',
	dark: '\u{1F3FF}'
};

function skinTone(tone){ return SKIN[tone] || ''; }

function withTone(base, tone){
	const m = skinTone(tone);
	if (!m) return base;
	return base + m;
}

export function buildVillainEmoji(opts){
	const {
		subject = 'nonhuman', // 'human' | 'nonhuman'
		presenting = 'neutral', // 'male' | 'female'
		age = 'adult', // 'adult' | 'old'
		hair = 'default', // 'short' | 'long' | 'default'
		beard = false,
		tone = 'medium'
	} = opts || {};

	if (subject === 'nonhuman'){
		// default non-human set (user can override in UI); return first if not specified
		return opts.nonHuman || '😈';
	}

	// Human
	if (age === 'old'){
		return presenting === 'female' ? withTone('👵', tone) : withTone('👴', tone);
	}

	// Adult humans
	if (beard && presenting === 'male'){
		// Person with beard supports tone; male-specific ZWJ not needed for most renderers
		return withTone('🧔', tone);
	}

	if (presenting === 'female'){
		if (hair === 'short') return withTone('👩‍🦲', tone); // woman, bald
		if (hair === 'long') return withTone('👩', tone);    // standard woman
		return withTone('👩‍🦱', tone);                       // curly hair variant
	}
	// male
	if (hair === 'short') return withTone('👨‍🦲', tone);     // man, bald
	if (hair === 'long') return withTone('👨‍🦱', tone);      // curly hair variant
	return withTone('👨', tone);
}

export function isHumanSelection(opts){ return (opts?.subject === 'human'); }

export const SKIN_TONES = ['light','mediumLight','medium','mediumDark','dark'];
export const NON_HUMAN_CHOICES = ['😈','👹','💀','🤖','👾','🦂','🐍'];
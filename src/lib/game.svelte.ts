import { imageForHttpCode, phraseForHttpCode, popFrom, randInt } from '$lib';

export const missingElements = {
	imageBlock: 1 << 0,
	codeBlock: 1 << 1,
	phraseBlock: 1 << 2
} as const;

export const flags = Object.values(missingElements);

export const gameModes = {
	...missingElements,
	anyOne: 1 << 3,
	anyTwo: (1 << 3) | (1 << 4)
} as const;

export type GameMode = (typeof gameModes)[keyof typeof gameModes];

export class Game {
	digitsRef = $state<HTMLElement | undefined>();
	rootRef = $state<HTMLElement | undefined>();

	httpCode = $state<number | null>();
	digits = $state<string[]>(['', '', '']);
	nextIndex = $state(0);
	curGameMode = $state<GameMode>(gameModes.codeBlock);

	missingFlag = $derived(this.getMissingFlag(this.curGameMode));
	imageSrc = $derived(this.httpCode ? imageForHttpCode(this.httpCode) : 'cats/frame.png');
	phrase = $derived(this.httpCode ? phraseForHttpCode(this.httpCode) : '');
	correctDigits = $derived(this.httpCode?.toString() ?? '');

	constructor(public getCode: () => number) {}

	getInputs(): HTMLInputElement[] {
		return Array.from(this.digitsRef?.querySelectorAll('input') ?? []);
	}

	getInput(idx = 0): HTMLInputElement | undefined {
		return this.getInputs()[idx];
	}

	focus(idx = 0, direction = 1): void {
		const input = this.getInput(idx);
		if (input) {
			if (input.disabled && idx !== 2 + direction) {
				this.focus(idx + direction, direction);
				return;
			}
			input.focus();
			input.setSelectionRange(0, 0);
		}
	}

	private getMissingFlag(gameMode: GameMode): number {
		let newMissingFlag: number;
		if (gameMode & gameModes.anyOne) {
			const indexPool = Array.from(Array(3).keys());
			const firstIdx = popFrom(indexPool, randInt(3));
			newMissingFlag = flags[firstIdx];
			if (gameMode & gameModes.anyTwo) {
				const secondIdx = popFrom(indexPool, randInt(2));
				newMissingFlag |= flags[secondIdx];
			}
		} else {
			newMissingFlag = gameMode;
		}
		return newMissingFlag;
	}

	next(): void {
		this.httpCode = null;
		setTimeout(() => {
			this.httpCode = this.getCode();
			this.clear();
			setTimeout(() => this.focusOnInput(), 100);
		}, 100);
	}

	focusOnInput(): void {
		this.focus(this.nextIndex);
		this.nextIndex = 0;
	}

	clear(): void {
		this.digits = ['', '', ''];
		this.getInputs().forEach((input) => input.removeAttribute('disabled'));
	}

	lockdownCorrectDigits(): void {
		for (let idx = 2; idx > -1; idx--) {
			if (this.digits[idx] !== this.correctDigits[idx]) {
				this.digits[idx] = '';
				this.nextIndex = idx;
			} else {
				const input = this.getInput(idx);
				if (input) input.setAttribute('disabled', 'true');
			}
		}
		setTimeout(() => this.focusOnInput(), 100);
	}

	onSubmit(): void {
		this.lockdownCorrectDigits();
		if (this.digits.join('') === this.httpCode?.toString()) setTimeout(() => this.next(), 100);
	}
}

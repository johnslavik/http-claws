<script lang="ts" module>
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
</script>

<script lang="ts">
	import { focus, getInputs } from './Digits.svelte';
	import Digits from './Digits.svelte';
	import { imageForHttpCode, phraseForHttpCode } from '$lib';
	import { popFrom, randInt } from '$lib';
	import { scale } from 'svelte/transition';
	import { getInput } from './Digits.svelte';

	let {
		getCode,
		gameMode: curGameMode = gameModes.codeBlock
	}: {
		getCode: () => number;
		gameMode?: GameMode;
	} = $props();

	let missingFlag = $derived(getMissingFlag(curGameMode));
	let nextIndex = 0;
	let digitInputRef = $state<HTMLElement | undefined>();
	let httpCode = $state<number | null>();
	let imageSrc = $derived(httpCode ? imageForHttpCode(httpCode) : 'cats/frame.png');
	let phrase = $derived(httpCode ? phraseForHttpCode(httpCode) : '');
	let correctDigits = $derived(httpCode?.toString() ?? '');
	let digits = $state<string[]>(['', '', '']);

	function getMissingFlag(gameMode: GameMode): number {
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

	function next(): void {
		httpCode = null;
		setTimeout((): void => {
			httpCode = getCode();
			clear();
			setTimeout(focusOnInput, 100);
		}, 100);
	}

	function clear() {
		digits = ['', '', ''];
		getInputs(digitInputRef).forEach((input) => {
			input.removeAttribute('disabled');
		});
	}

	function focusOnInput(): void {
		focus(digitInputRef, nextIndex);
		nextIndex = 0;
	}

	function lockdownCorrectDigits(): void {
		for (let idx = 2; idx > -1; idx--) {
			console.log(digits[idx], correctDigits[idx]);
			if (digits[idx] !== correctDigits[idx]) {
				digits[idx] = '';
				nextIndex = idx;
			} else {
				const input = getInput(digitInputRef, idx);
				if (input) {
					input.setAttribute('disabled', 'true');
				}
			}
		}

		setTimeout(focusOnInput, 100);
	}

	function onSubmit(): void {
		lockdownCorrectDigits();
		if (digits.join('') === httpCode?.toString()) setTimeout(next, 100);
	}

	setTimeout(next, 100);
</script>

{#snippet imageBlock(src: string, missing = false)}
	{#if missing}
		<img src="cats/frame.png" class="max-h-200" alt="" />
	{:else}
		<img {src} class="max-h-200" alt="" />
	{/if}
{/snippet}

{#snippet codeBlock(code: number, missing = false)}
	{#if missing}
		<Digits bind:digits bind:ref={digitInputRef}></Digits>
	{:else}
		<h2 class="text-5xl">{code}</h2>
	{/if}
{/snippet}

{#snippet phraseBlock(text: string, missing = false)}
	{#if missing}
		<input class="bg-transparent text-center text-2xl" />
	{:else}
		<p class="text-2xl">{text}</p>
	{/if}
{/snippet}

<div class="flex"></div>

{#if httpCode}
	<form transition:scale onsubmit={onSubmit} class="flex flex-col items-center gap-4">
		{@render imageBlock(imageSrc, !!(missingFlag & missingElements.imageBlock))}
		<div class="flex flex-col items-center">
			{@render phraseBlock(phrase, !!(missingFlag & missingElements.phraseBlock))}
			{@render codeBlock(httpCode, !!(missingFlag & missingElements.codeBlock))}
		</div>
		<input type="submit" hidden />
	</form>
{/if}

<script lang="ts">
	import { scale } from 'svelte/transition';
	import Digits from './Digits.svelte';
	import { Game, missingElements } from '$lib/game.svelte';
	import { setContext } from 'svelte';

	let { getCode } = $props();

	const game = new Game(() => getCode());
	setContext('game', game);

	$effect(() => {
		setTimeout(() => game.next(), 100);
	});
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
		<Digits bind:ref={game.digitsRef} bind:digits={game.digits} />
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

{#if game.httpCode}
	<form transition:scale onsubmit={() => game.onSubmit()} class="flex flex-col items-center gap-4">
		{@render imageBlock(game.imageSrc, !!(game.missingFlag & missingElements.imageBlock))}
		<div class="flex flex-col items-center">
			{@render phraseBlock(game.phrase, !!(game.missingFlag & missingElements.phraseBlock))}
			{@render codeBlock(game.httpCode, !!(game.missingFlag & missingElements.codeBlock))}
		</div>
		<input type="submit" hidden />
	</form>
{/if}

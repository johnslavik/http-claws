<script>
	import { pushState } from '$app/navigation';
	import { page } from '$app/state';
	import { HASHCAT, randomHttpCode } from '$lib';
	import { Md5 } from 'ts-md5';
	import Game from './Game.svelte';

	const initHash = page.url.searchParams.get('h');
	const firstCode = initHash ? Number.parseInt(HASHCAT[initHash]) : null;

	function getCode(initial = [firstCode]) {
		const code = initial.pop() ?? randomHttpCode();
		pushState('', { h: Md5.hashAsciiStr(code.toString()).toString() });
		return code;
	}
</script>

<main>
	<Game {getCode} />
</main>

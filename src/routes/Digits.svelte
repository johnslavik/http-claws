<script lang="ts" module>
	export function getInputs(ref: HTMLElement | undefined): HTMLInputElement[] {
		return Array.from(ref?.querySelectorAll('input') ?? []);
	}

	export function getInput(
		ref: HTMLElement | undefined,
		idx: number = 0
	): HTMLInputElement | undefined {
		return getInputs(ref)[idx];
	}

	export function focus(ref: HTMLElement | undefined, idx: number = 0, direction: number = 1): void {
		const input = getInput(ref, idx);
		if (input) {
			if (input.disabled && idx != 2 + direction) {
				focus(ref, idx + direction, direction);
				return;
			}
			input.focus();
			input.setSelectionRange(0, 0);
		}
	}
</script>

<script lang="ts">
	let { ref = $bindable<HTMLElement | null>(), digits = $bindable<string[]>() } = $props();

	function setDigitAt(idx: number, digit: string): number {
		digit = digit.trim();
		const first = digit[0];
		const last = digit[digit.length - 1];
		if (/^\d?\d$/.test(digit)) {
			digits[idx] = digits[idx] === first ? last : first;
		} else {
			return 0;
		}
		return digits[idx] ? 1 : 0;
	}

	function handleKey(idx: number, ev: KeyboardEvent): void {
		const target = ev.target as HTMLInputElement | null;
		if (!target) return;

		if (['Delete', 'Backspace'].includes(ev.code)) {
			target.value = '';
		}

		if (['Backspace', 'ArrowLeft'].includes(ev.code)) {
			focus(ref, idx - 1, -1);
		} else if (['Delete', 'ArrowRight'].includes(ev.code)) {
			focus(ref, idx + 1, 1);
		}
	}
</script>

<div class="flex" bind:this={ref}>
	{#each Array(3).keys() as idx}
		<input
			bind:value={
				() => digits[idx],
				(digit: string) => {
					focus(ref, idx + setDigitAt(idx, digit));
					
				}
			}
			onkeydown={(ev: KeyboardEvent) => handleKey(idx, ev)}
			type="text"
			class="w-20 bg-transparent text-center text-5xl border"
			required={true}
		/>
	{/each}
</div>

<style>
	:global(input[disabled='true']) {
		border-color: lightgreen;
		background-color: green;
	}
</style>

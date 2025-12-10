<script lang="ts">
  import { getContext } from 'svelte';
  import type { Game } from '$lib/game.svelte';

  const game = getContext<Game>('game');

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
      game?.focus(idx - 1, -1);
    } else if (['Delete', 'ArrowRight'].includes(ev.code)) {
      game?.focus(idx + 1, 1);
    }
  }
</script>

<!-- layout preserved exactly -->
<div class="flex" bind:this={ref}>
  {#each Array(3).keys() as idx}
    <input
      bind:value={
        () => digits[idx],
        (digit: string) => {
          const step = setDigitAt(idx, digit);
          game?.focus(idx + step);
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
<script>
  import { logBlock } from '$lib/store.svelte.js';
  
  let { block, count = 0 } = $props();
  
  let animating = $state(false);
  
  async function handleTap() {
    animating = true;
    await logBlock(block.id);
    setTimeout(() => {
      animating = false;
    }, 150);
  }
</script>

<button
  onclick={handleTap}
  class="btn btn-lg justify-between h-auto py-4 px-4 sm:py-5 sm:px-5 w-full {animating ? 'scale-95' : ''}"
  style="border-left: 4px solid {block.color}; min-height: 56px;"
>
  <span class="text-left font-medium text-base sm:text-lg">{block.name}</span>
  
  {#if count > 0}
    <span class="badge badge-lg font-semibold" style="background-color: {block.color}; color: white; border: none;">
      {count}
    </span>
  {/if}
</button>

<style>
  button {
    transition: transform 150ms ease;
  }
  
  button.scale-95 {
    transform: scale(0.98);
  }
</style>

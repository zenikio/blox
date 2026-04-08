<script>
  import { logBlock } from '$lib/store.svelte.js';
  import { Asterisk } from 'phosphor-svelte';
  
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
  class="btn btn-lg justify-between h-auto p-4 sm:p-5 w-full"
  style="border-left: 4px solid {block.color};"
>
  <span class="text-left font-medium text-base sm:text-lg">{block.name}</span>
  
  <div class="flex items-center gap-2">
    {#if block.isNonNegotiable}
      <Asterisk size={20} weight="light" style="color: {block.color};" />
    {/if}
    {#if count > 0}
      <span class="badge badge-base badge-soft">
        {count}
      </span>
    {/if}
  </div>
</button>

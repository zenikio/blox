<script>
  import { goto } from '$app/navigation';
  import { getBlocks } from '$lib/store.svelte.js';
  import { deleteBlock } from '$lib/db.js';
  import { init } from '$lib/store.svelte.js';
  import { ArrowLeft, Trash } from 'phosphor-svelte';
  
  let blocks = $derived(getBlocks());
  let deleting = $state(null);
  
  async function handleDelete(blockId, blockName) {
    if (!confirm(`Delete "${blockName}"? This will also delete all logs for this block.`)) {
      return;
    }
    
    deleting = blockId;
    try {
      await deleteBlock(blockId);
      await init();
    } catch (error) {
      console.error('Failed to delete block:', error);
      alert('Failed to delete block');
    } finally {
      deleting = null;
    }
  }
</script>

<div class="p-4 space-y-6">
  <div class="flex items-center gap-3">
    <a href="/" class="btn btn-ghost btn-sm btn-circle">
      <ArrowLeft size={20} />
    </a>
    <h1 class="text-2xl font-bold">Manage Blocks</h1>
  </div>
  
  {#if blocks.length === 0}
    <div class="text-center py-12 text-base-content/60">
      No blocks yet
    </div>
  {:else}
    <div class="space-y-2">
      {#each blocks as block}
        <div class="flex items-center gap-2">
          <div
            class="flex-1 btn btn-lg justify-start h-auto py-4 cursor-default"
            style="border-left: 4px solid {block.color};"
          >
            <span class="text-left font-medium">{block.name}</span>
            {#if block.isNonNegotiable}
              <span class="badge badge-sm">Must Do</span>
            {/if}
          </div>
          <button
            onclick={() => handleDelete(block.id, block.name)}
            class="btn btn-ghost btn-square btn-lg text-error"
            disabled={deleting === block.id}
            aria-label="Delete {block.name}"
          >
            {#if deleting === block.id}
              <span class="loading loading-spinner loading-sm"></span>
            {:else}
              <Trash size={24} />
            {/if}
          </button>
        </div>
      {/each}
    </div>
  {/if}
  
  <a href="/blocks/new" class="btn btn-primary btn-lg btn-block">
    Add New Block
  </a>
</div>

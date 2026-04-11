<script>
  import { getBlocks, updateBlock, deleteBlock } from '$lib/store.svelte.js';
  import { Asterisk, Pencil, Trash, X } from 'phosphor-svelte';
  import { goto } from '$app/navigation';
  
  let blocks = $derived(getBlocks());
  
  let editingBlock = $state(null);
  let editName = $state('');
  let editIsNonNeg = $state(false);
  let editEnergy = $state('medium');
  
  function openEdit(block) {
    editingBlock = block;
    editName = block.name;
    editIsNonNeg = block.isNonNegotiable;
    editEnergy = block.energy;
  }
  
  function closeEdit() {
    editingBlock = null;
    editName = '';
    editIsNonNeg = false;
    editEnergy = 'medium';
  }
  
  async function saveEdit() {
    if (!editingBlock || !editName.trim()) return;
    
    await updateBlock(editingBlock.id, {
      name: editName.trim(),
      isNonNegotiable: editIsNonNeg,
      energy: editEnergy
    });
    
    closeEdit();
  }
  
  async function handleDelete(blockId) {
    if (confirm('Delete this block? All logged entries will be removed.')) {
      await deleteBlock(blockId);
    }
  }
</script>

<div class="p-4 pb-6 space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold">Manage Blocks</h1>
    <button onclick={() => goto('/')} class="btn btn-ghost btn-sm btn-circle">
      <X size={24} />
    </button>
  </div>
  
  <!-- Blocks List -->
  <div class="space-y-2">
    {#each blocks as block}
      <div 
        class="btn btn-lg justify-between h-auto p-4 w-full cursor-default"
        style="border-left: 4px solid {block.color};"
      >
        <div class="flex items-center gap-2">
          <span class="font-medium">{block.name}</span>
          {#if block.isNonNegotiable}
            <Asterisk size={16} weight="light" style="color: {block.color};" />
          {/if}
        </div>
        
        <div class="flex gap-2">
          <button 
            onclick={() => openEdit(block)}
            class="btn btn-ghost btn-sm btn-square"
          >
            <Pencil size={20} />
          </button>
          <button 
            onclick={() => handleDelete(block.id)}
            class="btn btn-ghost btn-sm btn-square text-error"
          >
            <Trash size={20} />
          </button>
        </div>
      </div>
    {/each}
  </div>
</div>

<!-- Edit Modal -->
{#if editingBlock}
  <dialog class="modal modal-open" style="scrollbar-gutter: stable;">
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-4">Edit Block</h3>
      
      <div class="space-y-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Block Name</span>
          </label>
          <input 
            type="text" 
            bind:value={editName}
            class="input input-bordered w-full"
            placeholder="Block name"
          />
        </div>
        
        <div class="form-control">
          <label class="label">
            <span class="label-text">Energy Level</span>
          </label>
          <select bind:value={editEnergy} class="select select-bordered w-full">
            <option value="high">High Energy</option>
            <option value="medium">Medium Energy</option>
            <option value="low">Low Energy</option>
          </select>
        </div>
        
        <div class="form-control">
          <label class="label cursor-pointer justify-start gap-3">
            <input 
              type="checkbox" 
              bind:checked={editIsNonNeg}
              class="checkbox checkbox-primary"
            />
            <div>
              <span class="label-text font-medium">Non-negotiable</span>
              <p class="text-xs text-base-content/60 mt-1">Must complete daily</p>
            </div>
          </label>
        </div>
      </div>
      
      <div class="modal-action">
        <button onclick={closeEdit} class="btn btn-ghost">Cancel</button>
        <button onclick={saveEdit} class="btn btn-primary">Save</button>
      </div>
    </div>
    <div class="modal-backdrop" onclick={closeEdit}></div>
  </dialog>
{/if}

<style>
  :global(body:has(.modal-open)) {
    overflow: hidden;
    padding-right: 0 !important;
  }
</style>

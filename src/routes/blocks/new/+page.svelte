<script>
  import { goto } from '$app/navigation';
  import { addBlock } from '$lib/db.js';
  import { init } from '$lib/store.svelte.js';
  import { ArrowLeft } from 'phosphor-svelte';
  
  let name = $state('');
  let energy = $state('medium');
  let color = $state('#6366f1');
  let isNonNegotiable = $state(false);
  let saving = $state(false);
  
  const colors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
    '#f59e0b', '#84cc16', '#10b981', '#14b8a6',
    '#06b6d4', '#3b82f6', '#64748b', '#a78bfa'
  ];
  
  async function handleSubmit() {
    if (!name.trim()) return;
    
    saving = true;
    try {
      await addBlock({
        name: name.trim(),
        energy,
        color,
        isNonNegotiable
      });
      await init();
      goto('/');
    } catch (error) {
      console.error('Failed to add block:', error);
      saving = false;
    }
  }
</script>

<div class="p-4 space-y-6">
  <div class="flex items-center gap-3">
    <a href="/" class="btn btn-ghost btn-sm btn-circle">
      <ArrowLeft size={20} />
    </a>
    <h1 class="text-2xl font-bold">Add Custom Block</h1>
  </div>
  
  <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="space-y-6">
    <!-- Name -->
    <label class="form-control">
      <div class="label">
        <span class="label-text font-medium">Block Name</span>
      </div>
      <input
        type="text"
        bind:value={name}
        placeholder="e.g., Deep Work, Exercise, Reading"
        class="input input-bordered input-lg"
        required
      />
    </label>
    
    <!-- Energy Level -->
    <div class="form-control">
      <div class="label">
        <span class="label-text font-medium">Energy Level</span>
      </div>
      <div class="join join-vertical w-full">
        <input
          type="radio"
          name="energy"
          value="high"
          bind:group={energy}
          class="btn join-item"
          aria-label="High Energy"
        />
        <input
          type="radio"
          name="energy"
          value="medium"
          bind:group={energy}
          class="btn join-item"
          aria-label="Medium Energy"
        />
        <input
          type="radio"
          name="energy"
          value="low"
          bind:group={energy}
          class="btn join-item"
          aria-label="Low Energy"
        />
      </div>
    </div>
    
    <!-- Color -->
    <div class="form-control">
      <div class="label">
        <span class="label-text font-medium">Color</span>
      </div>
      <div class="grid grid-cols-6 gap-2">
        {#each colors as c}
          <button
            type="button"
            onclick={() => color = c}
            class="btn btn-square btn-lg {color === c ? 'ring-2 ring-offset-2 ring-offset-base-100' : ''}"
            style="background-color: {c}; border-color: {c};"
          >
            {#if color === c}
              <span class="text-white text-2xl">✓</span>
            {/if}
          </button>
        {/each}
      </div>
    </div>
    
    <!-- Non-Negotiable -->
    <div class="form-control">
      <label class="label cursor-pointer justify-start gap-4">
        <input
          type="checkbox"
          bind:checked={isNonNegotiable}
          class="checkbox checkbox-lg"
        />
        <div>
          <span class="label-text font-medium">Daily Non-Negotiable</span>
          <div class="text-sm text-base-content/60">Must complete every day</div>
        </div>
      </label>
    </div>
    
    <!-- Preview -->
    <div class="card bg-base-200">
      <div class="card-body p-4">
        <div class="text-sm font-medium text-base-content/60 mb-2">Preview</div>
        <button
          type="button"
          class="btn btn-lg justify-between h-auto py-4"
          style="border-left: 4px solid {color};"
          disabled
        >
          <span class="text-left font-medium">{name || 'Block Name'}</span>
        </button>
      </div>
    </div>
    
    <!-- Submit -->
    <button
      type="submit"
      class="btn btn-primary btn-lg btn-block"
      disabled={!name.trim() || saving}
    >
      {saving ? 'Adding...' : 'Add Block'}
    </button>
  </form>
</div>

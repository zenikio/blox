<script>
  import { getBlocks, getTodayCounts, getNonNegStatus, getStreak, getTodayTotal, getDeepWorkMinutes, logBlock } from '$lib/store.svelte.js';
  import { formatDate, formatDuration } from '$lib/utils.js';
  import { Flame, Lightning, BatteryCharging, CheckCircle, Circle, Plus, Gear } from 'phosphor-svelte';
  import BlockButton from '../components/BlockButton.svelte';
  
  let blocks = $derived(getBlocks());
  let todayCounts = $derived(getTodayCounts());
  let nonNegStatus = $derived(getNonNegStatus());
  let streak = $derived(getStreak());
  let todayTotal = $derived(getTodayTotal());
  let deepWorkMinutes = $derived(getDeepWorkMinutes());
  
  let nonNegotiables = $derived(blocks.filter(b => b.isNonNegotiable));
  let highEnergy = $derived(blocks.filter(b => b.energy === 'high' && !b.isNonNegotiable));
  let mediumEnergy = $derived(blocks.filter(b => b.energy === 'medium' && !b.isNonNegotiable));
  let lowEnergy = $derived(blocks.filter(b => b.energy === 'low' && !b.isNonNegotiable));
  
  async function handleNonNegTap(blockId) {
    if (!nonNegStatus[blockId]) {
      await logBlock(blockId);
    }
  }
</script>

<div class="p-4 sm:p-6 lg:p-8 pb-6 space-y-6 lg:space-y-8">
  <!-- Header -->
  <div class="space-y-3 lg:space-y-4">
    <div class="flex justify-between items-start">
      <div class="text-sm sm:text-base text-base-content/60">{formatDate(new Date())}</div>
      {#if streak > 0}
        <div class="badge badge-lg gap-2 px-3 py-3">
          <Flame size={18} weight="fill" />
          <span class="font-semibold">{streak} day</span>
        </div>
      {/if}
    </div>
    
    <div>
      <div class="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">{todayTotal}</div>
      <div class="text-base sm:text-lg text-base-content/60 mt-2">{formatDuration(deepWorkMinutes)} deep work</div>
    </div>
  </div>
  
  <!-- Non-negotiables -->
  {#if nonNegotiables.length > 0}
    <div class="space-y-3 lg:space-y-4">
      <div class="text-xs sm:text-sm font-bold text-base-content/50 uppercase tracking-wider">Must Do Today</div>
      <div class="space-y-2 lg:space-y-3">
        {#each nonNegotiables as block}
          {@const isDone = nonNegStatus[block.id]}
          <button
            onclick={() => handleNonNegTap(block.id)}
            class="btn btn-lg w-full justify-start gap-3 h-auto py-4 px-4 sm:py-5 sm:px-5 {isDone ? 'btn-success' : 'btn-outline'}"
            style="min-height: 56px;"
            disabled={isDone}
          >
            {#if isDone}
              <CheckCircle size={24} weight="fill" class="sm:w-7 sm:h-7" />
            {:else}
              <Circle size={24} class="sm:w-7 sm:h-7" />
            {/if}
            <span class="flex-1 text-left text-base sm:text-lg font-medium">{block.name}</span>
            {#if todayCounts[block.id]}
              <span class="badge badge-lg font-semibold">{todayCounts[block.id]}</span>
            {/if}
          </button>
        {/each}
      </div>
    </div>
  {/if}
  
  <!-- High Energy -->
  {#if highEnergy.length > 0}
    <div class="space-y-3 lg:space-y-4">
      <div class="flex items-center gap-2 text-base-content/50">
        <Lightning size={20} weight="fill" class="sm:w-6 sm:h-6" />
        <span class="text-xs sm:text-sm font-bold uppercase tracking-wider">High Energy</span>
      </div>
      <div class="space-y-2 lg:space-y-3">
        {#each highEnergy as block}
          <BlockButton {block} count={todayCounts[block.id] || 0} />
        {/each}
      </div>
    </div>
  {/if}
  
  <!-- Medium Energy -->
  {#if mediumEnergy.length > 0}
    <div class="space-y-3 lg:space-y-4">
      <div class="flex items-center gap-2 text-base-content/50">
        <BatteryCharging size={20} weight="fill" class="sm:w-6 sm:h-6" />
        <span class="text-xs sm:text-sm font-bold uppercase tracking-wider">Medium Energy</span>
      </div>
      <div class="space-y-2 lg:space-y-3">
        {#each mediumEnergy as block}
          <BlockButton {block} count={todayCounts[block.id] || 0} />
        {/each}
      </div>
    </div>
  {/if}
  
  <!-- Low Energy -->
  {#if lowEnergy.length > 0}
    <div class="space-y-3 lg:space-y-4">
      <div class="flex items-center gap-2 text-base-content/50">
        <BatteryCharging size={20} class="sm:w-6 sm:h-6" />
        <span class="text-xs sm:text-sm font-bold uppercase tracking-wider">Low Energy</span>
      </div>
      <div class="space-y-2 lg:space-y-3">
        {#each lowEnergy as block}
          <BlockButton {block} count={todayCounts[block.id] || 0} />
        {/each}
      </div>
    </div>
  {/if}
  
  <!-- Add/Manage Blocks -->
  <div class="flex gap-2">
    <a href="/blocks/new" class="btn btn-outline btn-lg flex-1 gap-2 py-4" style="min-height: 56px;">
      <Plus size={22} />
      <span class="font-medium">Add Block</span>
    </a>
    <a href="/blocks/manage" class="btn btn-outline btn-lg btn-square" style="min-height: 56px;">
      <Gear size={22} />
    </a>
  </div>
</div>

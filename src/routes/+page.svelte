<script>
  import { getBlocks, getTodayCounts, getStreak, getTodayTotal, getDeepWorkMinutes, logBlock } from '$lib/store.svelte.js';
  import { formatDate, formatDuration } from '$lib/utils.js';
  import { Flame, Lightning, BatteryCharging, Plus, Gear } from 'phosphor-svelte';
  import BlockButton from '../components/BlockButton.svelte';
  
  let blocks = $derived(getBlocks());
  let todayCounts = $derived(getTodayCounts());
  let streak = $derived(getStreak());
  let todayTotal = $derived(getTodayTotal());
  let deepWorkMinutes = $derived(getDeepWorkMinutes());
  
  let highEnergy = $derived(blocks.filter(b => b.energy === 'high'));
  let mediumEnergy = $derived(blocks.filter(b => b.energy === 'medium'));
  let lowEnergy = $derived(blocks.filter(b => b.energy === 'low'));
</script>

<div class="p-4 pb-6 space-y-6">
  <!-- Header -->
  <div class="space-y-3">
    <div class="flex justify-between items-start">
      <div class="text-sm text-base-content/60">{formatDate(new Date())}</div>
      {#if streak > 0}
        <div class="badge badge-lg gap-2 px-3 py-3">
          <Flame size={18} weight="fill" />
          <span class="font-semibold">{streak} day</span>
        </div>
      {/if}
    </div>
    
    <div>
      <div class="text-5xl font-bold tracking-tight">{todayTotal}</div>
      <div class="text-base text-base-content/60 mt-2">{formatDuration(deepWorkMinutes)} deep work</div>
    </div>
  </div>
  
  <!-- High Energy -->
  {#if highEnergy.length > 0}
    <div class="space-y-3">
      <div class="flex items-center gap-2 text-base-content/50">
        <Lightning size={20} weight="fill" />
        <span class="text-xs font-bold uppercase tracking-wider">High Energy</span>
      </div>
      <div class="space-y-2">
        {#each highEnergy as block}
          <BlockButton {block} count={todayCounts[block.id] || 0} />
        {/each}
      </div>
    </div>
  {/if}
  
  <!-- Medium Energy -->
  {#if mediumEnergy.length > 0}
    <div class="space-y-3">
      <div class="flex items-center gap-2 text-base-content/50">
        <BatteryCharging size={20} weight="fill" />
        <span class="text-xs font-bold uppercase tracking-wider">Medium Energy</span>
      </div>
      <div class="space-y-2">
        {#each mediumEnergy as block}
          <BlockButton {block} count={todayCounts[block.id] || 0} />
        {/each}
      </div>
    </div>
  {/if}
  
  <!-- Low Energy -->
  {#if lowEnergy.length > 0}
    <div class="space-y-3">
      <div class="flex items-center gap-2 text-base-content/50">
        <BatteryCharging size={20} />
        <span class="text-xs font-bold uppercase tracking-wider">Low Energy</span>
      </div>
      <div class="space-y-2">
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
    <a href="/blocks/manage" class="btn btn-outline btn-lg btn-square" style="min-height: 56px; width: 56px;">
      <Gear size={22} />
    </a>
  </div>
</div>

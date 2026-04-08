<script>
  import { onMount } from 'svelte';
  import { getBlocks } from '$lib/store.svelte.js';
  import { getWeekCountPerBlock } from '$lib/db.js';
  import { formatWeekRange } from '$lib/utils.js';
  import { CaretLeft, CaretRight } from 'phosphor-svelte';
  import { addWeeks, subWeeks } from 'date-fns';
  import WeekBlock from '../../components/WeekBlock.svelte';
  
  let blocks = $derived(getBlocks());
  let currentWeek = $state(new Date());
  let blockCounts = $state([]);
  
  async function loadWeekData() {
    blockCounts = await getWeekCountPerBlock(currentWeek);
    blockCounts.sort((a, b) => b.count - a.count);
  }
  
  onMount(async () => {
    await loadWeekData();
  });
  
  async function prevWeek() {
    currentWeek = subWeeks(currentWeek, 1);
    await loadWeekData();
  }
  
  async function nextWeek() {
    currentWeek = addWeeks(currentWeek, 1);
    await loadWeekData();
  }
  
  function getBlockById(id) {
    return blocks.find(b => b.id === id);
  }
  
  let maxCount = $derived(Math.max(...blockCounts.map(b => b.count), 1));
  let totalBlocks = $derived(blockCounts.reduce((sum, b) => sum + b.count, 0));
  let totalHours = $derived(Math.floor(totalBlocks * 30 / 60));
  let totalMinutes = $derived((totalBlocks * 30) % 60);
</script>

<div class="p-4 pb-6 space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <button onclick={prevWeek} class="btn btn-ghost btn-sm btn-circle">
      <CaretLeft size={24} />
    </button>
    <span class="text-lg font-semibold">{formatWeekRange(currentWeek)}</span>
    <button onclick={nextWeek} class="btn btn-ghost btn-sm btn-circle">
      <CaretRight size={24} />
    </button>
  </div>
  
  <!-- Summary -->
  <div class="btn btn-lg h-auto p-4 w-full cursor-default">
    <div class="w-full text-left">
      <div class="text-3xl font-bold">{totalBlocks}</div>
      <div class="text-sm text-base-content/60 mt-1">
        {totalHours}h {totalMinutes}m this week
      </div>
    </div>
  </div>
  
  <!-- All Blocks Breakdown -->
  <div class="space-y-2">
    {#each blockCounts as { blockId, count }}
      {@const block = getBlockById(blockId)}
      {#if block}
        <WeekBlock {block} {count} {maxCount} />
      {/if}
    {/each}
  </div>
</div>

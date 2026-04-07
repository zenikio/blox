<script>
  import { onMount } from 'svelte';
  import { getBlocks } from '$lib/store.svelte.js';
  import { getWeekCountPerDay, getWeekCountPerBlock, getNonNegWeekGrid } from '$lib/db.js';
  import { formatWeekRange } from '$lib/utils.js';
  import { CaretLeft, CaretRight, Circle } from 'phosphor-svelte';
  import { startOfWeek, addWeeks, subWeeks, format, isToday } from 'date-fns';
  import { Chart, BarController, BarElement, CategoryScale, LinearScale } from 'chart.js';
  
  Chart.register(BarController, BarElement, CategoryScale, LinearScale);
  
  let blocks = $derived(getBlocks());
  let currentWeek = $state(new Date());
  let weekData = $state([]);
  let blockCounts = $state([]);
  let nonNegGrid = $state([]);
  let chartCanvas;
  let chartInstance;
  
  async function loadWeekData() {
    weekData = await getWeekCountPerDay(currentWeek);
    blockCounts = await getWeekCountPerBlock(currentWeek);
    nonNegGrid = await getNonNegWeekGrid(currentWeek);
    
    blockCounts.sort((a, b) => b.count - a.count);
    
    if (chartInstance) {
      updateChart();
    }
  }
  
  function updateChart() {
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = weekData.map(d => d.count);
    const colors = weekData.map(d => {
      return isToday(new Date(d.date)) ? '#6366f1' : '#1a1a1a';
    });
    const borderColors = weekData.map(d => {
      return isToday(new Date(d.date)) ? '#6366f1' : '#333333';
    });
    
    chartInstance.data.labels = labels;
    chartInstance.data.datasets[0].data = data;
    chartInstance.data.datasets[0].backgroundColor = colors;
    chartInstance.data.datasets[0].borderColor = borderColors;
    chartInstance.update();
  }
  
  function initChart() {
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = weekData.map(d => d.count);
    const colors = weekData.map(d => {
      return isToday(new Date(d.date)) ? '#6366f1' : '#1a1a1a';
    });
    const borderColors = weekData.map(d => {
      return isToday(new Date(d.date)) ? '#6366f1' : '#333333';
    });
    
    chartInstance = new Chart(chartCanvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          borderColor: borderColors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: '#888888', stepSize: 5 },
            grid: { display: false },
            border: { color: '#222222' }
          },
          x: {
            ticks: { color: '#888888' },
            grid: { display: false },
            border: { color: '#222222' }
          }
        }
      }
    });
  }
  
  onMount(async () => {
    await loadWeekData();
    initChart();
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
</script>

<div class="p-4">
  <div class="flex items-center justify-between mb-6">
    <button onclick={prevWeek} class="p-2 text-[#888888] hover:text-[#f5f5f5]">
      <CaretLeft size={24} />
    </button>
    <span class="text-lg font-medium">{formatWeekRange(currentWeek)}</span>
    <button onclick={nextWeek} class="p-2 text-[#888888] hover:text-[#f5f5f5]">
      <CaretRight size={24} />
    </button>
  </div>
  
  <div class="bg-[#111111] rounded-xl p-4 mb-6" style="height: 240px;">
    <canvas bind:this={chartCanvas}></canvas>
  </div>
  
  <div class="mb-6">
    <h3 class="text-sm font-medium text-[#888888] mb-3">Block Breakdown</h3>
    <div class="space-y-3">
      {#each blockCounts as { blockId, count }}
        {@const block = getBlockById(blockId)}
        {#if block}
          <div>
            <div class="flex justify-between items-center mb-1">
              <span class="text-sm">{block.name}</span>
              <span class="text-sm text-[#888888]">{count}</span>
            </div>
            <div class="h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
              <div
                class="h-full rounded-full"
                style="width: {(count / maxCount) * 100}%; background-color: {block.color};"
              ></div>
            </div>
          </div>
        {/if}
      {/each}
    </div>
  </div>
  
  <div>
    <h3 class="text-sm font-medium text-[#888888] mb-3">Non-Negotiables</h3>
    <div class="space-y-3">
      {#each nonNegGrid as { blockId, days }}
        {@const block = getBlockById(blockId)}
        {#if block}
          <div class="flex items-center gap-3">
            <span class="text-sm w-32 flex-shrink-0">{block.name}</span>
            <div class="flex gap-2">
              {#each days as done}
                <Circle
                  size={16}
                  weight={done ? 'fill' : 'regular'}
                  style="color: {done ? block.color : '#333333'};"
                />
              {/each}
            </div>
          </div>
        {/if}
      {/each}
    </div>
  </div>
</div>

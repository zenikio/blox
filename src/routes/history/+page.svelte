<script>
  import { onMount } from 'svelte';
  import { getBlocks } from '$lib/store.svelte.js';
  import { getLogsGroupedByDate, deleteLog } from '$lib/db.js';
  import { formatDateLabel, formatTime } from '$lib/utils.js';
  import { Trash } from 'phosphor-svelte';
  
  let blocks = $derived(getBlocks());
  let groupedLogs = $state([]);
  
  async function loadHistory() {
    groupedLogs = await getLogsGroupedByDate();
  }
  
  onMount(loadHistory);
  
  function getBlockById(id) {
    return blocks.find(b => b.id === id);
  }
  
  async function handleDelete(logId, event) {
    event.stopPropagation();
    await deleteLog(logId);
    await loadHistory();
  }
  
  function groupEntriesByBlock(entries) {
    const grouped = {};
    entries.forEach(entry => {
      if (!grouped[entry.blockId]) {
        grouped[entry.blockId] = [];
      }
      grouped[entry.blockId].push(entry);
    });
    return grouped;
  }
</script>

<div class="p-4 space-y-6">
  <h1 class="text-2xl font-bold">History</h1>
  
  {#if groupedLogs.length === 0}
    <div class="text-center py-12">
      <div class="text-base-content/40 mb-2">No logs yet</div>
      <div class="text-sm text-base-content/60">Start tracking your blocks!</div>
    </div>
  {:else}
    <div class="space-y-6">
      {#each groupedLogs as group}
        <div class="space-y-3">
          <div class="flex items-baseline gap-2">
            <span class="font-semibold">{formatDateLabel(group.date)}</span>
            <span class="text-sm text-base-content/60">· {group.total} blocks</span>
          </div>
          
          <div class="space-y-2">
            {#each Object.entries(groupEntriesByBlock(group.entries)) as [blockId, entries]}
              {@const block = getBlockById(parseInt(blockId))}
              {#if block}
                <div class="card bg-base-200" style="border-left: 4px solid {block.color};">
                  <div class="card-body p-4">
                    <div class="flex items-center justify-between mb-2">
                      <span class="font-medium">{block.name}</span>
                      <span class="badge badge-sm badge-ghost">×{entries.length}</span>
                    </div>
                    <div class="flex flex-wrap gap-2">
                      {#each entries as entry}
                        <button
                          onclick={(e) => handleDelete(entry.id, e)}
                          class="btn btn-xs btn-ghost gap-1 hover:btn-error"
                        >
                          {formatTime(entry.loggedAt)}
                          <Trash size={12} />
                        </button>
                      {/each}
                    </div>
                  </div>
                </div>
              {/if}
            {/each}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

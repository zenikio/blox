<script>
  import { Asterisk } from 'phosphor-svelte';
  
  let { block, count, maxCount } = $props();
</script>

<div class="btn btn-lg justify-between h-auto p-4 w-full cursor-default" style="border-left: 4px solid {block.color};">
  <div class="flex items-center gap-2">
    <span class="font-medium">{block.name}</span>
    {#if block.isNonNegotiable}
      <Asterisk size={16} weight="light" style="color: {block.color};" />
    {/if}
  </div>
  
  <span class="text-sm text-base-content/60">{count} × 30m</span>
</div>

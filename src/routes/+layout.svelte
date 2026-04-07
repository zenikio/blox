
<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { init } from '$lib/store.svelte.js';
  import { House, ChartBar, ClockCounterClockwise } from 'phosphor-svelte';
  import './layout.css';
  
  let { children } = $props();
  let ready = $state(false);
  
  onMount(async () => {
    await init();
    ready = true;
  });
  
  function navigate(path) {
    goto(path);
  }
</script>

<svelte:head>
  <meta name="viewport" content="viewport-fit=cover" />
</svelte:head>

{#if ready}
  <div class="min-h-screen bg-base-100" style="padding-bottom: calc(5rem + env(safe-area-inset-bottom));">
    <div class="mx-auto w-full max-w-md lg:max-w-2xl">
      {@render children()}
    </div>
  </div>
  
  <div class="dock fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md lg:max-w-2xl">
    <button class="{$page.url.pathname === '/' ? 'dock-active' : ''}" onclick={() => navigate('/')}>
      <House size={24} weight={$page.url.pathname === '/' ? 'fill' : 'regular'} />
      <span class="dock-label">Home</span>
    </button>
    <button class="{$page.url.pathname === '/week' ? 'dock-active' : ''}" onclick={() => navigate('/week')}>
      <ChartBar size={24} weight={$page.url.pathname === '/week' ? 'fill' : 'regular'} />
      <span class="dock-label">Week</span>
    </button>
    <button class="{$page.url.pathname === '/history' ? 'dock-active' : ''}" onclick={() => navigate('/history')}>
      <ClockCounterClockwise size={24} weight={$page.url.pathname === '/history' ? 'fill' : 'regular'} />
      <span class="dock-label">History</span>
    </button>
  </div>
{:else}
  <div class="min-h-screen bg-base-100 flex items-center justify-center">
    <span class="loading loading-spinner loading-lg"></span>
  </div>
{/if}

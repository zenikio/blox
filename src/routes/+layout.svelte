
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
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
</svelte:head>

<div data-theme="dark">
{#if ready}
  <div class="min-h-screen bg-base-100 pb-24">
    <div class="mx-auto w-full max-w-md lg:max-w-2xl">
      {@render children()}
    </div>
  </div>
  
  <nav class="nav-bar">
    <div class="nav-pill">
      <button 
        class="nav-item {$page.url.pathname === '/' ? 'nav-active' : ''}" 
        onclick={() => navigate('/')}
        aria-label="Home"
      >
        <House size={24} weight={$page.url.pathname === '/' ? 'fill' : 'regular'} />
      </button>
      <button 
        class="nav-item {$page.url.pathname === '/week' ? 'nav-active' : ''}" 
        onclick={() => navigate('/week')}
        aria-label="Week"
      >
        <ChartBar size={24} weight={$page.url.pathname === '/week' ? 'fill' : 'regular'} />
      </button>
      <button 
        class="nav-item {$page.url.pathname === '/history' ? 'nav-active' : ''}" 
        onclick={() => navigate('/history')}
        aria-label="History"
      >
        <ClockCounterClockwise size={24} weight={$page.url.pathname === '/history' ? 'fill' : 'regular'} />
      </button>
    </div>
  </nav>
{:else}
  <div class="min-h-screen bg-base-100 flex items-center justify-center">
    <span class="loading loading-spinner loading-lg"></span>
  </div>
{/if}
</div>

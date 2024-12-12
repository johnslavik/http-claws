<script>
  import { page } from '$app/state';
  import Nav from './Nav.svelte';
  import Footer from './Footer.svelte';

  import '../app.css';
  let { children } = $props();

  const pageName = $derived(page.data.name);
  let siteName = $state('HTTP Claws Game');
  const titleSuffix = $derived(pageName ? ' | ' + pageName : '');
</script>

<svelte:head>
  <title>{siteName}{titleSuffix}</title>
</svelte:head>

<div
  class="m-auto flex h-full max-w-screen-2xl flex-col justify-between p-4 sm:px-16 sm:py-4 lg:px-32 lg:py-4"
>
  <Nav />
  {@render children()}
  <Footer />
</div>
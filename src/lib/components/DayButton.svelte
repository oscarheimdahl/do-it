<script lang="ts">
  import { onMount } from 'svelte';
  import { simpleHash } from '$/lib/helpers/hash';

  export let date: Date = new Date();
  export let faded: boolean = false;
  export let previouslyChecked = false;

  const CODE = 103181;
  let checked = false;

  function onclick() {
    const code = localStorage.getItem('code') ?? '';

    if (simpleHash(code) !== CODE) {
      setTimeout(() => (checked = !checked));
      return;
    }

    fetch('/', {
      method: 'POST',
      body: JSON.stringify({
        date,
        didit: !checked,
      }),
    });
  }

  onMount(() => {
    checked = previouslyChecked;
  });
</script>

<div>
  <input bind:checked class={faded ? 'faded' : ''} on:click={onclick} type="checkbox" name="" />
</div>

<style>
  input {
    appearance: none;
    background-color: transparent;
    border: white solid 0.2rem;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    transition: background-color 300ms, transform 150ms;
    opacity: 0.5;
  }

  input.faded {
    opacity: 0.1;
  }

  input:hover {
    background-color: #ffffff88;
    cursor: pointer;
  }

  input:active {
    transform: scale(0.95);
  }

  input:checked {
    background-color: white;
  }
</style>

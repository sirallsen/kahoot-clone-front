<script>
  export let fieldTag;
  export let icon = null;
  export let placeholder;
  export let input;
  export let centerPrompt = false;
  export let textArea = false;
  export let maxlength = 100;
  export let capsOnly = false;
</script>

{#if centerPrompt}
  <p style="text-align: center;">{fieldTag}:</p>
{:else}
  <p>{fieldTag}:</p>
{/if}

<div class="field">
  <p class="control {icon != null ? 'has-icons-left' : ''} has-icons-right">
    {#if !textArea}
      <input
        bind:value={input}
        class="input is-medium is-rounded"
        type="text"
        {maxlength}
        style="{capsOnly ? 'text-transform: uppercase' : ''} "
        {placeholder}
      />
    {:else}
      <div class="field">
        <div class="control">
          <textarea
            bind:value={input}
            class="textarea is-medium has-fixed-size"
            {maxlength}
            {placeholder}
          />
        </div>
      </div>
    {/if}
    {#if icon != null}
      <span class="icon is-small is-left">
        <i class="fas fa-{icon}" />
      </span>
    {/if}
  </p>
</div>

<style>
  p {
    font-weight: 800;
  }
</style>

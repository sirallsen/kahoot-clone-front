<script>
  import Field from "./Field.svelte";
  import { fade } from "svelte/transition";

  export let socket;
  export let prompt;
  export let roomCode;
  export let type;
  export let username;
  export let options;
  let inputValue;

  function SendInput() {
    const value = {
      msgType: "SendInput",
      roomId: roomCode,
      username: username,
      input: inputValue,
    };

    console.log(value);

    socket.send(JSON.stringify(value).toString());
  }
</script>

<section transition:fade>
  {inputValue}
  <body class="card-body">
    <div class="card">
      <div class="card-content">
        <div class="content">
          {#if type == "Text"}
            <Field
              bind:input={inputValue}
              fieldTag={prompt}
              centerPrompt={true}
              placeholder="I probably shouldn't write this..."
              textArea={true}
            />
            <button
              class="button is-primary"
              style="width: 100%;"
              on:click={SendInput}>SEND</button
            >
          {:else if type == "Prompt"}
            <div class="content">
              <p class="bold has-text-centered has-text-primary">
                THIS IS YOUR PROMPT
              </p>
            </div>
            <footer class="card-footer">
              <div class="card-footer-item">
                <p class="has-text-centered">{prompt}</p>
              </div>
            </footer>
          {:else if type == "Vote"}
            <div class="content">
              <p class="bold has-text-centered has-text-primary">
                {prompt}
              </p>
            </div>
            <footer class="card-footer">
              <div class="card-footer-item">
                <div class="control">
                  {#each options as username}<div class="columns">
                      <label class="radio column is-full">
                        <input
                          on:change={() => (inputValue = username)}
                          type="radio"
                          name="rsvp"
                        />
                        {username}
                      </label>
                    </div>
                  {/each}
                </div>
              </div>
            </footer>
            <button
              class="button is-primary"
              style="width: 100%;"
              on:click={SendInput}>SEND</button
            >
          {/if}
        </div>
      </div>
    </div>
  </body>
</section>

<style>
  button {
    margin-top: 10px;
  }

  .bold {
    font-weight: 800;
    font-size: larger;
    text-transform: uppercase;
  }
</style>

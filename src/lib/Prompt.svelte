<script>
  import Field from "./Field.svelte";
  import { fade } from "svelte/transition";

  export let socket;
  export let prompt;
  export let roomCode;
  export let username;
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
  <body class="card-body">
    <div class="card">
      <div class="card-content">
        <div class="content">
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
        </div>
      </div>
    </div>
  </body>
</section>

<style>
  button {
    margin-top: 10px;
  }
</style>

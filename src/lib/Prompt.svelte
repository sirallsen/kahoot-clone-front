<script>
  import Field from "./Field.svelte";
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";

  export let socket;
  export let prompt;
  export let isHost;
  export let roomCode;
  export let username;
  export let questions;
  export let options;
  export let timer;
  let inputValue;

  let colorArray = ["red", "green", "blue", "yellow"];

  function sendInput() {
    let correctAnswer = "";
    options.forEach(option => {
      if(option.correctAnswer) {
        correctAnswer = option.answer;
      }
    });
    const value = {
      msgType: "SendInput",
      roomId: roomCode,
      username: username,
      input: inputValue,
      correctAnswer: correctAnswer
    };

    console.log(value);

    socket.send(JSON.stringify(value).toString());
  }
</script>

<section transition:fade>
  {inputValue}
  {#if !isHost}
    <body class="card-body">
      <div class="card">
        <div class="card-content">
          <div class="content">
            <div class="content">
              <p class="bold has-text-centered has-text-primary">
                {prompt}
              </p>
            </div>
            <footer class="card-footer">
              <div class="card-footer-item">
                <div class="control">
                  {#each options as option}<div class="columns">
                      <label class="radio column is-full">
                        <input
                          on:change={() => (inputValue = option.answer)}
                          type="radio"
                          name="rsvp"
                        />
                        {option.answer}
                      </label>
                    </div>
                  {/each}
                </div>
              </div>
            </footer>
            <button
              class="button is-primary"
              style="width: 100%;"
              on:click={sendInput}>SEND</button
            >
          </div>
        </div>
      </div>
    </body>
  {/if}
  {#if isHost}
    <body class="bigger-card-body">
      <div class="card">
        <div class="card-content">
          <div class="content">
            <div class="content">
              <h1 class="has-text-centered has-text-primary">
                {timer}
              </h1>
              <h3 class="has-text-centered">
                {prompt}
              </h3>
              <div class="container">
                <div class="option-container">
                {#each options as option, index (index)}
                  <div class="option {colorArray[index]} card">
                    {option.answer}
                  </div>
                {/each}
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </body>
  {/if}
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

  .container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .option-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 1rem;
  }

  h3 {
    word-break: break-all;
    white-space: normal;
  }

  .option {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 200px;
    color: white;
    font-weight: bold;
    height: 100px;
  }

  .red {
    background-color: lightcoral;
  }

  .blue {
    background-color: lightskyblue;
  }

  .green {
    background-color: lightgreen;
  }

  .yellow {
    background-color: lightseagreen;
  }
</style>

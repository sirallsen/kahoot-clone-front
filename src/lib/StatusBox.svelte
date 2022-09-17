<script>
  export let prompt = "";
  export let isHost = false;
  export let gameStarted;

  export let roomCode;
  export let socket;

  function StartGame() {
    const value = {
      msgType: "StartGame",
      roomId: roomCode,
    };

    socket.send(JSON.stringify(value).toString());
  }
</script>

<section>
  <body class="card-body">
    <div class="card">
      <div class="card-content">
        {#if !isHost || gameStarted}
          <div class="content"><p class="title">{prompt}</p></div>
        {:else}
          <div class="content">
            <p class="has-text-centered">
              {"You are the Host. Start the game when everyone connects!"}
            </p>
          </div>
        {/if}
      </div>
      <footer class="card-footer">
        <div class="card-footer-item">
          <p class="has-text-centered">
            {#if !isHost || gameStarted}
              You already did everything you could. Look at the game screen for
              more information.
            {:else}
              <button
                class="button is-primary"
                style="width: 100%;"
                on:click={StartGame}>START GAME</button
              >
            {/if}
          </p>
        </div>
      </footer>
    </div>
  </body>
</section>

<style>
  .title {
    text-align: center;
    margin: 40px 10px;
    white-space: pre-line;
  }
</style>

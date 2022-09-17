<script>
  import { fade } from "svelte/transition";
  import Field from "./Field.svelte";

  export let username = "";
  export let roomCode;
  export let socket;

  function Connect() {
    roomCode = roomCode.toUpperCase();
    const value = {
      msgType: "Connection",
      roomId: roomCode,
      username: username,
    };

    socket.send(JSON.stringify(value).toString());
  }
</script>

<section transition:fade>
  <body class="card-body">
    <div class="card">
      <div class="card-content">
        <div class="content">
          <Field
            bind:input={username}
            fieldTag="Player Name"
            icon="user"
            maxlength={14}
            placeholder="PartyKitty"
          />
          <Field
            bind:input={roomCode}
            fieldTag="Room Code"
            icon="hashtag"
            maxlength={6}
            capsOnly={true}
            placeholder="ALLS3N"
          />
        </div>
      </div>
      <footer class="card-footer">
        <div class="card-footer-item">
          <button class="button is-primary" on:click={Connect}>JOIN GAME</button
          >
        </div>
      </footer>
    </div>
  </body>
</section>

<style>
</style>

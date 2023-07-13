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

  function Create() {
    // roomCode = roomCode.toUpperCase();
    const value = {
      msgType: "Create",
      roomId: generatePIN(),
    };

    socket.send(JSON.stringify(value).toString());
  }

  function generatePIN() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let pin = '';

    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      pin += characters[randomIndex];
    }

  return pin;
}
</script>

<section transition:fade>
  <body class="card-body">
    <div class="card">
      <div class="card-content">
        <div class="content">
          <Field
            bind:input={username}
            fieldTag="Nome do Jogador"
            icon="user"
            maxlength={14}
            placeholder="PartyKitty"
          />
          <Field
            bind:input={roomCode}
            fieldTag="PIN da Sala"
            icon="hashtag"
            maxlength={6}
            capsOnly={true}
            placeholder="ALLS3N"
          />
        </div>
      </div>
      <footer class="card-footer">
        <div class="card-footer-item">
          <button class="button is-primary" on:click={Connect}>ENTRAR EM UM JOGO</button
          >
        </div>
        <div class="card-footer-item">
          <button class="button is-secondary" on:click={Create}>CRIAR JOGO</button
          >
        </div>
      </footer>
    </div>
  </body>
</section>

<style>
</style>

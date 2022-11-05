<script>
  import svelteLogo from "./assets/svelte.svg";
  import Counter from "./lib/Counter.svelte";
  import JoinRoom from "./lib/JoinRoom.svelte";
  import Prompt from "./lib/Prompt.svelte";
  import StatusBox from "./lib/StatusBox.svelte";

  let connected = false;
  let prompt = false;
  let wait = true;
  let gameStarted = false;

  let username;
  let roomCode;
  let isHost = false;

  let message = {};

  // const ws = new WebSocket("wss://lively-paper-345.fly.dev:443", "protocolOne");
  const ws = new WebSocket("ws://localhost:8080", "protocolOne");

  ws.onmessage = (e) => {
    try {
      let previousMessage = message;

      message = JSON.parse(e.data);
      if (message.msgType == "Connected") {
        if (message.additional != "") {
          isHost = true;
        }
        connected = true;
        prompt = false;
        wait = true;
      } else if (message.msgType == "StartGame") {
        gameStarted = true;
        wait = true;
      } else if (message.msgType == "StartInput") {
        message.inputs.forEach((element) => {
          if (element.username == username) {
            message.prompt = element.prompt;
            message.input = element;
            prompt = true;
            wait = false;
          }
        });
      } else if (message.msgType == "IndividualInput") {
        if (message.username == username) {
          message.prompt = message.input.prompt;
          prompt = true;
          wait = false;
        }
      } else if (message.msgType == "Wait") {
        wait = true;
        prompt = false;
      } else if (message.msgType == "EndInput") {
        wait = true;
        prompt = false;
      } else if (message.msgType == "Handshake") {
        message = previousMessage;
      }
    } catch (error) {
      alert(e.data);
    }
  };
</script>

<body>
  {#if !connected}
    <JoinRoom bind:username bind:roomCode socket={ws} />
  {/if}

  {#if connected}
    {#if prompt}
      <Prompt
        {username}
        {roomCode}
        type={message.input?.inputType}
        socket={ws}
        prompt={message.prompt}
        options={message.input?.options}
      />
    {/if}
    {#if wait}
      <StatusBox
        prompt={"It's done. You need to wait now."}
        {isHost}
        {gameStarted}
        socket={ws}
        {roomCode}
      />
    {/if}
  {/if}
</body>

<style>
</style>

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

  const ws = new WebSocket("wss://lively-paper-345.fly.dev:443", "protocolOne");

  ws.onmessage = (e) => {
    try {
      message = JSON.parse(e.data);
      console.log(message);
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
          }
        });
        prompt = true;
        wait = false;
      } else if (message.msgType == "Wait") {
        wait = true;
        prompt = false;
      } else if (message.msgType == "EndInput") {
        wait = true;
        prompt = false;
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
      <Prompt {username} {roomCode} socket={ws} prompt={message.prompt} />
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

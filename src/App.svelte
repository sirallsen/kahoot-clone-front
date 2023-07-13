<script>
  import svelteLogo from "./assets/svelte.svg";
  import Counter from "./lib/Counter.svelte";
  import JoinRoom from "./lib/JoinRoom.svelte";
  import Prompt from "./lib/Prompt.svelte";
  import StatusBox from "./lib/StatusBox.svelte";
  import Result from "./lib/Result.svelte";

  let connected = false;
  let prompt = false;
  let wait = true;
  let gameStarted = false;
  let gameOver = false;
  let currentQuestion = -1;
  let username;
  let roomCode;
  let intervalID;
  let isHost = false;
  let timer = 10;

  let message = {};

  // const ws = new WebSocket("wss://lively-paper-345.fly.dev:443", "protocolOne");
  const ws = new WebSocket("ws://localhost:8080", "protocolOne");

  ws.onmessage = (e) => {
    if(gameOver)
      return;

    try {
      let previousMessage = message;
      console.log(e.data);
      message = JSON.parse(e.data);
      if (message.msgType == "Connected") {
        if (message.additional != "") {
          isHost = true;
          roomCode = message.roomId;
        }
        connected = true;
        prompt = false;
        wait = true;
      } else if (message.msgType == "Create") {
        roomCode = message.roomId;
      } else if (message.msgType == "StartGame") {
        if (message.questions.length - 1 < currentQuestion + 1 && gameStarted && isHost) {
          message = previousMessage;
          gameStarted = false;
          const value = {
            msgType: "EndGame",
            roomId: roomCode,
          };

          ws.send(JSON.stringify(value).toString());

          return;
        } else {
          gameStarted = true;
          starTimer();
          wait = false;
          prompt = true;
          currentQuestion++;
        }
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

        const value = {
          msgType: "StartGame",
          roomId: roomCode,
          questions: message.questions,
        };

        ws.send(JSON.stringify(value).toString());
      } else if (message.msgType == "Handshake") {
        message = previousMessage;
      } else if (message.msgType == "Scores") {
        clearInterval(intervalID);
        gameOver = true;
        prompt = false;
        wait = false;
      } else {
        message = previousMessage;
      }
    } catch (error) {
      alert(e.data);
    }
  };

  function endInput() {
    if(gameOver)
      return;

    timer = 10;

    const value = {
      msgType: "EndInput",
      questions: message.questions,
      roomId: roomCode,
    };

    ws.send(JSON.stringify(value).toString());
  }

  function decrementTimer() {
    timer--;
    if (timer === 0) {
      endInput();
      return;
    }
  }

  function starTimer() {
    clearInterval(intervalID);
    if (isHost) {
      intervalID = setInterval(() => {
        decrementTimer();
      }, 1000);
    }
  }
</script>

<body>
  {#if !connected}
    <JoinRoom bind:username bind:roomCode socket={ws} />
  {/if}

  {#if connected}
    {#if prompt && gameStarted}
      <Prompt
        {username}
        {roomCode}
        {timer}
        {isHost}
        socket={ws}
        questions={message.questions}
        prompt={message.questions[currentQuestion].question}
        options={message.questions[currentQuestion].answers}
      />
    {/if}
    {#if wait}
      <StatusBox
        prompt={"Agora é só esperar"}
        {isHost}
        {gameStarted}
        socket={ws}
        {roomCode}
      />
    {/if}
    {#if gameOver}
      <Result players={message.players} />
    {/if}
  {/if}
</body>

<style>
</style>

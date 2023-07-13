<script>
  export let prompt = "";
  export let isHost = false;
  export let gameStarted;

  export let roomCode;
  export let socket;

  let questions = [];

  function addQuestion() {
    questions = [
      ...questions,
      {
        id: questions.length,
        question: "",
        answers: [
          { answer: "", correctAnswer: true },
          { answer: "", correctAnswer: false },
          { answer: "", correctAnswer: false },
          { answer: "", correctAnswer: false },
        ],
      },
    ];
  }

  function deleteQuestion(index) {
    questions = questions.filter((_, i) => i !== index);
  }

  function StartGame() {
    const value = {
      msgType: "StartGame",
      roomId: roomCode,
      questions: questions
    };

    socket.send(JSON.stringify(value).toString());
  }
</script>

<section>
  <div class="bigger-card-body content-container ">
    <div class="card">
      <div class="card-content">
        {#if !isHost || gameStarted}
          <div class="content"><p class="title">{prompt}</p></div>
        {:else}
          <div class="content">
            <h3 class="has-text-centered label">
              {roomCode}
            </h3>
            <p class="has-text-centered">
              {"Você é o dono da sala. Comece o jogo quando terminar de configurar as perguntas e todos tiverem conectado!"}
            </p>

            <h1 class="title">Perguntas</h1>

            {#each questions as question (question.id)}
              <div class="question">
                <div class="field">
                  <div class="control">
                    <input
                      class="input"
                      type="text"
                      bind:value={question.question}
                      placeholder="Escreva sua pergunta"
                    />
                  </div>
                </div>

                <label class="label">Respostas:</label>
                {#each question.answers as answer, answerIndex (answerIndex)}
                  <div class="field">
                    <div class="columns">
                      <div class="column is-10">
                        <div class="control">
                          <input
                            class="input"
                            type="text"
                            bind:value={answer.answer}
                            placeholder="Insira sua resposta"
                          />
                        </div>
                      </div>
                      <div class="column is-2">
                        <label class="checkbox">
                          <input
                            type="checkbox"
                            bind:checked={answer.correctAnswer}
                          />
                          Correta
                        </label>
                      </div>
                    </div>
                  </div>
                {/each}

                <div class="field">
                  <div class="control">
                    <button
                      class="button is-danger delete-button"
                      on:click={() => deleteQuestion(question.id)}
                    >
                      Deletar
                    </button>
                  </div>
                </div>
              </div>
            {/each}

            <div class="field">
              <div class="control">
                <button
                  class="button is-primary is-fullwidth"
                  on:click={addQuestion}
                >
                  Adicionar pergunta
                </button>
              </div>
            </div>
          </div>
        {/if}
      </div>
      <footer class="card-footer">
        <div class="card-footer-item">
          <p class="has-text-centered">
            {#if !isHost || gameStarted}
              Fique de olho na tela do jogo e aguarde!
            {:else}
              <button
                class="button is-primary"
                style="width: 100%;"
                on:click={StartGame}>INICIAR O JOGO</button
              >
            {/if}
          </p>
        </div>
      </footer>
    </div>
  </div>
</section>

<style>
  .title {
    text-align: center;
    margin: 20px 10px;
    white-space: pre-line;
  }

  .question {
    margin-bottom: 1rem;
  }

  .content-container {
    max-width: 100%;
    max-height: 100%;
    overflow-y: auto;
    padding: 2rem;
  }
</style>

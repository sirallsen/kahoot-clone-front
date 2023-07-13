<script>
  import { fade } from "svelte/transition";
  export let players;
</script>

<section transition:fade>
  <body class="card-body">
    <div class="card">
      <div class="card-content">
        <div class="content">
          <div class="container">
            <h1>Ranking</h1>
            {#each Object.entries(players) as [username, score]}
              <div class="player">
                <div class="username">{username}</div>
                <div class="bar" style="width: {score * 10}px;"></div>
                <div class="score">{score}</div>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </body>
</section>

<style>
  .bar {
    background-color: #00d1b2;
    height: 20px;
    transition: width 0.3s;
  }

  .player {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }

  .username {
    margin-right: 10px;
  }

  .score {
    margin-left: 10px;
  }
</style>

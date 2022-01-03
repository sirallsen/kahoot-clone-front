<template>
  <q-page v-if="this.onGameScreen && this.acceptingInput == true" class="flex flex-center" style="flex-direction: column">
    <Prompt :gameType="this.gameType" :round="this.roundFormat" :playerID="this.id" :currentRound="this.currentRound"></Prompt>
  </q-page>
  <q-page v-if="this.onCode" class="flex flex-center" style="flex-direction: column">
    <q-card style="border-radius: 30px; padding: 20px 50px" bordered flat>
        <q-card-section class="flex flex-center" style="flex-direction: column">
          <div class="text-h5 text-weight-medium">Game Code</div>
          <q-input input-class="text-center text-weight-bold" counter hint="6-Letter Code" maxlength="6" style="font-size: 22px; width: 200px" mask="XXXXXX" v-model="roomCode" type="text" outlined class="q-my-md" rounded/>
          <div class="text-h5 text-weight-medium">Player Name <q-btn color="primary" class="q-ml-sm" style="border-radius: 100%; height: 35px; width: 40px" icon="casino" @click="randomName"/></div>
          <q-input input-class="text-center text-weight-bold" counter style="font-size: 22px; width: 200px" v-model="username" maxlength="12" type="text" outlined class="q-my-md" rounded/>
          <q-btn color="primary" style="font-size: 25px" rounded label="JOIN GAME" :disable="roomCode.length !== 6 || username.length < 1" padding="10px 50px" @click="tryJoinRoom"/>
        </q-card-section>
      </q-card>
      <div class="q-mt-md q-pa-md bg-grey-3 text-grey-8" style="border-radius: 50px; font-size: 12px">By clicking <b>JOIN GAME</b>, you agree to our <a href="">Terms of Service</a></div>
  </q-page>
  <q-page v-if="this.onStartScreen" class="flex flex-center" style="flex-direction: column">
    <div v-if="this.id == 0" class="q-mb-md q-mx-md q-pa-md bg-grey-3 text-grey-8" style="border-radius: 50px; font-size: 20px; text-align:center">You're the <b>Host</b>! Start the game when everyone connects!</div>
    <div v-if="this.id != 0" class="q-mb-md q-pa-md bg-grey-3 text-grey-8" style="border-radius: 50px; font-size: 20px">You're <b>Player {{this.id + 1}}</b>! Wait for the host to start the game!</div>
    <q-card v-if="this.id == 0" style="border-radius: 30px; padding: 20px 50px" bordered flat>
        <q-card-section class="flex flex-center" style="flex-direction: column">
          <q-btn color="primary" style="font-size: 25px" rounded label="START GAME" padding="10px 50px" @click="startRoom"/>
        </q-card-section>
      </q-card>
  </q-page>
  <q-page v-if="this.acceptingInput == false && this.onStartScreen == false && this.onCode == false" class="flex flex-center" style="flex-direction: column">
   <q-spinner-cube
      color="primary"
      size="4em"
      class="q-mb-md"
    />
    <div class="q-mb-md q-pa-md bg-grey-3 text-grey-8" style="border-radius: 50px; font-size: 20px">Nothing to see here now. Pay attention the screen!</div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { mapActions, mapMutations, mapState } from 'vuex';
var nicknames = require('nicknames')
import { Notify } from 'quasar'
import Prompt from 'components/Prompt.vue'

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default defineComponent({
  name: 'PageIndex',
  components:
  {
    Prompt
  },
  methods: {
    ...mapActions('api',[
      'joinRoom',
      "checkRoomStatus",
      "startGame",
      "getRoomFormat"
    ]),
    randomName()
    {
      let name = nicknames.allRandom() + nicknames.allRandom()
      while(name.length > 12)
        name = nicknames.allRandom() + nicknames.allRandom()
        
      this.username = name
    },
    playerPositionCheck(playersList)
    {
      playersList.forEach(player => {
        if(player.username === this.username)
        {
          this.id = player.id
          this.onCode = false;
          this.onStartScreen = true;
        }
      });
    },
    async tryJoinRoom()
    {
      const response = await this.joinRoom({code: this.roomCode, username: this.username})
      if(response.status !== 201)
      {
        Notify.create(
        {
          message: response.data.message,
          position: 'top',
          color: 'negative'
        });
      }
      else
      {
        Notify.create(
        {
          message: 'Success!',
          position: 'top',
          color: 'primary'
        });

        this.gameType = response.data.room.gameType

        this.playerPositionCheck(response.data.room.players);
        this.checkStatus();
      }
    },
    async startRoom()
    {
      await this.startGame({code: this.roomCode});
    },
    async checkStatus()
    {
      await timeout(5000);
      let response = await this.checkRoomStatus({code: this.roomCode})
      if(!response.data.started)
      {
        //do nothing
      }
      else
      {
        this.onStartScreen = false;
        this.acceptingInput = response.data.acceptingInput;
        
        if(this.currentRound != response.data.currentRound)
        {
          this.currentRound = response.data.currentRound
          let room = await this.getRoomFormat({code: this.roomCode, round: this.currentRound});
          room.data.round.forEach(round => {
            if(round.id === this.id)
            {
              this.roundFormat = round;
              this.onGameScreen = true;
            }
          });
        }
      }
      this.checkStatus()
    }
  },
  data () {
    return {
      roomCode: "",
      username: "",
      gameType: "Mimic",
      id: -1,
      currentRound: 0,
      roundFormat: null,
      onCode: true,
      onStartScreen: false,
      onGameScreen: false,
      acceptingInput: false
    }
  },
})
</script>

<style >
.q-btn.disabled
{
  background: grey !important;
  opacity: 0.2 !important;
}
body
{
  font-family: 'Grandstander', cursive;
  font-weight: 700;
}
div {
  word-wrap: break-word;
  white-space: pre-wrap;
  text-align: center;
}

img
{
  margin-top: -50px;
  width: 100%;
}
</style>

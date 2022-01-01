<template>
    <div v-if="sent">
        <div class="q-mb-md q-pa-md bg-grey-3 text-grey-8" style="border-radius: 50px; font-size: 20px; text-align: center;">Well done. I really hope you're happy with what you did...</div>
    </div>
    <div v-if="!sent">
        <div class="q-mb-md q-pa-md bg-grey-3 text-grey-8" style="border-radius: 50px; font-size: 20px; text-align: center;">{{this.roundText()}}</div>
        <q-card :hidden="this.round.type == 'action' || this.round.type == 'info'" style="border-radius: 30px; padding: 0 20px; " bordered flat>
        <q-card-section class="flex flex-center" style="flex-direction: column">
            <div class="flex flex-center" style="flex-direction: column" v-if="this.round.type == 'input'">
                <div style="border-radius: 50px; font-size: 40px">{{this.roundPrompt()}}</div>
                <q-input input-class="text-center text-weight-bold" counter maxlength="40" autogrow style="font-size: 22px; line-heigth: 15px" v-model="input" type="text" outlined class="q-my-md" rounded/>
                <q-btn color="primary" style="font-size: 25px" rounded label="SEND" padding="10px 50px" @click="this.sent = true"/>
            </div>
            <div class="flex flex-center q-my-md" style="flex-direction: column" v-if="this.round.type == 'vote'">
                <q-list class="q-mb-md">
                    <q-item tag="label" v-for="opt in this.round.options" :key="opt.id">
                        <q-item-section side top>
                            <q-checkbox v-model="this.marked[opt.id]" :toggle-indeterminate="false"/>
                        </q-item-section>
                        <q-item-section>
                        <q-item-label caption style="font-size: 18px">
                            {{ opt.value }}
                        </q-item-label>
                        </q-item-section>
                    </q-item>
                </q-list>
                <q-btn color="primary" style="font-size: 25px" rounded label="SEND" padding="10px 50px" @click="this.sent = true"/>
            </div>
        </q-card-section>
    </q-card>
    </div>
   
</template>

<script>
import { defineComponent } from 'vue'
import { mapActions } from 'vuex';

export default defineComponent({
  name: 'Prompt',
  props: {
    gameType: String,
    round: Object,
    playerID: String,
    currentRound: String
  },
  watch:
  {
      round()
      {
        this.sent = false
      }
  },
  methods:
  {
      ...mapActions('api',[
      'sendPlayerAnswer',
    ]),
      roundText()
      {
        if(this.round == null)
        {
            return "Okay... Nothing you need to do now."
        }
        if(this.round.type === "input")
        {
            if(this.gameType === "Mimic")
            {
                return "Write a mimic prompt about a..."
            }
        }
        else if(this.round.type === "action")
        {
            if(this.gameType === "Mimic")
            {
                return "You've received your mimic prompt. Do your show!"
            }
        }
        else if(this.round.type === "info")
        {
            if(this.gameType === "Mimic")
            {
                return "Okay... Nothing you need to do now."
            }
        }
        else if(this.round.type === "vote")
        {
            if(this.gameType === "Mimic")
            {
                return "Vote for the real prompt!"
            }
        }
    },
    roundPrompt()
    {
        return this.round.prompt;
    },
    async send()
    {
        let response = await this.sendPlayerAnswer({code: this.roomCode, playerID: this.playerID, round: this.currentRound});
        this.sent = true
    }
  },
   data () {
    return {
        input: '',
        marked: [false,false,false,false,false,false,false,false,false,false,false,false,false,false,],
        sent: false
    }
    }
})
</script>

<template>
    <div style="margin: 0 5%">
        <div v-if="sent">
            <div class="q-mb-md q-pa-md bg-grey-3 text-grey-8" style="border-radius: 50px; font-size: 20px; text-align: center;">You sent it. There's no turning back now.</div>
        </div>
        <div v-if="!sent">
            <div class="q-mb-md q-pa-md bg-grey-3 text-grey-8" style="border-radius: 50px; font-size: 20px; text-align: center;">{{this.round.prompt}}</div>
            <q-card-section class="flex justify-center">
                <img :hidden="this.round.additional !== 'rogue'" src="~assets/knight-out-cards/rogue.png">
                <img :hidden="this.round.additional !== 'oracle'" src="~assets/knight-out-cards/oracle.png">
                <img :hidden="this.round.additional !== 'inquisitor'" src="~assets/knight-out-cards/inquisitor.png">
                <img :hidden="this.round.additional !== 'lackey'" src="~assets/knight-out-cards/lackey.png">
                <img :hidden="this.round.additional !== 'fairy'" src="~assets/knight-out-cards/fairy.png">
                <img :hidden="this.round.additional !== 'accursed'" src="~assets/knight-out-cards/accursed.png">
                <img :hidden="this.round.additional !== 'jester'" src="~assets/knight-out-cards/jester.png">
                <img :hidden="this.round.additional !== 'paladin'" src="~assets/knight-out-cards/paladin.png">
                <img :hidden="this.round.additional !== 'villager'" src="~assets/knight-out-cards/villager.png">
                <img :hidden="this.round.additional !== 'king'" src="~assets/knight-out-cards/king.png">
            </q-card-section>
            <q-card :hidden="this.round.type == 'info'" style="border-radius: 30px; padding: 0 20px; " bordered flat>
                <q-card-section class="flex flex-center q-pa-none" style="flex-direction: column">
                    <div class="flex flex-center" style="flex-direction: column" v-if="this.round.type == 'input'">
                        <q-input input-class="text-center text-weight-bold" counter maxlength="40" autogrow style="font-size: 22px; line-heigth: 15px" v-model="input" type="text" outlined class="q-my-md" rounded/>
                        <q-btn color="primary" style="font-size: 25px" rounded label="SEND" padding="10px 50px" @click="this.sent = true"/>
                    </div>
                    <div class="flex flex-center q-my-md" style="flex-direction: column" v-if="this.round.type == 'vote'">
                        <div class="q-pa-md q-pb-lg" style="text-align: left;">
                            <q-option-group
                            v-model="group"
                            :options="this.round.options"
                            color="primary"
                            size="md"
                            style="font-size: 18px"
                            />
                        </div>
                        <q-btn color="primary" style="font-size: 25px" rounded label="SEND" padding="10px 50px" @click="this.sent = true"/>
                    </div>
                </q-card-section>
            </q-card>
        </div>
    </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { mapActions } from 'vuex';

export default defineComponent({
  name: 'Prompt',
  props: {
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
    },
    setup () {
        return {
        group: ref('op1')
        }
    }
})
</script>

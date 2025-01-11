<template>
  <body>
  <!--<div>
    {{pollId}}
    <div v-if="!joined">
      <input type="text" v-model="userName">
      <button v-on:click="participateInPoll">
        {{ this.uiLabels.participateInPoll }}
      </button>
    </div>-->
    <!--<div v-if="joined">
      <p>{{ uiLabels.waitingForHost }}</p>
      {{ participants }}
  </div>-->


  <div>
  <h1>{{ uiLabels.participateInPoll }}</h1>
  <p>{{ uiLabels.enterName }}</p>
  <input type="text" class="usernameBox" v-model="userName">
  <br>
  <p>{{ uiLabels.participateDescription }}</p>
  <div class="poll-id-container">
  <!--<input type="text" v-model="pollId" placeholder="Enter poll ID">-->
  <input type="text" maxlength="1" class="poll-id-box" id="box1" v-model="boxes[0]" @input="moveFocus(1)" @keydown="handleBackspace($event, 1)">
  <input type="text" maxlength="1" class="poll-id-box" id="box2" v-model="boxes[1]" @input="moveFocus(2)" @keydown="handleBackspace($event, 2)">
  <input type="text" maxlength="1" class="poll-id-box" id="box3" v-model="boxes[2]" @input="moveFocus(3)" @keydown="handleBackspace($event, 3)">
  <input type="text" maxlength="1" class="poll-id-box" id="box4" v-model="boxes[3]" @input="combinePollId()" @keydown="handleBackspace($event, 4)">

  </div>
  <br>
  <button v-on:click="participateInPoll">
    {{ uiLabels.participateInPoll }}
  </button>
</div>
</body>
</template>

<script>
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("currentNetwork"));

export default {
  name: 'PreLobby',
  data: function () {
    return {
      userName: "",
      pollId: "inactive poll",
      boxes: ["", "", "", ""],
      uiLabels: {},
      joined: false,
      lang: localStorage.getItem("lang") || "en",
      participants: []
    }
  },
  created: function () {
    this.pollId = this.$route.params.id;
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.on( "startPoll", () => this.$router.push("/poll/" + this.pollId) );
    socket.emit( "joinPoll", this.pollId );
    socket.emit( "getUILabels", this.lang );
    socket.on('participantsUpdate', (p) => {
      console.log("mottagna deltagare:", p);
      this.participants = p; });
  },



  methods: {

    moveFocus(currentBox) {
      const currentInput = document.getElementById(`box${currentBox}`);
      const nextInput = document.getElementById(`box${currentBox + 1}`);
      const prevInput = document.getElementById(`box${currentBox - 1}`);
      if (currentInput.value.length === 1 && nextInput) {
        nextInput.focus();
      }
    },

    handleBackspace(event, currentBox) {
      const currentInput = document.getElementById(`box${currentBox}`);
      const prevInput = document.getElementById(`box${currentBox - 1}`);
      if (event.key === "Backspace") {
          if (currentInput.value === "" && prevInput) {
              prevInput.focus();
          } else {
            currentInput.value = "";
            this.boxes[currentBox - 1] = ""; 
          }
        }
    },

    combinePollId() {
      this.pollId = this.boxes.join("");
    },

    participateInPoll: function () {
      if(this.pollId.length === 4 && !this.participants.some(participant => participant.name === this.userName)) {
        localStorage.setItem( "participantName", this.userName)
        socket.emit( "participateInPoll", {pollId: this.pollId, name: this.userName} )
        this.$router.push("/lobby/" + this.pollId);
      }
    }
  }
}
</script>

<style scoped>
body{
  height:100%;
  min-height: 100vh;
  background: linear-gradient(5deg, #eaca49, #eae2af);
}
h1{
  margin: 0px 0px 40px 0px;
  padding: 90px 0 20px;
  font-size: 55px;
  color: rgb(75, 76, 76);
}
h1, p{
  font-family: 'Futura';
  color: rgb(75, 76, 76);
  margin-bottom: 20px;
}
p {
  font-size: 20px;
}

.usernameBox{
  height: 30px;
  width: 130px;
  border-radius: 8px;
  margin-bottom: 40px;
}
.poll-id-container {
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
  margin: 20px 0 10px;
}
.poll-id-box{
  width: 60px;
  height: 80px;
  font-size: 2rem;
  text-align: center;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0red, 0green, 0blue, 0.2alpha);
}
.poll-id-box:focus{
  outline: 1px solid
}

button{
  height: 60px;
  width: 150px;
  border-radius: 8px;
  font-family: 'Futura';
  font-size: 15px;
  background: linear-gradient(5deg, #63b65f, #bcedbe);
  margin-top: 30px;
}

</style>

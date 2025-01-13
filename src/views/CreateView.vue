<template>
  <div class="container">
    <div class="destination">
      <div class="destination-buttons" id="chooseDestination">
        <button type="button" v-on:click="goToChooseDestination">
          {{ uiLabels.chooseDestination }}
        </button>
      </div>
      <div class="destination-buttons" id="randomDestination">
        <button type="button" v-on:click="goToRandomDestination ">
          {{ uiLabels.randomDestination }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("currentNetwork"));


export default {
  name: 'CreateView',
  data: function () {
    return {
      lang: localStorage.getItem("lang") || "en",
      pollId: "",
      question: "",
      answers: ["", ""],
      questionNumber: 0,
      pollData: {},
      uiLabels: {},
    }
  },

  created: function () {
    this.pollId = this.$route.params.id;

    socket.on( "uiLabels", labels => this.uiLabels = labels );

    socket.on( "pollData", data => this.pollData = data );
    
    socket.on( "participantsUpdate", p => this.pollData.participants = p );
    
    socket.emit( "getUILabels", this.lang );
  },

  methods: {
    createPoll: function () { 
      socket.emit("createPoll", {pollId: this.pollId, lang: this.lang })
      socket.emit("joinPoll", this.pollId);
    },

    startPoll: function () {
      socket.emit("startPoll", this.pollId)
    },

    addQuestion: function () {
      socket.emit("addQuestion", {pollId: this.pollId, q: this.question, a: this.answers } )
    },

    addAnswer: function () {
      this.answers.push("");
    },

    runQuestion: function () {
      socket.emit("runQuestion", {pollId: this.pollId, questionNumber: this.questionNumber})
    },

    goToChooseDestination() {
      console.log(this.pollId)
      this.$router.push("/choose-destination/" + this.pollId);
    },

    goToRandomDestination() {
      this.$router.push("/random-destination/" + this.pollId);
    },
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Agbalumo&family=Cormorant:wght@700&display=swap');

  .container {
    display: flex;
    flex-direction: column; 
    justify-content: center; 
    align-items: center; 
    height: 100vh; 
    background: linear-gradient(to right, #d1e7ff, #d3bdf3); 
    background-size: cover; 
    background-repeat: no-repeat; 
  }

  .destination {
    display: flex; 
    flex-wrap: wrap;
    gap: 50px; 
    justify-content: center;
    align-items: center;
  }
  .destination-buttons button {
    display: flex;
    justify-content: center;
    align-items: center; 
    width: 100%; 
    max-width: 350px;
    max-height: 300px;
    aspect-ratio: 1; 
    border-radius: 70px; 
    cursor: pointer; 
    transition: transform 0.2s, background-color 0.2s; 
    font-family: 'Futura', sans-serif;
    font-size: 25px;
    text-align: center; 
    line-height: 1; 
    padding: 10px; 
    overflow: hidden; 
    white-space: nowrap; 
  }
  #chooseDestination button{
    background: linear-gradient(5deg, #50aee5, #bce2ed);
    color: rgb(0, 48, 3); 
    border: 2px solid #006caf; 
  }
  #randomDestination button {
    background: linear-gradient(5deg, #63b65f, #bcedbe);
    color: rgb(78, 0, 0); 
    border: 2px solid #00720f; 
  }
  .destination-buttons button:hover {
    transform: scale(1.1); 
    background-color: #7a42aa; 
  }
  button font{
    padding: 0px;
    margin: 0px;
  }
</style>

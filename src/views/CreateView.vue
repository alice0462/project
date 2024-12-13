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
   <!-- 
    Poll link: 
    <input type="text" v-model="pollId">
    <button v-on:click="createPoll">
      Create poll
    </button>
    <div>
      {{ uiLabels.question }}:
      <input type="text" v-model="question">
      <div>
        Answers:
        <input v-for="(_, i) in answers" 
               v-model="answers[i]" 
               v-bind:key="'answer' + i">
        <button v-on:click="addAnswer">
          Add answer alternative
        </button>
      </div>
    </div>
    <button v-on:click="addQuestion">
      Add question
    </button>
    <input type="number" v-model="questionNumber">
    <button v-on:click="startPoll">
      Start poll
    </button>
    <button v-on:click="runQuestion">
      Run question
    </button>
    <router-link v-bind:to="'/result/' + pollId">Check result</router-link>
    Data: {{ pollData }} -->
  </div>
</template>

<script>
import io from 'socket.io-client';
import RandomDestination from '../components/RandomDestination.vue';
const socket = io("localhost:3000");

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
  flex-direction: column; /* Låter barnen staplas vertikalt */
  justify-content: center; /* Centrerar innehåll vertikalt */
  align-items: center; /* Centrerar innehåll horisontellt */
  height: 100vh; /* Full höjd på sidan */
  background: linear-gradient(to right, #d1e7ff, #d3bdf3); /* Bakgrundsgradient */
  background-size: cover; /* Se till att gradienten täcker hela skärmen */
  background-repeat: no-repeat; /* Förhindrar upprepning av gradienten */
}

.destination {
  display: flex; /* Gör att elementen placeras horisontellt */
  gap: 80px; /* Lägger mellanrum mellan rutorna */
}

.destination-buttons button {
  width: 400px; 
  height: 400px; 
  border-radius: 70px; 
  cursor: pointer; 
  transition: transform 0.2s, background-color 0.2s; 
  font-family: 'Futura', sans-serif;
  font-size: 30px;
  justify-content: center; 
  align-items: center;
  text-align: center;
  line-height: normal;
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
  transform: scale(1.1); /* Gör knappen större vid hovring */
  background-color: #7a42aa; /* Ändrar bakgrundsfärgen vid hovring */
}

button font{
  padding: 0px;
  margin: 0px;
}

</style>

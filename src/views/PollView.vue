<template>
  <div class="landing-page">
    <!-- Bakgrundsbild -->
    <div class="background-image">
      <h1>DESTINATION UNKNOWN</h1>
    </div>
  </div>
  <!--<div>
    {{pollId}}
    <QuestionComponent v-bind:question="question"
              v-on:answer="submitAnswer($event)"/>
    <hr>
    <span>{{submittedAnswers}}</span>
  </div>-->
</template>

<script>
/*
// @ is an alias to /src
import QuestionComponent from '@/components/QuestionComponent.vue';
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'PollView',
  components: {
    QuestionComponent
  },
  data: function () {
    return {
      question: {
        q: "",
        a: []
      },
      pollId: "inactive poll",
      submittedAnswers: {}
    }
  },
  created: function () {
    this.pollId = this.$route.params.id;
    socket.on( "questionUpdate", q => this.question = q );
    socket.on( "submittedAnswersUpdate", answers => this.submittedAnswers = answers );
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.emit( "getUILabels", this.lang );
    socket.emit( "joinPoll", this.pollId );
  },
  methods: {
    submitAnswer: function (answer) {
      socket.emit("submitAnswer", {pollId: this.pollId, answer: answer})
    }
  }
}*/
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@400;700&display=swap');

.landing-page {
  height: 100vh; /* Full höjd */
  width: 100%; /* Full bredd */
  display: flex;
  justify-content: center; /* Centrera horisontellt */
  align-items: center; /* Centrera vertikalt */
  overflow: hidden; /* Undvik scroll */
}

.background-image {
  background-image: url('https://www.airfaregeeks.com.au/wp-content/uploads/2022/01/Banner-Travel-the-world.jpeg'); /* Byt till korrekt bild */
  background-size: cover; /* Fyll hela utrymmet */
  background-position: center; /* Centrera bilden */
  height: 100%; /* Full höjd */
  width: 100%; /* Full bredd */
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

h1 {
  font-family: 'Exo 2'; 
  font-size: 5rem; /* Stor text */
  font-weight: bold;
  color: rgb(0, 0, 0);
  text-shadow: 2px 2px 10px rgba(124, 178, 255, 0.7); /* Lägg till skugga */
  text-align: center;
  z-index: 2; /* Se till att texten visas ovanpå */
}
</style>


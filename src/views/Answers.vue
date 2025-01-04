<template>
  <body>
    <div v-if="answers.length > 0">
      <h1>Godkänn eller Neka svar</h1>
      <div v-for="(answer, index) in answers" :key="index" class="answer-box">
        <p><strong>Namn:</strong> {{ answer.name }} 
          <strong>Gissning:</strong> {{ answer.guess }}
          <strong>Poäng:</strong> {{ answer.points }}</p>
      <div class="buttons">
        <button class="approve-btn" @click="approveAnswer(index)">Godkänn</button>
        <button class="reject-btn" @click="rejectAnswer(index)">Neka</button>
      </div>
    </div>
    </div>
    <div v-else>
      <h2>Alla svar har granskats!</h2>
    </div>
      <button class="questionButton" @click="goToQuestions">Gå vidare till frågorna om staden</button>
  </body>
</template>

<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");


//HALLOJI STUGAN
export default {
    name: "Answers",
    data: function () {
        return {
            pollId: "",
            uiLabels: {},
            lang: localStorage.getItem("lang") || "en",
            participants: [],
            selectedLevel: "",
            selectedCities: [],
            role: localStorage.getItem("role"), //Hämtar den tilldelade rollen som bestäms startView
            answers: []
        }
    },
    created: function () {
    this.pollId = this.$route.params.id;
    console.log("hejhej")
    
    socket.on("submittedAnswersUpdate", (answers) => {
      console.log("hejsvejs")
      console.log("inkommande svar:", answers);
      this.answers = answers;
      
      /*if (answers.length > 0) {
        this.currentAnswer = answers[0];
        console.log(this.currentAnswer);
      } else {
        this.currentAnswer = null;
      }*/
    });
    socket.emit("joinPoll", this.pollId);
    
    // Begär befintliga svar för denna omröstning
    socket.emit("getSubmittedAnswers", this.pollId);
  },
  methods: {
    approveAnswer(index) {
      //if (this.currentAnswer) {
        const answer = this.answers[index]
        // Logik för att godkänna svaret
        console.log("Godkände svar:", answer);
        socket.emit("approveAnswer", {
          pollId: this.pollId,
          answer: this.answer,
        });

        // Uppdatera visningen
        this.currentAnswer = null;
      },

    rejectAnswer(index) {
      //if (this.currentAnswer) {
        const answer = this.answers[index]
        // Logik för att neka svaret
        console.log("Nekade svar:", answer);
        socket.emit("rejectAnswer", {
          pollId: this.pollId,
          answer: this.answer,
        });

        // Uppdatera visningen
        this.currentAnswer = null;
      },
      goToQuestions() {
        socket.emit("startQuestions", this.pollId);
      }
    },
  }
  //},
//}
  



</script>

<style scoped>
body {
    background: linear-gradient(to right, #d1e7ff, #d3bdf3);
    height:100%;
    min-height: 100vh;
    }
</style>

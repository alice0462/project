<template>
  <body>
    <div v-if="currentAnswer">
      <h1>Godkänn eller Neka svar</h1>
      <div class="answer-box">
        <p>{{ currentAnswer.text }}</p>
      </div>
      <div class="buttons">
        <button class="approve-btn" @click="approveAnswer">Godkänn</button>
        <button class="reject-btn" @click="rejectAnswer">Neka</button>
      </div>
    </div>
    <div v-else>
      <h2>Alla svar har granskats!</h2>
    </div>
  </body>
</template>

<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");

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
            currentAnswer: null
        }
    },
    created: function () {
    this.pollId = this.$route.params.id;
    console.log("hejhej")
    
    socket.on("submittedAnswersUpdate", (answers) => {
      console.log("hejhej")
      if (answers.length > 0) {
        this.currentAnswer = answers[0];
      } else {
        this.currentAnswer = null;
      }
    });
    

    // Begär befintliga svar för denna omröstning
    socket.emit("getSubmittedAnswers", this.pollId);
  },
  methods: {
    approveAnswer() {
      if (this.currentAnswer) {
        // Logik för att godkänna svaret
        console.log("Godkände svar:", this.currentAnswer);
        socket.emit("approveAnswer", {
          pollId: this.pollId,
          answer: this.currentAnswer,
        });

        // Uppdatera visningen
        this.currentAnswer = null;
      }
    },
    rejectAnswer() {
      if (this.currentAnswer) {
        // Logik för att neka svaret
        console.log("Nekade svar:", this.currentAnswer);
        socket.emit("rejectAnswer", {
          pollId: this.pollId,
          answer: this.currentAnswer,
        });

        // Uppdatera visningen
        this.currentAnswer = null;
      }
    },
  },
}
  



</script>

<style scoped>
body {
    background: linear-gradient(to right, #d1e7ff, #d3bdf3);
    height:100%;
    min-height: 100vh;
    }
</style>

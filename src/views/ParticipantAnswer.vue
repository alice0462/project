<template>
<body>
    <button type="button" class="answer-button" @click="submitAnswer = true">
        <img 
            src="/public/nodbroms.png"
            style="width: 798px; height:564px;"
        />
    </button>
    <div v-if="submitAnswer && !finalAnswer" class="writeAnswer">
      <div class="writeAnswerContent">
        <h2> Vart tror du att vi är på väg?</h2>
        <br>
        <input type="text" class="answerText" v-model="answerDestination" placeholder="Skriv destinationen här..."/>
        <button v-on:click="submitDestination" class="submitDestinationButton">Lås in ditt svar</button>
      </div>
    </div>
    <div v-if="finalAnswer" class="writeAnswer">
      <div class="writeAnswerContent">
        <h2>Ditt svar är nu låst!</h2>
        <p>Du har nu låst in svaret:</p>
        <p class="lockedAnswer"> {{ finalAnswer }}</p>
      </div>
    </div>
</body>
</template>

<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'ParticipantAnswer',
  data: function () {
    return {
      uiLabels: {},
      submitAnswer: false,
      answerDestination: "",
      finalAnswer: null,
      pollId:"",
      lang: localStorage.getItem( "lang") || "en",
      user: localStorage.getItem( "participantName") || "unknownParticipant",
    }
  },
  created: function () {
    this.pollId = this.$route.params.id;
    console.log("Användarnamn från sessionStorage:", this.user); // Loggar användarnamnet här
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.emit( "getUILabels", this.lang );
    socket.emit("joinPoll", this.pollId);
    socket.emit("getCurrentParticipant", (data) => {
      this.participantName=data.name;
    });
  },
  methods: {
    submitDestination(){
      if(this.answerDestination === "") {
        alert("Du måste skriva in ett svar innan du kan låsa in det!")
      } else {
        this.finalAnswer = this.answerDestination;
        this.submitAnswer = false;
        console.log("Svaret är låst:", this.finalAnswer);
        socket.emit("answerSubmit", {user: this.user, pollId: this.pollId, guess: this.finalAnswer })
      }
      console.log("Svar skickat:", {user: this.user, pollId: this.pollId, guess: this.finalAnswer});
    },
  },
  };
</script>

<style scoped>
    body{
        height:100%;
        min-height: 100vh;
        background: linear-gradient(5deg, #eaca49, #eae2af);
    }
    button{
        border:none;
        background: none;
        cursor: pointer;
    }

    .writeAnswer {
      position: fixed; /* Täcker hela skärmen */
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5); /* Halvgenomskinlig bakgrund */
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1;
      /*text-align: center;*/
    }

    .writeAnswerContent {
      background: white;
      padding: 20px;
      border-radius: 10px;
      text-align: center;
      width: 500px;
      font-family: 'Futura';
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .answerText {
      width: 100%;
      height: 30px;
      padding: 2px;
      margin: 15px 0;
      border: 2px solid #ccc;
      border-radius: 5px;
      font-family: 'Futura';
    }

    .submitDestinationButton {
      background: #2fc975;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: rgb(255, 255, 255);
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 20px;
      font-family: 'Futura';
    }

</style>
<template>
  <div class="level-container">
    <header>
      <h1>Välj svårighetsgrad</h1>
    </header>
    <div class="container">
      <!--<p>Dina valda destination:</p>
      <ul>
        <li v-for="(city, index) in selectedCities" :key="index">
          {{ city }}
        </li>
      </ul>-->
      <div class="level">
        <div class="level-easy">
          <button type="button" v-on:click="selectLevel">
          <h2>Lätt</h2>
          <p>Varje fråga får man tre stycken svarsalternativ</p>
      </button>
        </div>
        <div class="level-hard">
          <button type="button" v-on:click="selectLevel">
          <h2> Svår </h2>
          <p>Varje fråga ges utan svarsalternativ</p>
      </button>
        </div>
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
  import { useRoute } from 'vue-router';
  const socket = io("localhost:3000");
  
  export default {
    name: 'Level',
    setup() {
      const route = useRoute(); // Hämta router-objektet
      const selectedCities = route.query.selectedCities?.split(',') || []; // Dela upp query-parametern till en array

      return {
        selectedCities,
      };
    },
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
      selectLevel(level) {
      // Skicka svårighetsgraden som en parameter (valfritt)
      this.$router.push({ path: "/game-master-code", query: { difficulty: level } });
    },
    }
  }
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Agbalumo&family=Cormorant:wght@700&display=swap');
  
  .level-container {
    display: flex;
    align-items: center;
    flex-direction: column;
    background: linear-gradient(to right, #d1e7ff, #d3bdf3);
    background-size: cover; /* Se till att gradienten täcker hela skärmen */
    background-repeat: no-repeat; /* Förhindrar upprepning */
    margin: 0; /* Tar bort eventuell marginal */
    height: 100vh; /* Säkerställ att höjden täcker hela fönstret */
  
  h1 {
    color: rgb(47, 0, 72);
    font-size: 60pt;
    font-family: 'Futura';
    text-shadow: 2px 3px rgba(49, 0, 59, 0.7)
    }
  }
  
  
  .level {
    display: flex;
    justify-content: space-around; /* Lika mycket utrymme mellan elementen */
    max-width: 800px; /* Begränsar maxbredden */
    text-align: center;
    gap: 100px;
  }
  
  .level-easy {
    display: flex;
    flex-direction: column; /* Arrangerar "Lätt/Svår" och knappen i kolumn */
    align-items: center;
    gap: 20px; /* Skapar mellanrum mellan text och knapp */
  }
  
  .level-hard {
    display: flex;
    flex-direction: column; /* Arrangerar "Lätt/Svår" och knappen i kolumn */
    align-items: center;
    gap: 20px; /* Skapar mellanrum mellan text och knapp */
  }
  
  .level-easy button {
    width: 350px; /* Gör knappen bredare */
    height: 350px; /* Gör knappen högre */
    font-size: 18px; /* Större textstorlek */
    background: linear-gradient(5deg, #63b65f, #bcedbe);
    color: rgb(0, 48, 3); /* Vit textfärg */
    border: 2px solid #099902; /* Grön kant */
    border-radius: 8px; /* Rundade hörn */
    cursor: pointer; /* Ändrar muspekaren vid hovring */
    transition: transform 0.2s, background-color 0.2s; /* Smooth hovringseffekt */
    font-family: 'Futura';
    font-size: 26px;
    justify-content: center; /* Centrerar text horisontellt */
    align-items: center;
    text-align: center;

    h2 {
      font-weight: lighter;
    }
  }
  
  .level-hard button {
    width: 350px; /* Gör knappen bredare */
    height: 350px; /* Gör knappen högre */
    font-size: 18px; /* Större textstorlek */
    background: linear-gradient(5deg, #a30e0e, #eaafaf);
    color: rgb(78, 0, 0); /* Vit textfärg */
    border: 2px solid #a30e0e; /* Röd kant */
    border-radius: 8px; /* Rundade hörn */
    cursor: pointer; /* Ändrar muspekaren vid hovring */
    transition: transform 0.2s, background-color 0.2s; /* Smooth hovringseffekt */
    font-family: 'Futura';
    font-size: 26px;
    text-align: center;

    h2 {
      font-weight: lighter;
    }
  }
  
  .level-easy button:hover {
    transform: scale(1.1); /* Gör knappen större vid hovring */
    background-color: #7a42aa; /* Ändrar bakgrundsfärgen vid hovring */
  }
  
  .level-hard button:hover {
    transform: scale(1.1); /* Gör knappen större vid hovring */
    background-color: #7a42aa; /* Ändrar bakgrundsfärgen vid hovring */
  }
  </style>
  
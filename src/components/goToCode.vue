<template>
  <div class="ready-container">
    <header>
      <h1>{{ ready }}</h1>
    </header>
    <div class="container">
      <div class="goToCode">
        <button
          class="goToCode-btn"
          :class="{ selected: isSelected }"
          @click="invitePlayers"
        >
          {{ goToCode }}
        </button>
      </div>
    </div>
  </div>
</template>
    
<script>
  import io from 'socket.io-client';
  import { useRoute } from 'vue-router';
  const socket = io("localhost:3000");
  import gameMasterSv from '@/assets/gameMaster-sv.json';
  import gameMasterEn from '@/assets/gameMaster-en.json';

    
  export default {
    data: function () {
      return {
        name: 'goToCode',
        lang: localStorage.getItem("lang") || "en",
        pollId: "",
        question: "",
        answers: ["", ""],
        questionNumber: 0,
        pollData: {},
        uiLabels: {},
        selectToGamecode: "",
        showModal: false, 
        selectedCities: [],
        isSelected: false,
      }
    },
      
    created: function () {
      this.pollId = this.$route.params.id;
      socket.on("selectedCities", (data) => {
        console.log("Mottagna städer:", data);
          // Spara städerna i data
          this.selectedCities = data.data.cities; 
          console.log(this.selectedCities);
        });
      socket.on( "uiLabels", labels => this.uiLabels = labels );
      socket.on( "pollData", data => this.pollData = data );
      socket.on( "participantsUpdate", p => this.pollData.participants = p );
      socket.emit( "getUILabels", this.lang );
    },

    computed: {
      ready() {
        return this.lang === "sv" ? gameMasterSv.ready : gameMasterEn.ready;
      },
      goToCode(){
        return this.lang === "sv" ? gameMasterSv.goToCode : gameMasterEn.goToCode;
      }
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
      invitePlayers(){
        this.isSelected = !this.isSelected; // Toggla klassen selected
        this.selectToGamecode = this.isSelected ? this.goToCode : "";
        this.data = {name :this.name, cities :this.selectedCities, pollId: this.pollId, goToCode: this.selectToGamecode};
        
        const payload = {
          goToCode: this.selectToGamecode, // Valda nivåer
        };
        
        socket.emit("sendToGamecode", {data: payload, pollId: this.pollId});
        socket.emit("updateScreen", this.pollId); //Tillagt för att få storskärm att gå till lobby
        /*this.showModal = false;*/
        
        console.log(this.pollId);
        console.log(this.data);
        localStorage.setItem("role", "admin"); //Säkerställer att vi har kvar rollen admin (så att startaknappen finns)
        console.log(localStorage.getItem("role"));
        //lagt till
        this.$router.push("/lobby/" + this.pollId);
        },
        
      }
    }
    </script>
    
    <style scoped>
    @import url('https://fonts.googleapis.com/css2?family=Agbalumo&family=Cormorant:wght@700&display=swap');
    
    .ready-container {
      display: flex;
      align-items: center;
      flex-direction: column;
      background: linear-gradient(to right, #d1e7ff, #d3bdf3);
      background-size: cover; /* Se till att gradienten täcker hela skärmen */
      background-repeat: no-repeat; /* Förhindrar upprepning */
      margin: 0; /* Tar bort eventuell marginal */
      height: 100vh; /* Säkerställ att höjden täcker hela fönstret */
    
    header h1 {
      color: rgb(47, 0, 72);
      font-size: 60pt;
      font-family: 'Futura';
      text-shadow: 2px 3px rgba(49, 0, 59, 0.7)
      }
    }
    
    
    .goToCode {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    }


  .goToCode-btn {
    background: linear-gradient(5deg, #2d61ff, #a6c1ff); /* Röd för Svår */
    border: none;
    border-radius: 10px;
    padding: 150px 180px;
    font-size: 2em;
    font-family: 'Futura';
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .goToCode-btn:hover {
    transform: scale(1.1);
  }
    </style>
    
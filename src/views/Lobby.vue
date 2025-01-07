<template>
    <div class="lobby-container">
      <div class="lobby-info">
        <h1> {{ gameCode }}: <span class="pollId"> {{ this.pollId }} </span></h1>
        <h2> {{ participantsLabel }}:</h2>
        <!--{{ this.participants }} TROR INTE DENNA BEHÖVS FÖR VI HAR JU DEN NUMRERAD PÅ RAD 9--> 
        <!-- HÄR SKA VI KOPPLA IHOP DE NAMN SOM SKRIVS IN I PLAYERS!!!!-->
        <p v-for="(participant, index) in participants" :key="index">
              {{ participant.name }}</p>
      </div>
      <div class="game-visual">
        <img src="https://www.wallquotes.com/sites/default/files/kids0017-18.png" 
        alt="All Aboard!" class="train-image" />
        <button v-if="role === 'admin'" class="start-button" @click="startGame">{{letsGo}}</button>
      </div>
    </div>
  </template>
  
  <script>
import { useRoute } from 'vue-router';
import io from 'socket.io-client';
const socket = io("localhost:3000");
import playersSV from "/src/assets/players-sv.json";
import playersEN from "/src/assets/players-en.json";


  export default {
    name: "Lobby",
    data: function () {
        return {
            pollId: "",
            //uiLabels: {},
            lang: localStorage.getItem("lang") || "en",
            participants: [],
            selectedLevel: "",
            selectedCities: [],
            role: localStorage.getItem("role"), //Hämtar den tilldelade rollen som bestäms startView
        }
    },
    created: function () {
        this.pollId = this.$route.params.id;
        socket.on("gameStarted", () => {
          console.log("Din roll är:", this.role);
          if (this.role === "admin") {
            this.$router.push("/answers/" + this.pollId);
          } else if (this.role === "player") {
            this.$router.push("/participant-answer/" + this.pollId);
          } else if (this.role === "screen"){
            this.$router.push("/game/" + this.pollId);
          }
        });
        socket.on('participantsUpdate', (p) => {
            console.log("mottagna deltagare:", p);
            this.participants = p; });
        socket.on("selectedLevel", (data) => {
        console.log("Mottagen nivå:", data);
          // Spara städerna i data
        this.selectedLevel = data.level; 
        this.selectedCities = data.cities;
        });
        socket.emit("joinPoll", this.pollId);
        socket.emit("getParticipants", this.pollId);
      },

      computed: {
        gameCode() {
          return this.lang === "sv" ? playersSV.gameCode : playersEN.gameCode;
        },
        participantsLabel() {
          return this.lang === "sv" ? playersSV.participantsLabel : playersEN.participantsLabel
        },
        letsGo(){
          return this.lang === "sv" ? playersSV.letsGo : playersEN.letsGo
        }
      },
      
    methods: {
      startGame() {
        socket.emit("startGame", this.pollId);
      }
    },
  }




  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Agbalumo&family=Cormorant:wght@700&display=swap');
  .lobby-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(to right, #d1e7ff, #d3bdf3);
    height: 100vh;
    padding: 20px;
    font-family: 'Futura', sans-serif;
  }
  
  .lobby-info {
    flex: 1;
    padding: 10px;
  }
  
  h1 {
    font-size: 2.5em;
    color: #333;
  }
  
  .pollId {
    font-weight: bold;
    color: #000;
    text-decoration: underline;
  }
  
  h2 {
    font-size: 1.5em;
    margin-top: 20px;
  }
  
  ol {
    font-size: 1.2em;
    line-height: 1.8;
  }
  
  .game-visual {
    flex: 1;
    text-align: center;
  }
  
  .train-image {
    max-width: 100%;
  }
  
  .start-button {
    background: linear-gradient(5deg, #63b65f, #bcedbe);
    color: #00350f;
    font-size: 1.5em;
    font-family: 'Futura', sans-serif;
    padding: 30px 215px;
    border: 2px solid #00720f;
    border-radius: 10px;
    cursor: pointer;
    transition: transform 0.2s, background-color 0.2s;
  }
  
  .start-button:hover {
    transform: scale(1.1);
    color: #fff;
  }
  </style>
  
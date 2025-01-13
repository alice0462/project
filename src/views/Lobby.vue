<template>
  <div class="lobby-container">
    <div class="lobby-info">
      <h1> {{ gameCode }}: <span class="pollId"> {{ this.pollId }} </span></h1>
      <h2> {{ participantsLabel }}:</h2>
      <div class="participant-list">
        <p v-for="(participant, index) in participants" :key="index">
          {{ participant.name }}</p>
      </div>
    </div>
    <div class="game-visual">
      <img src="https://www.wallquotes.com/sites/default/files/kids0017-18.png" alt="All Aboard!" class="train-image" />
      <button v-if="role === 'admin'" class="start-button" @click="startGame">{{letsGo}}</button>
    </div>
  </div>
</template>

 <script>
 import io from 'socket.io-client';
 const socket = io(sessionStorage.getItem("currentNetwork"));
 import playersSV from "/src/assets/players-sv.json";
 import playersEN from "/src/assets/players-en.json";
 
 export default {
  name: "Lobby",
  data: function () {
    return {
      pollId: "",
      lang: localStorage.getItem("lang") || "en",
      participants: [],
      selectToGamecode: "",
      selectedCities: [],
      role: localStorage.getItem("role"),
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
        this.participants = p; 
    });

    socket.on("selectedToGameCode", (data) => {
      console.log("Mottagen nivå:", data);
      this.selectedToGameCode = data.level;
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
    justify-content: center;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(to right, #d1e7ff, #d3bdf3);
    height: 100vh;
    padding: 20px;
    font-family: 'Futura', sans-serif;
    position: relative;
  }
  .lobby-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    text-align: center; 
  }
  h1 {
    font-size: clamp(1.5rem, 3vw, 2.5rem);
    color: #333;
    position: absolute;
    top: 10%;
  }
  .participant-list {
    text-align: center; 
    margin-top: -250px;
  }
  .participant-list p {
    margin: 5px 0; 
    font-size: 1.5rem; 
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
    position: absolute;
    top: 20%;
  }
  .game-visual {
    flex-direction: column; 
    justify-content: center; 
    align-items: center; 
    gap: 20px; 
    width: 100%; 
    display: flex;
  }
  .train-image {
    width: clamp(100%, 50vw, 50%);
    max-height: clamp(20vh, 50vh, 60vh);
    object-fit: contain; 
    display: block; 
    justify-content: center;
    position: absolute;
    top: 45%;
  }
  .start-button {
    background: linear-gradient(5deg, #63b65f, #bcedbe);
    color: #00350f;
    font-size: clamp(1.5rem, 1.5vw, 1.5rem); 
    font-family: 'Futura', sans-serif;
    padding: clamp(20px, 3vw, 40px) clamp(40px, 6vw, 100px); 
    border: 2px solid #00720f;
    border-radius: 10px;
    cursor: pointer;
    transition: transform 0.2s, background-color 0.2s;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 80%;
  }
  .start-button:hover {
    transform: scale(1.1);
    color: #fff;
  }
  @media screen and (max-width: 768px) {
  .lobby-container {
    justify-content: space-between; /* Fördela utrymmet jämnt */
  }

  .lobby-info {
    justify-content: flex-start; /* Justerar allt till toppen */
    gap: 10px; /* Lägger till avstånd mellan elementen */
  }

  h1 {
    font-size: 1.8rem;
    margin-bottom: 10px;
  }

  .participant-list {
    margin-top: 200px;
  }

  .participant-list p{
    font-size: 1rem;
  }

  .pollId {
    font-size: 1.5rem;
  }

  .game-visual {
    margin-top: auto; /* Trycker ned tåget mot botten */
    margin-bottom: 20px; /* Lägger till lite extra utrymme nedanför tåget */
  }

  .train-image {
    width: 60%; /* Anpassa storlek för mobilen */
    height: auto;
  }

  .start-button {
    font-size: 1.2rem;
    padding: 10px 20px;
    width: 80%;
    max-width: 250px;
    margin-top: 0px;
  }
}
</style>

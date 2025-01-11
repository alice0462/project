<template>
  <div class="game-master-container">
    <div class="game-info">
      <h1>Spelkod: <span class="game-code"><!--HÄR SKA VI LÖSA NÅGON KOD SOM KOPPLAS IHOP MED SPELARNA--></span></h1>
      <h2>Deltagare:</h2>
      <!-- HÄR SKA VI KOPPLA IHOP DE NAMN SOM SKRIVS IN I PLAYERS!!!!-->
      <ol>
        <li><!-- NAMN 1 --></li>
      </ol>
    </div>
    <div class="game-visual">
      <img src="https://www.wallquotes.com/sites/default/files/kids0017-18.png" 
        alt="All Aboard!" class="train-image" />
        <button class="start-button" @click="startGame">Starta spel</button>
    </div>
  </div>
</template>
  
<script>
import { useRoute } from 'vue-router';
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: "GameMasterCode",
  setup () {
    const route = useRoute ();
    const selectedToGameCode = route.query.selectToGamecode || 'Ingen nivå vald';
    return {
      selectedToGameCode,
    };
  },
  
  created: function () {
    socket.on("selectedToGameCode", (data) => {
      console.log("Mottagen nivå:", data);
      this.selectedToGameCode = data.level; 
    });
  },
    
  methods: {
    startGame() {
      this.$router.push("/game");
    },
  },
};
</script>
  
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Agbalumo&family=Cormorant:wght@700&display=swap');
    
  .game-master-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(to right, #d1e7ff, #d3bdf3);
    height: 100vh;
    padding: 20px;
    font-family: 'Futura', sans-serif;
  }
  .game-info {
    flex: 1;
    padding: 10px;
  }
  h1 {
    font-size: 2.5em;
    color: #333;
  }
  .game-code {
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
  
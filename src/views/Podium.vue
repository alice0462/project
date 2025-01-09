<template>
    <div class="podium-container">
      <div class="podium">
        <div class="podium-column second">
          <div class="name">NAMN</div>
          <div class="position">2</div>
        </div>
        <div class="podium-column first">
          <div class="name">NAMN</div>
          <div class="position">1</div>
        </div>
        <div class="podium-column third">
          <div class="name">NAMN</div>
          <div class="position">3</div>
        </div>
      </div>
      <div class="remaining-players" v-if="remainingPlayers.length > 0">
      <h2>Resterande placeringar</h2>
      <ol>
        <p v-for="(player, index) in remainingPlayers" :key="index">
          {{ index + 4 }}. {{ player.name }} - {{ player.points }} poäng
        </p>
      </ol>
    </div>
      <button class="end-game-btn" @click="endGame">Avsluta spel</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
    return {
      players: [
        { name: "Spelare 1", points: 100 },
        { name: "Spelare 2", points: 80 },
        { name: "Spelare 3", points: 60 },
        { name: "NAMN", points: 50 },
        { name: "NAMN", points: 40 },
      ],
    };
  },

  computed: {
    podium() {
      return this.players.slice(0, 3); // Topp 3 spelare
    },
    remainingPlayers() {
      return this.players.slice(3); // Alla utom topp 3
    },
  },

    methods: {
      endGame() {
        console.log("Spelet avslutades!");
      },
    },
  };
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Agbalumo&family=Cormorant:wght@700&display=swap');
  
  .podium-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: url('https://i.pinimg.com/originals/7f/ac/08/7fac087e8a3b876d9c884e29c58d4ba1.gif') no-repeat center center fixed;
    padding: 0px;
    background-size: cover; /* Gör att bakgrunden täcker hela skärmen */
    margin: 0; /* Säkerställer att inga marginaler förstör layouten */
    background-color: pink;
  }
  
  .podium {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    gap: 30px;
  }
  
  .podium-column {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    border-radius: 10px;
    text-align: center;
    position: relative;
  }
  
  /* Första plats */
  .podium-column.first {
    height: 0;
    width: 180px;
    background: linear-gradient(to right, #c09c00, #ffe260);
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
    animation: growFirst 2s ease-out forwards;
  }
  
  /* Andra plats */
  .podium-column.second {
    height: 0;
    width: 126px;
    background: linear-gradient(to right, #a3a3a3, #e8e8e8);
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
    animation: growSecond 2s ease-out forwards;
    animation-delay: 0.3s;
  }
  
  /* Tredje plats */
  .podium-column.third {
    height: 0;
    width: 96px;
    background: linear-gradient(to right, #cb8011, #ffa734);
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
    animation: growThird 2s ease-out forwards;
    animation-delay: 0.6s;
  }
  
  /* Animationer för varje plats */
  @keyframes growFirst {
    to {
      height: 300px; /* Första plats slutar högst */
    }
  }
  
  @keyframes growSecond {
    to {
      height: 210px; /* Andra plats slutar lite mindre */
    }
  }
  
  @keyframes growThird {
    to {
      height: 160px; /* Tredje plats är minst */
    }
  }
  
  .name {
    position: absolute;
    top: -30px;
    font-size: 18px;
    font-weight: bold;
  }
  
  .position {
    font-size: 48px;
    font-weight: bold;
    color: black;
  }
  
  .end-game-btn {
    margin-top: 20px;
    background: linear-gradient(to right, #bcd4ff, #99c9ff);
    color: black;
    border: none;
    border-radius: 10px;
    padding: 10px 20px;
    font-size: 18px;
    cursor: pointer;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s;
  }
  
  .end-game-btn:hover {
    transform: scale(1.1);
  }

  .remaining-players {
    margin-top: 20px;
    text-align: center;
  }

.remaining-players h2 {
  font-family: 'Futura', sans-serif;
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.remaining-players ol {
  list-style-position: inside;
  font-family: 'Futura', sans-serif;
  font-size: 1.2rem;
  color: black;
}
  </style>
  
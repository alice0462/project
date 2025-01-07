<template>
    <div class="pointContainer">
      <h1>Poängställning</h1>
      <div class="pointBox">
        <ol>
          <!-- Dynamisk rendering av listan -->
          <p v-for="(player, index) in leaderboard" :key="index">
            {{ index + 1 }}. {{ player.name }} - {{ player.points }} poäng
          </p>
        </ol>
        <button class="nextDestinationButton" @click="nextDestination">
            Nästa destination
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        // Exempeldata för poängställning
        leaderboard: [
          { name: "Namn 1", points: 100 },
          { name: "Namn 2", points: 80 },
          { name: "Namn 3", points: 60 }
        ]
      };
    },
    methods: {
      // Metod för att sortera leaderboard om nödvändigt
      sortLeaderboard() {
        this.leaderboard.sort((a, b) => b.points - a.points); // Sortera efter poäng, fallande
      }
    },
    created() {
      // Du kan t.ex. kalla på en API eller använda WebSocket för att hämta data dynamiskt
      this.sortLeaderboard(); // Sortera data vid skapandet
    }
  };
  </script>
  
  <style scoped>
  .pointContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: linear-gradient(to right, #d1e7ff, #d3bdf3);
    padding: 20px;
  }
  
  h1 {
    font-family: 'Futura', sans-serif;
    font-size: 2.5rem;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .pointBox {
    background-color: #f5f5f5;
    padding: 20px;
    border-radius: 15px;
    width: 60%;
    max-width: 700px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    color: black;
    font-size: 1.2rem;
  }
  
  ol {
    list-style-position: inside;
    font-family: 'Futura', sans-serif;
  }
  
  p {
    margin: 10px 0;
  }

  .nextDestinationButton {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: #63b65f; /* Grön färg */
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 1rem;
  font-family: 'Futura', sans-serif;
  cursor: pointer;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.nextDestinationButton:hover {
  transform: scale(1.1); /* Förstora knappen vid hover */
  background-color: #4a9347; /* Mörkare grön färg vid hover */
}
  </style>
  
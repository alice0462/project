<template>
  <div class="pointContainer">
    <h1>{{currentScore}}</h1>
    <div class="pointBox">
        <ol v-if="leaderboard.length > 0">
          <p v-for="(player, index) in leaderboard" :key="index">
            {{ index + 1 }}. {{ player.name }} - {{ player.points }} {{points1}}</p>
        </ol>
        <p v-else>{{noPlayersYet}}</p>
        <button v-if="role === 'admin' "class="nextDestinationButton" @click="goToNextDestination">
          {{nextDestination}}
        </button>
    </div>
  </div>
</template>
  
<script>
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("currentNetwork"));
import gameMasterSv from '@/assets/gameMaster-sv.json';
import gameMasterEn from '@/assets/gameMaster-en.json';

export default {
  name: 'Points',
  data: function() {
    return {
      role: localStorage.getItem("role"),
      pollId: "",
      leaderboard: [],
      cities: [],
      currentCityIndex: 0,
      gameEnd: false,
    };
  },

  created: function(){
    this.pollId = this.$route.params.id;
    console.log("pollId skickat till servern:", this.pollId);
      
    socket.on("participantLeaderbord", (participants) => {
      console.log("Mottagna deltagare:", participants);
      this.sortLeaderboard(participants)});

    socket.on("sendNextView", () => {
      if (this.role === "admin") {
        this.$router.push("/answers/" + this.pollId);
      } else if (this.role === "player") {
        this.$router.push("/participant-answer/" + this.pollId);
      } else if (this.role === "screen"){
        this.$router.push("/game/" + this.pollId);
      }
    });

    socket.on('fullGame', (data) => {
      console.log("Valda städer mottagna:", data.cities);
      this.cities = data.cities;
      this.currentCityIndex = data.currentCityIndex;
    }); 
    
    socket.on("endOfJourney", () => {
      console.log("Resan är slut!");
      this.$router.push(`/podium/${this.pollId}`); // Navigera till en summeringssida
    });

    socket.emit("joinPoll", this.pollId);
    socket.emit("getScores", this.pollId);
  },

  methods: {
    sortLeaderboard(participants) {
      if (participants && participants.length > 0) {
        this.leaderboard = [...participants].sort((a, b) => b.points - a.points);
        console.log("Uppdaterad leaderboard:", this.leaderboard);
      } else {
        console.log("Inga deltagare att visa.");
      }
    },

    goToNextDestination() {
      console.log("Begär nästa destination...");
      socket.emit("nextCity", this.pollId); 
      socket.emit("nextView", this.pollId);
    },
  },

  computed: {
    currentScore() {
      return this.lang === "sv" ? gameMasterSv.currentScore : gameMasterEn.currentScore;
    },
    points1() {
      return this.lang === "sv" ? gameMasterSv.points1 : gameMasterEn.points1;
    },
    noPlayersYet() {
      return this.lang === "sv" ? gameMasterSv.noPlayersYet : gameMasterEn.noPlayersYet;
    },
    nextDestination() {
      return this.lang === "sv" ? gameMasterSv.nextDestination : gameMasterEn.nextDestination;
    },
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
  background-color: #63b65f; 
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
  transform: scale(1.1); 
  background-color: #4a9347; 
  }

  @media screen and (max-width: 768px) {
  .pointContainer {
    padding: 10px;
    min-height: 100vh; /* Låt sidan fylla hela höjden */
  }

  h1 {
    font-size: 2rem; /* Anpassa rubrikstorlek för mindre skärmar */
    margin-bottom: 15px;
  }

  .pointBox {
    width: 90%; /* Gör boxen bredare på små skärmar */
    padding: 15px; /* Minska inre padding */
    font-size: 1rem; /* Anpassa textstorleken */
  }

  ol {
    font-size: 0.9rem; /* Minska textstorlek för listan */
  }

  p {
    margin: 5px 0; /* Minska mellanrum mellan listobjekt */
  }

  .nextDestinationButton {
    width: 90%; /* Gör knappen bredare för att fylla utrymmet */
    max-width: 300px; /* Sätt en maxbredd */
    padding: 10px; /* Justera padding */
    font-size: 0.9rem; /* Anpassa textstorlek för mobilen */
    position: static; /* Flytta knappen till en mer naturlig position */
    margin-top: 20px; /* Lägg till avstånd ovanför knappen */
    align-self: center; /* Centrera knappen */
  }
}

</style>
  
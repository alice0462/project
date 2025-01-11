<template>
  <div class="podium-container">
    <div class="podium">
      <div class="podium-column second" v-if="podium[1]">
        <div class="name">{{ podium[1].name }}</div>
        <div class="position">{{ podium[1].points }} poäng</div>
      </div>
      <div class="podium-column first" v-if="podium[0]">
        <div class="name">{{ podium[0].name }}</div>
        <div class="position">{{ podium[0].points }} poäng</div>
      </div>
      <div class="podium-column third" v-if="podium[2]">
        <div class="name">{{ podium[2].name }}</div>
        <div class="position">{{ podium[2].points }} poäng</div>
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
  import io from 'socket.io-client'; //dessa två rader ska vara här sen, men just nu finns det inga sockets att koppla till 
  import secondSoundFile from '@/assets/lat2.mp3';
  const socket = io(sessionStorage.getItem("currentNetwork"));

  export default {
    name: "Podium",
    data() {
    return {
      players: [], // Börja med en tom lista
      audio: null,
      pollId: "",
    };
  },

  created: function () {
    this.pollId = this.$route.params.id;
    this.startAudio();

    socket.on("stopSecondMusic", () => {
      console.log("stopMusic-händelse mottagen i Game.vue");
      this.stopAudio(); 
        });

    socket.on("participantLeaderbord", (participants) => {
      console.log("Mottagna deltagare: MAMMA", participants);
      this.sortLeaderboard(participants);
    });
    socket.emit("joinPoll", this.pollId);
    socket.emit("getScores", this.pollId);

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
    sortLeaderboard(participants) {
      if (participants && participants.length > 0) {
        this.players = [...participants].sort((a, b) => b.points - a.points);
        console.log("Uppdaterad leaderboard:", this.players);
      } else {
        console.log("Inga deltagare att visa.");
      }
    },

    endGame() {
      console.log("Spelet avslutades!");
      socket.emit("stopSecondMusic", this.pollId);
      socket.emit("resetGame", this.pollId);
      this.$router.push("/");

      },

    startAudio() {
      this.audio = new Audio(secondSoundFile); 
      this.audio.loop = true; 
      this.audio.play()
      console.log("Ljudet spelar")
    },

    stopAudio() {
      if (this.audio) {
        console.log("Stoppar ljudet"); 
        this.audio.pause();
        this.audio.currentTime = 0; 
      } else {
          console.log("Ingen ljudinstans hittades");
      }
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
    background-size: 100% 100%;
    background-color: pink;
    font-family: 'Futura', sans-serif;
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
    font-size: 20px;
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
  
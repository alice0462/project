<template>
  <div class="container-random">
    <h1>{{uiLabels.randomize}}</h1>
    <p>{{uiLabels.howManyDestinations}}</p>
    <div class="selection">
      <button
        v-for="number in [1, 2, 3]"
        :key="number"
        @click="setNumberOfTrips(number)"
        :class="{ active: number === numberOfTrips }">
          {{ number }}
      </button>
    </div>
    <button class="generate-button" :disabled="numberOfTrips === 0" @click="generateRandomDestinations" v-if="generateButton">
      {{ uiLabels.randomizeDestinations }}
    </button>
 
    <div v-if="randomDestinations.length > 0" class="results">
      <h2> {{uiLabels.givenDestination}} {{ randomDestinations.length > 1 ? '' : '' }}</h2>
      <ul>
        <li v-for="(city, index) in randomDestinations" :key="index">{{ city.name }}</li>
      </ul>
      <div class="action-buttons">
        <button @click="generateRandomDestinations">{{uiLabels.generateNewDestination}}</button>
        <button @click="acceptDestinations">{{uiLabels.confirm}}</button>
      </div>
    </div>
  </div>
 </template>
 
 
 <script>
 import { io } from "socket.io-client";
 const socket = io("http://localhost:3000");
 import gameMasterSv from '@/assets/gameMaster-sv.json';
 import gameMasterEn from '@/assets/gameMaster-en.json';
 
 export default {
  data() {
    return {
      name: "RandomDestination",
      numberOfTrips: 0,
      randomDestinations: [],
      data: {},
      pollId: "",
      generateButton: true,
      lang: localStorage.getItem("lang") || "en",
    };
  },

  created: function() {
    this.pollId = this.$route.params.id;
  },

  computed: {
    
    uiLabels() {
      return this.lang === "sv" ? gameMasterSv : gameMasterEn;
    },

    cities() {
      return Object.keys(this.uiLabels.cities).map((key) => this.uiLabels.cities[key]);
    },
  },
   
  methods: {
    setNumberOfTrips(number) {
      this.numberOfTrips = number;
    },

    generateRandomDestinations() {
      const shuffledCities = [...this.cities].sort(() => 0.5 - Math.random());
      this.randomDestinations = shuffledCities.slice(0, this.numberOfTrips).map(city => ({ name: city }));
      this.data = {name :this.name, cities: this.randomDestinations, pollId: this.pollId};
      this.generateButton = false;
    },

    acceptDestinations() {
      console.log(this.data);
      socket.emit("sendCities",{data: this.data, pollId: this.pollId});
      socket.emit("updateScreen", this.pollId);
      this.$router.push("/lobby/" + this.pollId); 
    },
  },
 };
 </script>
 
 <style scoped>
 @import url('https://fonts.googleapis.com/css2?family=Agbalumo&family=Cormorant:wght@700&display=swap');
 
 
  .container-random {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: linear-gradient(to right, #d1e7ff, #d3bdf3);
    padding: 20px;
    text-align: center;
    font-family: 'Futura';
  }
  h1 {
    font-size: 36px;
    margin-bottom: 20px;
    color: #333;
  }
  p {
    color: #313131;
  }
  .selection {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
  }
  button {
    padding: 20px 30px;
    font-size: 18px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  button:hover {
    background-color: #c3e6f0;
  }
  button.active {
    background-color: #0077cc;
    color: white;
  }
  .generate-button {
    background: linear-gradient(5deg, #fdff7d, #feffbd);
    color: rgb(0, 0, 0);
  }
  .results {
    margin-top: 30px;
  }  
  .results h2 {
    font-size: 28px;
    margin-bottom: 20px;
  }
  ul {
    list-style: none;
    padding: 0;
  }
  li {
    font-size: 20px;
    margin-bottom: 10px;
  }
  .action-buttons {
    display: flex;
    gap: 20px;
    margin-top: 30px;
  }
  .action-buttons button {
    padding: 30px 40px;
    font-size: 16px;
    font-weight: bold;
    border-radius: 15px;
    cursor: pointer;
  }
  .action-buttons button:first-child {
    background: linear-gradient(5deg, #639edd, #a9d2ff);
    color: white;
  }
  .action-buttons button:last-child {
    background: linear-gradient(5deg, #63b65f, #bcedbe);
    color: white;
  }
</style>
 
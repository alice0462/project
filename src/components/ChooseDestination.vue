<template>
  <div class="container-choose" >
    <header>{{uiLabels.youChooseDestination}}</header>
    <h1>{{uiLabels.maxThreeDestinations}}</h1>
    <div class="grid">
      <button
        v-for="(city, index) in cities"
        :key="index"
        :id="'city-' + index"
        :class="{ selected: selectedCities.some(c => c.name === city) }"
        @click="toggleSelection(city, index)">
          {{ city }}
      </button>
    </div>
    <button class="submit-btn" :disabled="selectedCities.length === 0" @click="openModal">
      {{ uiLabels.choose }}
    </button>
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h2>{{uiLabels.confirm}}</h2>
        <p>{{ uiLabels.youChoose }}: {{ selectedCities.map(c => c.name).join(", ") }}</p>
        <div class="modal-buttons">
          <button class="cancel-button" @click="closeModal">{{uiLabels.cancel}}</button>
          <button class="confirm-button" @click="confirmSelection">{{uiLabels.choose}}</button>
        </div>
      </div>
    </div>
  </div>
 </template>

<script>
 import { io } from "socket.io-client";
 const socket = io("http://localhost:3000");
 import gameMasterSv from '@/assets/gameMaster-sv.json';
 import gameMasterEn from '@/assets/gameMaster-en.json';
 import { useRouter } from 'vue-router';
 
export default {
  data() {
    return {
      name: "ChooseDestination",
      selectedCities: [],
      showModal: false,
      data: {},
      pollId: "",
      lang: localStorage.getItem("lang") || "en",
    }
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
    toggleSelection(city, index) {
      const selectedCity = { name: city, index: index };
      if (this.selectedCities.some((c) => c.name === city)) {
        this.selectedCities = this.selectedCities.filter((c) => c.name !== city);
      } else if (this.selectedCities.length < 3) {
        this.selectedCities.push(selectedCity);
      }
      this.data = {name :this.name, cities :this.selectedCities, pollId: this.pollId};
    },
    openModal() {
      this.showModal = true;
    },
    closeModal () {
      this.showModal = false;
    },
    confirmSelection () {
      console.log(this.data);
      socket.emit("sendCities", {data: this.data, pollId: this.pollId});
      socket.emit("updateScreen", this.pollId);
      this.$router.push("/lobby/" + this.pollId);
    },
  },
};
</script>
 
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Agbalumo&family=Cormorant:wght@700&display=swap');

  .container-choose {
    margin: 0;
    padding: 0;
    background:linear-gradient(to right, #d1e7ff, #d3bdf3);
    min-height: 100vh;
    font-family: 'Futura';
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center; 
    text-align: center; 
  }
  header{
    font-size: 2.5rem;
    font-family: 'Futura';
    margin-bottom: 2%;
    color: #333;
    position: relative; 
    top: calc(-5vh); 
  }
  h1{
    font-size: 1.2rem;
    font-weight: lighter;
    font-family: 'Futura';
    margin-bottom: 2%;
    color: #555;
    position: relative; 
    top: calc(-5vh); 
  }
  .grid {
    display: grid;
    grid-template-columns: 22% 22% 22% 22%;
    grid-template-rows: 22% 22% 22% 22%;
    gap: 2%;
    justify-content: center;
    text-align: center;
    width: 100%;
    aspect-ratio: 2/1;
    max-width: 900px;
    position: relative; 
    top: calc(-3vh); 
  }
  button {
    background-color: #ffe369;
    border: none;
    border-radius: 10px;
    padding: 20px;
    font-size: clamp(0.7rem, 2vw, 1rem); 
    font-family: 'Futura';
    cursor: pointer;
    transition: background-color 0.3s ease;
    text-align: center;
  }
  button.selected {
    background-color: #fff8d4; 
    border: 3px solid #cba935; 
  }
  button:hover {
    opacity: 0.9;
    transform: scale(1.1);
    cursor: pointer;
  }
  .submit-btn {
    margin-top: 20px;
    background-color: #34e583; 
    color: rgb(4, 4, 4);
    border: none;
    border-radius: 5px;
    padding: 20px 50px;
    font-size: 18px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    position: absolute; 
    right: 150; 
    bottom: 80px; 
 }
 .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
 }
  .modal {
    background: white;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    width: 400px;
    font-family: 'Futura';
    font-weight: lighter;
  }
  .modal-buttons {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    gap: 20px;
  }
  .confirm-button {
    background-color: #34e583;
    border: 2px;
    padding: 10px 20px;
    border-radius: 10px;
    color: white;
    cursor: pointer;
  }
  .cancel-button {
    background-color: red;
    border: 2px;
    padding: 10px 20px;
    border-radius: 10px;
    color: white;
    cursor: pointer;
  }
</style>
 
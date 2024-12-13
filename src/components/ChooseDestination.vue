<template>
  <div class="container-choose" >
    <header>Välj destination</header>
    <h1>Välj vilka resmål du vill åka till. Max 3 resor per spelomgång.</h1>
    <div class="grid">
      <!-- Dynamiskt generera knappar baserat på destinationerna -->
      <button
      v-for="(city, index) in cities"
        :key="index"
        :id="'city-' + index"
        :class="{ selected: selectedCities.includes(city) }"
        @click="toggleSelection(city)"
      >
        {{ city }}
      </button>
    </div>

    <button class="submit-btn" :disabled="selectedCities.length === 0" @click="openModal">
      Välj
    </button>
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h2>Bekräfta val</h2>
        <p>Du har valt: {{ selectedCities.join (", ") }}</p>
        <div class="modal-buttons">
          <button class="cancel-button" @click="closeModal">Avbryt</button>
          <button class="confirm-button" @click="confirmSelection"> Bekräfta</button>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import { io } from "socket.io-client";
const socket = io("http://localhost:3000"); 

import { useRouter } from 'vue-router';

  export default {
    data() {
    return {
      name: "ChooseDestination",
      // Lista med destinationer
      cities: [
        "Moskva",
        "Lissabon",
        "Seoul",
        "Toronto",
        "Tokyo",
        "Barcelona",
        "Linköping",
        "New York",
        "Stockholm",
        "Helsingfors",
        "Paris",
        "Kapstaden",
        "Hanoi",
        "Göteborg",
        "Buenos Aires",
        "Rio de Janeiro",
      ],
      selectedCities: [],
      showModal: false, 
      data: {},
      pollId: "",
      }
    },
    created: function() {
      this.pollId = this.$route.params.id;
    },

    methods: {
    toggleSelection(city) {
      if (this.selectedCities.includes(city)) {
        // Ta bort staden om den redan är vald
        this.selectedCities = this.selectedCities.filter((c) => c !== city);
      } else if (this.selectedCities.length < 3) {
        // Lägg till staden om färre än 3 är valda
        this.selectedCities.push(city);
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
      console.log(this.data.cities);
      socket.emit("sendCities", {data: this.data, pollId: this.pollId}); //Skapar ett rop som vi kommer behöva lyssna på, med ropet skickar vi med data (städer)

      /*this.showModal = false;*/

      // lagt till:
      this.$router.push("/level/" + this.pollId);
      /*this.$router.push({
        path: 'level',
        query: {selectedCities: this.selectedCities.join(', ')},
      });*/
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
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;
    align-items: center; /* Centrerar horisontellt */
    justify-content: center; /* Centrerar vertikalt */
    min-height: 100vh; /* Tar upp hela höjden på skärmen */
    text-align: center; /* Centrerar text */
  }

  header{ 
    font-size: 42px;
    font-family: 'Futura';
    margin-bottom: 30px;
    color: #333;
  }

  h1{
    font-size: 20px;
    font-weight: lighter;
    font-family: 'Futura';
    margin-bottom: 30px;
    color: #555;
  }

  .grid {
  display: grid;
  grid-template-columns: 200px 200px 200px 200px;
  grid-template-rows: 100px 100px 100px 100px;
  gap: 20px;
  padding: 0 20px;
  }

  button {
  background-color: #ffe369;
  border: none;
  border-radius: 10px;
  padding: 20px;
  font-size: 1em;
  font-family: 'Futura';
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button.selected {
  background-color: #fff8d4; /* Ljusare gul färg */
  border: 3px solid #cba935; /* Lägg till en kant för att markera */
}

button:hover {
  background-color: #fff8d4;
}
.submit-btn {
  margin-top: 20px;
  background-color: #34e583; /* Ändra färg här */
  color: rgb(4, 4, 4);
  border: none;
  border-radius: 5px;
  padding: 20px 50px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  position: absolute; /* Placera knappen absolut */
  right: 40px; /* Avstånd från höger */
  bottom: 80px; /* Avstånd från botten */
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
  
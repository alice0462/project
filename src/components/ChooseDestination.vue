<template>
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

    <button class="submit-btn" :disabled="selectedCities.length === 0" @click="submitSelection">
      Välj
    </button>

</template>
  
<script>
  export default {
    name: "ChooseDestination",
    data() {
    return {
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
        "München",
        "Kapstaden",
        "Hanoi",
        "Göteborg",
        "Buenos Aires",
        "Rio de Janeiro",
      ],
      selectedCities: [],
      }
    },
    methods: {
    // Funktion som körs när en knapp klickas
    /*selectCity(city, index) {
      alert(`Du har valt: ${city} (ID: city-${index})`);
    },*/
    toggleSelection(city) {
      if (this.selectedCities.includes(city)) {
        // Ta bort staden om den redan är vald
        this.selectedCities = this.selectedCities.filter((c) => c !== city);
      } else if (this.selectedCities.length < 3) {
        // Lägg till staden om färre än 3 är valda
        this.selectedCities.push(city);
      }
    },
    
    submitSelection() {
      alert(`Du har valt: ${this.selectedCities.join(", ")}`);
      // Här kan du lägga till kod för att navigera vidare eller bearbeta valet
    },
  },

  };
  
</script>

<style>
  header{ 
    font-size: 42px;
    font-family: 'Futura';
    margin-bottom: 30px;
  }

  h1{
    font-size: 20px;
    font-weight: lighter;
    font-family: 'Futura';
    margin-bottom: 30px;
  }

  .grid {
  display: grid;
  grid-template-columns: 200px 200px 200px 200px;
  grid-template-rows: 100px 100px 100px 100px;
  gap: 20px;
  padding: 0 20px;
  }

  button {
  background-color: #f4d03f;
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
  border: 2px solid #cba935; /* Lägg till en kant för att markera */
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
  padding: 30px 50px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  position: absolute; /* Placera knappen absolut */
  right: 40px; /* Avstånd från höger */
  bottom: 35px; /* Avstånd från botten */
}
</style>
  
  <template>
    <div class="level-container">
      <header>
        <h1>Välj svårighetsgrad</h1>
      </header>
      <div class="container">
        <div class="level">
          <button
            v-for="(level, index) in levels"
            :key="index"
            :id="'level-' + index"
            :class="{ selected: selectedLevels.includes(level) }"
            @click="toggleSelection(level)"
            >
            {{ level }}
          </button>

        </div>
        <button class="submit-btn" :disabled="selectedLevels.length === 0" @click="openModal">
          Välj
      </button>

      <div v-if="showModal" class="modal-overlay">
        <div class="modal">
          <h2>Bekräfta val</h2>
          <p>Du har valt: {{ selectedLevels.join ("") }}</p>
          <div class="modal-buttons">
            <button class="cancel-button" @click="closeModal">Avbryt</button>
            <button class="confirm-button" @click="confirmSelection"> Bekräfta</button>
          </div>
        </div>
      </div>
    </div>


      <!-- 
        Poll link: 
        <input type="text" v-model="pollId">
        <button v-on:click="createPoll">
          Create poll
        </button>
        <div>
          {{ uiLabels.question }}:
          <input type="text" v-model="question">
          <div>
            Answers:
            <input v-for="(_, i) in answers" 
                  v-model="answers[i]" 
                  v-bind:key="'answer' + i">
            <button v-on:click="addAnswer">
              Add answer alternative
            </button>
          </div>
        </div>
        <button v-on:click="addQuestion">
          Add question
        </button>
        <input type="number" v-model="questionNumber">
        <button v-on:click="startPoll">
          Start poll
        </button>
        <button v-on:click="runQuestion">
          Run question
        </button>
        <router-link v-bind:to="'/result/' + pollId">Check result</router-link>
        Data: {{ pollData }} -->
      </div>
    </template>
    
    <script>
    import io from 'socket.io-client';
    import { useRoute } from 'vue-router';
    const socket = io("localhost:3000");
    
    export default {
      setup() {
        const route = useRoute(); // Hämta router-objektet
        const selectedCities = route.query.selectedCities?.split(',') || []; // Dela upp query-parametern till en array

        return {
          selectedCities,
        };
      },
      data: function () {
        return {
          name: 'Level',
          lang: localStorage.getItem("lang") || "en",
          pollId: "",
          question: "",
          answers: ["", ""],
          questionNumber: 0,
          pollData: {},
          uiLabels: {},
          levels: [ "Lätt", 
                    "Svår"],
          selectedLevels: [],
          showModal: false, 
          selectedCities: [],
        }
      },
      created: function () {
        socket.on("selectedCities", (data) => {
        console.log("Mottagna städer:", data);
          // Spara städerna i data
        this.selectedCities = data.destination; 
        });
        socket.on( "uiLabels", labels => this.uiLabels = labels );
        socket.on( "pollData", data => this.pollData = data );
        socket.on( "participantsUpdate", p => this.pollData.participants = p );
        socket.emit( "getUILabels", this.lang );
      },
      methods: {
        createPoll: function () {
          socket.emit("createPoll", {pollId: this.pollId, lang: this.lang })
          socket.emit("joinPoll", this.pollId);
        },
        startPoll: function () {
          socket.emit("startPoll", this.pollId)
        },
        addQuestion: function () {
          socket.emit("addQuestion", {pollId: this.pollId, q: this.question, a: this.answers } )
        },
        addAnswer: function () {
          this.answers.push("");
        },
        runQuestion: function () {
          socket.emit("runQuestion", {pollId: this.pollId, questionNumber: this.questionNumber})
        },
        /*selectLevel(level) {
        // Skicka svårighetsgraden som en parameter (valfritt)
          this.$router.push({ path: "/game-master-code", query: { difficulty: level } });
        },*/
        openModal() {
          this.showModal = true;
        },
        closeModal () {
          this.showModal = false;
        },
        confirmSelection () {
          const payload = {
            levels: this.selectedLevels, // Valda nivåer
            cities: this.selectedCities, // Valda städer
          };
          socket.emit("sendLevel", payload)
        /*this.showModal = false;*/
          this.$router.push({
            path: 'game-master-code',
            //query: {selectedLevels: this.selectedLevels[0]},   
          });
        },
        toggleSelection(level) {
        if (this.selectedLevels.includes(level)) {
          // Ta bort staden om den redan är vald
          this.selectedLevels = this.selectedLevels.filter((c) => c !== level);
        } else if (this.selectedLevels.length < 1) {
          // Lägg till staden om färre än 3 är valda
          this.selectedLevels.push(level);
        }
      },
        
      }
    }
    </script>
    
    <style scoped>
    @import url('https://fonts.googleapis.com/css2?family=Agbalumo&family=Cormorant:wght@700&display=swap');
    
    .level-container {
      display: flex;
      align-items: center;
      flex-direction: column;
      background: linear-gradient(to right, #d1e7ff, #d3bdf3);
      background-size: cover; /* Se till att gradienten täcker hela skärmen */
      background-repeat: no-repeat; /* Förhindrar upprepning */
      margin: 0; /* Tar bort eventuell marginal */
      height: 100vh; /* Säkerställ att höjden täcker hela fönstret */
    
    h1 {
      color: rgb(47, 0, 72);
      font-size: 60pt;
      font-family: 'Futura';
      text-shadow: 2px 3px rgba(49, 0, 59, 0.7)
      }
    }
    
    
    .level {
      display: grid;
      grid-template-columns: 300px 300px;
      grid-template-rows: 250px 250px;
      gap: 80px;
      padding: 20px;
    }

    #level-0 {
    background: linear-gradient(5deg, #63b65f, #bcedbe); /* Grön för Lätt */
    border: none;
    border-radius: 10px;
    padding: 20px;
    font-size: 1em;
    font-family: 'Futura';
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  #level-0.selected{
    background: linear-gradient(5deg, #41893e, #9feda1); /* Ljusare gul färg */
    border: 5px solid #1c5700; /* Lägg till en kant för att markera */
  }

  #level-0:hover {
    transform: scale(1.1);
  }


  #level-1 {
    background: linear-gradient(5deg, #a30e0e, #eaafaf); /* Röd för Svår */
    border: none;
    border-radius: 10px;
    padding: 20px;
    font-size: 1em;
    font-family: 'Futura';
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  #level-1.selected{
    background: linear-gradient(5deg, #b20000, #ff7777); /* Ljusare gul färg */
    border: 5px solid #ac0707; /* Lägg till en kant för att markera */
  }

  #level-1:hover {
    transform: scale(1.1);
  }


    .submit-btn {
    margin-top: 20px;
    background-color: #5895ff; /* Ändra färg här */
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
    
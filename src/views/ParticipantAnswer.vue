<template>
<body>
  <div v-if="!cityQuestion">
    <div class="answerButtonContainer" @mousedown="startDrag" @mouseup="stopDrag" @mousemove="drag">
      <button type="button" class="answerButton" :style="{ transform: `translateY(${buttonOffset}px)` }">
        <img 
            src="/public/nodbroms.png"
        />
    </button>
    </div>
    <div v-if="submitAnswer && !finalAnswer" class="writeAnswer">
      <div class="writeAnswerContent">
        <h2> {{ goingWhere }}</h2>
        <br>
        <input type="text" class="answerText" v-model="answerDestination" :placeholder= "locationGuess"/>
        <button v-on:click="submitDestination()" class="submitDestinationButton"> {{ lockInAnswer }}</button>
      </div>
    </div>
    <div v-if="finalAnswer" class="writeAnswer">
      <div class="writeAnswerContent">
        <h2> {{ lockedAnswer }}</h2>
        <p> {{ theLockedAnswer }}</p>
        <p class="lockedAnswer"> {{ finalAnswer }}</p>
      </div>
    </div>
  </div>

  <div v-if="cityQuestion" class="questionsView">
    <div v-if="level === level">
      <h2> {{ questionsAbout }} {{ currentCity }}</h2>

      <!-- Fråga 1 -->
      <div class="answerRow">
        <h3>{{question1}}</h3>
        <input 
          type="text" 
          class="answerInput" 
          v-model="questionAnswers[0]" 
          :placeholder= "questionGuess" 
        />
      </div>

      <!-- Fråga 2 -->
      <div class="answerRow">
        <h3>{{question2}}</h3>
        <input 
          type="text" 
          class="answerInput" 
          v-model="questionAnswers[1]" 
          :placeholder= "questionGuess" 
        />
      </div>
          <!-- Knapp för att låsa in frågesvar -->
    <button 
      class="submitDestinationButton" 
      @click="submitQuestionAnswers()"
    >
      {{lockInCityQuestions}}
    </button>
    <div v-if="finalQuestionAnswers" class="writeAnswer">
      <div class="writeAnswerContent">
        <h2> {{ lockedAnswer }} </h2>
        <p
          v-for="(answer, index) in finalQuestionAnswers" :key="index">
          {{ question3 }} {{ index + 1 }}: {{ answer }}
      </p>
      </div>
    </div>
  </div>

    </div>



</body>
</template>

<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");
import playersSV from "/src/assets/players-sv.json";
import playersEN from "/src/assets/players-en.json";
import gameMasterSv from '@/assets/gameMaster-sv.json';
import gameMasterEn from '@/assets/gameMaster-en.json';

export default {
  name: 'ParticipantAnswer',
  data: function () {
    return {
      uiLabels: {},
      submitAnswer: false,
      answerDestination: "",
      finalAnswer: null,
      questionAnswers: ["", ""],
      pollId:"",
      lang: localStorage.getItem( "lang") || "en",
      user: localStorage.getItem( "participantName") || "unknownParticipant",
      timer: 5, //Tid kvar i sekunder för poängen
      points: 10, //Startpoäng
      intervalId: null, //Timer-ID
      timeElapsed: 0,
      cityQuestion: false,
      level: null,
      currentCity: null,
      finalQuestionAnswers: null,
      isDragging: false, // Spårar om användaren drar
      dragDistance: 0,   // Total dragsträcka
      maxDrag: 250, 
      buttonOffset: 0,
    }
  },
  created: function () {
    this.pollId = this.$route.params.id;
    console.log("Användarnamn från sessionStorage:", this.user); // Loggar användarnamnet här
    socket.on("gameStarted", (startTime) => {
      console.log("starttid mottagen:", startTime);
      this.startTimer(startTime);
    });
    socket.on('selectedToGameCode', (l) => {
            console.log("Vald nivå mottagen:", l);
            this.level = l;});
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.on("showQuestions", pollId => {
            this.cityQuestion = true;
        });
    socket.on("updateCurrentCity", (data) => {
      if (data.currentCity) {
        this.currentCity = data.currentCity;
        console.log("Mottagen stad:", this.currentCity);
      }
    });
    
    socket.on("showScores", (pollId) => {
      if (pollId === this.pollId) {
        this.$router.push("/points/" + this.pollId);
      }
    });


    socket.emit( "getUILabels", this.lang );
    socket.emit("joinPoll", this.pollId);
    socket.emit("getCurrentParticipant", (data) => {
      this.participantName=data.name;
    });
    socket.emit("requestStartTime", this.pollId);
    socket.emit("requestCode", this.pollId); 
    //this.startTimer();
    
  },

  computed: {
        goingWhere() {
          return this.lang === "sv" ? playersSV.goingWhere : playersEN.goingWhere;
        },
        locationGuess(){
          return this.lang === "sv" ? playersSV.locationGuess : playersEN.locationGuess
        },
        lockInAnswer() {
          return this.lang === "sv" ? playersSV.lockInAnswer : playersEN.lockInAnswer
        },
        lockedAnswer() {
          return this.lang === "sv" ? playersSV.lockedAnswer : playersEN.lockedAnswer;
        },
        theLockedAnswer() {
          return this.lang === "sv" ? playersSV.theLockedAnswer : playersEN.theLockedAnswer;
        },
        questionsAbout() {
          return this.lang === "sv" ? playersSV.questionsAbout : playersEN.questionsAbout;
        },
        question1() {
          return this.lang === "sv" ? playersSV.question1 : playersEN.question1;
        },
        question2() {
          return this.lang === "sv" ? playersSV.question2 : playersEN.question2;
        },
        questionGuess() {
          return this.lang === "sv" ? playersSV.questionGuess : playersEN.questionGuess;
        },
        lockInCityQuestions() {
          return this.lang === "sv" ? playersSV.lockInCityQuestions : playersEN.lockInCityQuestions;
        },
        level(){
          return this.lang === "sv" ? gameMasterSv.level : gameMasterEn.level;
        },
        question3() {
          return this.lang === "sv" ? playersSV.question3 : playersEN.question3;
        },
      },

  methods: {
    startTimer(startTime) {
      this.timeElapsed = Math.floor((Date.now() - startTime) / 1000);
      this.timer = 5 - (this.timeElapsed % 5);

      this.intervalId = setInterval(() => {
        if (this.timer > 0) {
          this.timer--;
        } else {
          if (this.points > 2) {
            this.points -= 2;
            console.log("Nu är vi på nivå för:", this.points, "poäng")
            this.timer = 5; //Återställ timern
          } else if(!this.finalAnswer){
            this.stopTimer();
            this.missingAnswer();
          }
          
        }
      }, 1000); //Uppdatera varje sekund
    },
    stopTimer() {
      clearInterval(this.intervalId); //SToppar timern
    },
    missingAnswer() {
      socket.emit("answerSubmit", {user: this.user, pollId: this.pollId, guess: "Inget svar", points: 0 });
      console.log("inget svar registrerat för spelare:", this.user)

    },
    submitDestination(){
      if(this.answerDestination === "") {
        alert("Du måste skriva in ett svar innan du kan låsa in det!")
      } else {
        
        this.finalAnswer = this.answerDestination;
        this.submitAnswer = false;

        this.stopTimer();

        console.log("Svaret är låst:", this.finalAnswer);
        socket.emit("answerSubmit", {user: this.user, pollId: this.pollId, type: 'destination', guess: this.finalAnswer, points: this.points })
      }
      console.log("Svar skickat:", {user: this.user, pollId: this.pollId, guess: this.finalAnswer, points: this.points});
    },
    submitQuestionAnswers() {
      this.finalQuestionAnswers = [...this.questionAnswers];
      socket.emit("answerSubmit", {
        user: this.user,
        pollId: this.pollId,
        type: "questions",
        answers: [
          { questionNumber: 1, guess: this.questionAnswers[0] },
          { questionNumber: 2, guess: this.questionAnswers[1] },
        ],
      });
    },
    startDrag(event) {
      event.preventDefault();
      this.isDragging = true;
      this.dragStartY = event.clientY; // Startpunkt för dragningen

    // Lägg till globala lyssnare
    window.addEventListener("mousemove", this.drag);
    window.addEventListener("mouseup", this.stopDrag);
  },
  drag(event) {
    if (this.isDragging) {
      const dragAmount = event.clientY - this.dragStartY;
      
      this.buttonOffset = Math.min(Math.max(dragAmount, 0), this.maxDrag);

      if (dragAmount >= this.maxDrag) {
        this.triggerButton(); // Aktivera nödbromsen
        this.stopDrag(); // Stoppa dragningen
      }
    }
  },
  stopDrag() {
    if (this.isDragging) {
      this.isDragging = false;

      // Ta bort globala lyssnare
      window.removeEventListener("mousemove", this.drag);
      window.removeEventListener("mouseup", this.stopDrag);

      // Återställ position om inte maxDrag nåddes
      if (this.buttonOffset < this.maxDrag) {
        this.buttonOffset = 0; // Tillbaka till startposition
      }
    }
  },
  triggerButton() {
    console.log("Nödbromsen är aktiverad!");
    this.submitAnswer = true; // Logik för att aktivera nödbromsen
  },

  },};

</script>

<style scoped>
    body{
        height:100%;
        min-height: 100vh;
        background: linear-gradient(5deg, #eaca49, #eae2af);
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: 'Futura';
        font-size: 20px;
        color: #333;
    }
    button{
        border:none;
        background: none;
        cursor: pointer;
    }

    .writeAnswer {
      position: fixed; /* Täcker hela skärmen */
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5); /* Halvgenomskinlig bakgrund */
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1;
      /*text-align: center;*/
    }

    .writeAnswerContent {
      background: white;
      padding: 20px;
      border-radius: 10px;
      text-align: center;
      width: 500px;
      font-family: 'Futura';
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .answerText {
      width: 100%;
      height: 30px;
      padding: 2px;
      margin: 15px 0;
      border: 2px solid #ccc;
      border-radius: 5px;
      font-family: 'Futura';
    }

    .submitDestinationButton {
      background: #2fc975;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: rgb(255, 255, 255);
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 20px;
      font-family: 'Futura';
    }

  .questionsView {
    display: flex;
    justify-content: center;
    align-items: center;
    margin:20px;
    text-align: center;
  }

  .answerRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 50px 0;
  gap: 20px;
}

.answerInput {
  padding: 10px;
  font-size: 17px;  
  border-radius: 10px;
  width: 500px;
}

.answerButton img{
  position: relative; /* Förbereder för användning av transform */
  top: 0;
  width: 798px; 
  height: 500px;
  cursor: grab;
  transition: transform 0.2s ease; /* Smidig rörelse vid drag */
}
.answerButton:active {
  cursor: grabbing;
}

.answerButtonContainer {
  position: fixed; /* Placera högst upp på skärmen */
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  
  
}



</style>


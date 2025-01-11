<template>
  <body :class="{ showBackground }">
    <div v-if="!cityQuestion">
      <div class="answerButtonContainer" @mousedown="startDrag" @mouseup="stopDrag" @mousemove="drag">
        <button type="button" class="answerButton" :style="{ transform: `translateY(${buttonOffset}px)` }">
          <img src="/public/nodbroms.png"/>
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
      <div v-if="noAnswer && isTimeOut" class="writeAnswer">
        <div class="writeAnswerContent">
          <h2> {{ noAnswer }}</h2>
          <p> {{ noAnswerText }}</p>
        </div>
      </div>
    </div>
    
    <div v-if="cityQuestion" class="questionsView">
      <div>
        <h2> {{ questionsAbout }} {{ currentCity }}</h2>
        <div class="answerRow">
          <h3>{{question1}}</h3>
          <input 
            type="text" 
            class="answerInput" 
            v-model="questionAnswers[0]" 
            :placeholder= "questionGuess" />
        </div>
        
        <div class="answerRow">
          <h3>{{question2}}</h3>
          <input 
            type="text" 
            class="answerInput" 
            v-model="questionAnswers[1]" 
            :placeholder= "questionGuess"/>
        </div>
        
        <button 
          class="submitDestinationButton" 
          @click="submitQuestionAnswers()">
          {{lockInCityQuestions}}
        </button>
        
        <div v-if="finalQuestionAnswers" class="writeAnswer">
          <div class="writeAnswerContent">
            <h2> {{ lockedAnswer }} </h2>
            <p v-for="(answer, index) in finalQuestionAnswers" :key="index"> 
              {{ question3 }} {{ index + 1 }}: {{ answer }}</p>
          </div>
        </div>
      </div>
    </div>
  </body>
</template>

<script>
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("currentNetwork"));
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
      timer: 30, 
      points: 10, 
      intervalId: null, 
      timeElapsed: 0,
      cityQuestion: false,
      level: null,
      currentCity: null,
      finalQuestionAnswers: null,
      isDragging: false, 
      dragDistance: 0,   
      maxDrag: 250, 
      buttonOffset: 0,
      showBackground: false,
      lastCity: false,
      noAnswer: false,
      isTimeOut: false,
    }
  },

  created: function () {
    this.pollId = this.$route.params.id;
    console.log("Användarnamn från sessionStorage:", this.user); 
    socket.on("gameStarted", (startTime) => {
      console.log("starttid mottagen:", startTime);
      this.startTimer(startTime);
    });

    socket.on( "uiLabels", labels => this.uiLabels = labels );

    socket.on("showQuestions", pollId => {
      this.cityQuestion = true;
      this.showBackground = false;
    });

    socket.on("updateCurrentCity", (data) => {
      if (data.currentCity) {
        this.currentCity = data.currentCity;
        console.log("Mottagen stad:", this.currentCity);
      }
    });

    socket.on("finalDestination", (pollId) => {
      this.lastCity = true;
    });
  
    socket.on("showScores", (pollId) => {
      if (pollId === this.pollId && !this.lastCity) {
        this.$router.push("/points/" + this.pollId);
      }
      else if (pollId === this.pollId && this.lastCity) {
        this.$router.push(`/podium/${this.pollId}`);
      }
    });

    socket.emit( "getUILabels", this.lang );
    socket.emit("joinPoll", this.pollId);
    socket.emit("requestStartTime", this.pollId);
    socket.emit("requestCode", this.pollId);     
    socket.emit("getCurrentParticipant", (data) => {
      this.participantName = data.name;
    });
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
    noAnswer() {
      return this.lang === "sv" ? playersSV.noAnswer : playersEN.noAnswer;
    },
    noAnswerText() {
      return this.lang === "sv" ? playersSV.noAnswerText : playersEN.noAnswerText;
    },
  },

  methods: {
    startTimer(startTime) {
      this.timeElapsed = Math.floor((Date.now() - startTime) / 1000);
      this.timer = 30 - (this.timeElapsed % 30);
      this.intervalId = setInterval(() => {
        if (this.timer > 0) {
          this.timer--;
        } else {
          if (this.points > 2) {
            this.points -= 2;
            console.log("Nu är vi på nivå för:", this.points, "poäng")
            this.timer =30; 
          } else if(!this.finalAnswer && this.points === 2 && !this.isTimeOut){
            this.stopTimer();
            this.isTimeOut = true;
            this.missingAnswer();
          }
        }
      }, 1000); 
    },

    stopTimer() {
      clearInterval(this.intervalId); 
    },

    missingAnswer() {
      this.noAnswer = true;
      socket.emit("answerSubmit", {user: this.user, pollId: this.pollId, type: 'destination', correctCity: this.currentCity, guess: "Inget svar", points: 0 });
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
          socket.emit("answerSubmit", {user: this.user, pollId: this.pollId, type: 'destination', correctCity: this.currentCity, guess: this.finalAnswer, points: this.points })
      }
      console.log("Svar skickat:", {user: this.user, pollId: this.pollId, guess: this.finalAnswer, points: this.points});
    },

    submitQuestionAnswers() {
      this.finalQuestionAnswers = [...this.questionAnswers];
      socket.emit("answerSubmit", {
        user: this.user,
        pollId: this.pollId,
        type: "questions",
        correctCity: this.currentCity,
        answers: [
          { questionNumber: 1, guess: this.questionAnswers[0] },
          { questionNumber: 2, guess: this.questionAnswers[1] },
        ],
      });
      this.resetAnswers();
      
    },

    resetAnswers() {
        this.destinationAnswers = [];
        this.questionAnswers = [];
        console.log("Tidigare resa och svar är rensade")
    },

    startDrag(event) {
      event.preventDefault();
      this.isDragging = true;
      this.dragStartY = event.clientY;
      window.addEventListener("mousemove", this.drag);
      window.addEventListener("mouseup", this.stopDrag);
    },

    drag(event) {
      if (this.isDragging) {
        const dragAmount = event.clientY - this.dragStartY;
        this.buttonOffset = Math.min(Math.max(dragAmount, 0), this.maxDrag);
        if (dragAmount >= this.maxDrag) {
          this.triggerButton();
          this.stopDrag(); 
        }
      }
    },

    stopDrag() {
      if (this.isDragging) {
        this.isDragging = false;
        window.removeEventListener("mousemove", this.drag);
        window.removeEventListener("mouseup", this.stopDrag);
        if (this.buttonOffset < this.maxDrag) {
          this.buttonOffset = 0; 
        }
      }
    },

    triggerButton() {
      console.log("Nödbromsen är aktiverad!");
      this.showBackground = true;
      this.submitAnswer = true;
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Agbalumo&family=Cormorant:wght@700&display=swap');

  body{
    height:100%;
    min-height: 100vh;
    background: linear-gradient(5deg, #eaca49, #eae2af);
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Futura', sans-serif;
    font-size: 20px;
    color: #333;
    background-size: 100% 100%;
  }
  body.showBackground {
    background: url('https://i.pinimg.com/originals/18/cb/4f/18cb4f4557956b5c72bab0e6c09e4ab3.gif') no-repeat center center, 
      linear-gradient(5deg, #eaca49, #eae2af);
    background-size: 100% 100%;
  }
  button{
    border:none;
    background: none;
    cursor: pointer;
  }
  .writeAnswer {
    position: fixed; 
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5); 
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
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
    position: relative; 
    top: 0;
    width: 798px; 
    height: 500px;
    cursor: grab;
    transition: transform 0.2s ease; 
  }
  .answerButton:active {
    cursor: grabbing;
  }
  .answerButtonContainer {
    position: fixed; 
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
  }
  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  .answerButton img {
    position: relative;
    top: 0;
    width: 798px;
    height: 500px;
    cursor: grab;
    transition: transform 0.2s ease; 
    animation: pulse 2s infinite, float 3s infinite; 
  }
  .answerButton:active {
    cursor: grabbing;
  }
  @media screen and (max-width: 50em) {
    .submitDestinationButton {
      font-size: 16px; 
      padding: 8px 16px; 
    }
    .answerInput {
      width: 100%; 
      font-size: 15px; 
    }
    .writeAnswerContent {
      width: 90%; 
      padding: 15px; 
    }
    .answerButton img {
      width: 300%; 
      height: auto; 
      object-fit: cover; 
      object-position: top center;
      right: 90%; 
    }
    .answerRow {
      flex-direction: column; 
      align-items: stretch; 
    }
    .questionsView h2 {
      font-size: 18px; 
      text-align: center;
    }
    body.showBackground {
      background-size: cover; 
    }
  }
</style>


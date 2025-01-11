<template>
  <body>
    <h1>{{destination}}: {{ this.currentCity }}</h1>
    <p v-if="questionAnswer && correctAnswers && correctAnswers.length > 0">
  <strong>Facit:</strong>
    <p v-for="(answer, index) in correctAnswers" :key="index">
      <strong>{{ index === 0 ? answerQuestion1 : answerQuestion2 }}:</strong> {{ answer }}
    </p>
</p>
      <div class="waitForAnswer">
        {{ waitForParticipantAnswer }}
      </div>

    <button class="questionButton" v-if ="!questionAnswer" @click="goToQuestions">{{questionsAboutCity}}</button>
    <div v-if="destinationAnswers.length > 0 && !questionAnswer">
      <div v-for="(answer, index) in destinationAnswers" :key="index" :class="['answerBox', answer.status]">
        <p><strong>{{player}}:</strong> {{ answer.name }}</p>
        <p><strong>{{guess}}:</strong> {{ answer.guess }}</p>
        <p><strong>{{points}}:</strong> {{ answer.points }}</p>
        <div v-if="answer.status === 'approved'">
          <p>{{status}}: <strong>{{confirm3}}</strong></p>
        </div>
        <div v-else-if="answer.status === 'rejected'">
          <p>{{status}}: <strong>{{decline}}</strong></p>
        </div>
        <div v-else>
          <div class="buttons">
            <button class="approve-btn" @click="approveAnswer(index)">{{confirm3}}</button>
            <button class="reject-btn" @click="rejectAnswer(index)">{{decline}}</button>
          </div>
        </div>
      </div>
      


    </div>
      
    <div v-if="questionAnswers.length > 0 && questionAnswer">
      <div v-for="(answer, index) in questionAnswers" :key="index" :class="['answerBox', answer.status]">
        <p><strong>{{player}}:</strong> {{ answer.name }}</p>
        <p><strong>{{answerQuestion1}}:</strong> {{ answer.answers[0].guess }}</p>
        
        <div v-if="!answer.confirmed" class="buttons">
          <button class="approve-btn" :class="{ active: answer.answers[0].status === 'approved' }" @click="toggleAnswerStatus(index, 0, 'approved')">
            {{confirm3}}
          </button>
          <button class="reject-btn" :class="{ active: answer.answers[0].status === 'rejected' }" @click="toggleAnswerStatus(index, 0, 'rejected')">
            {{decline}}
          </button>
          </div>

        <p><strong>{{answerQuestion2}}:</strong> {{ answer.answers[1].guess }}</p>
        <div v-if="!answer.confirmed" class="buttons">
          <button class="approve-btn" :class="{ active: answer.answers[1].status === 'approved' }" @click="toggleAnswerStatus(index, 1, 'approved')">
            {{confirm3}}
          </button>
          <button class="reject-btn" :class="{ active: answer.answers[1].status === 'rejected' }" @click="toggleAnswerStatus(index, 1, 'rejected')">
            {{decline}}
          </button>
        </div>

        <div v-if="!answer.confirmed">
          <button class="confirm-btn" @click="confirmAnswer(index)">{{confirm3}}</button>
        </div>

        <div v-if="answer.confirmed">
          <p><strong>{{points}}:</strong> {{ answer.points }}</p>
        </div>
        </div>
        
        <button class="questionButton" @click="goToScores">{{showScores}}</button>
    </div>
  </body>

</template>

<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");
import gameMasterSv from '@/assets/gameMaster-sv.json';
import gameMasterEn from '@/assets/gameMaster-en.json';
import answersSv from '/src/assets/answers-sv.json';
import answersEn from '/src/assets/answers-en.json';


//HALLOJI STUGAN
export default {
    name: "Answers",
    data: function () {
        return {
            pollId: "",
            uiLabels: {},
            lang: localStorage.getItem("lang") || "en",
            participants: [],
            selectedToGameCode: "",
            selectedCities: [],
            role: localStorage.getItem("role"), //Hämtar den tilldelade rollen som bestäms startView
            destinationAnswers: [],     
            questionAnswers: [],
            currentCity: null,
            questionAnswer: false,
        }
    },
    created: function () {
    this.pollId = this.$route.params.id;
    socket.on("updateCurrentCity", (data) => {
      if (data.currentCity) {
        this.resetAnswers();
        this.currentCity = data.currentCity;
        console.log("Ny mottagen stad:", this.currentCity);
      }
    });
    socket.on("submittedAnswersUpdate", (answers) => {
      console.log("inkommande svar:", answers);
      if (!this.questionAnswer) {
        this.destinationAnswers = answers.filter((a) => a.type === "destination");
      } else {
        this.questionAnswers = answers.filter((a) => a.type === "questions");
      }
      
      /*if (answers.length > 0) {
        this.currentAnswer = answers[0];
        console.log(this.currentAnswer);
      } else {
        this.currentAnswer = null;
      }*/
    });
    socket.emit("joinPoll", this.pollId);
    
    // Begär befintliga svar för denna omröstning
    socket.emit("getSubmittedAnswers", this.pollId);
  },

  computed: {
    destination() {
      return this.lang === "sv" ? gameMasterSv.destination : gameMasterEn.destination;
    },
    player() {
      return this.lang === "sv" ? gameMasterSv.player : gameMasterEn.player;
    },
    guess() {
      return this.lang === "sv" ? gameMasterSv.guess : gameMasterEn.guess;
    },
    points() {
      return this.lang === "sv" ? gameMasterSv.points : gameMasterEn.points;
    },
    status() {
      return this.lang === "sv" ? gameMasterSv.status : gameMasterEn.status;
    },
    confirm3() {
      return this.lang === "sv" ? gameMasterSv.confirm3 : gameMasterEn.confirm3;
    },
    decline() {
      return this.lang === "sv" ? gameMasterSv.decline : gameMasterEn.decline;
    },
    questionsAboutCity() {
      return this.lang === "sv" ? gameMasterSv.questionsAboutCity : gameMasterEn.questionsAboutCity;
    },
    waitForParticipantAnswer() {
      return this.lang === "sv" ? gameMasterSv.waitForParticipantAnswer : gameMasterEn.waitForParticipantAnswer;
    },
    answerQuestion1() {
      return this.lang === "sv" ? gameMasterSv.answerQuestion1 : gameMasterEn.answerQuestion1;
    },
    answerQuestion2() {
      return this.lang === "sv" ? gameMasterSv.answerQuestion2 : gameMasterEn.answerQuestion2;
    },
    showScores() {
      return this.lang === "sv" ? gameMasterSv.showScores : gameMasterEn.showScores;
    },
    
    correctAnswers() {
      const answers = this.lang === "sv" ? answersSv.svar : answersEn.answers;
      const result = answers[this.currentCity] || [];
      console.log('Facit', this.currentCity, result);
      return result;

  },
},


  methods: {
    approveAnswer(index) {
      const answer = this.destinationAnswers[index];
      if (answer) {
        answer.status = 'approved';
        socket.emit("updatePoints", {
          pollId: this.pollId,
          user: answer.name,
          points: answer.points,
        });
        console.log("Godkänt svar:", answer);
      }
    },  

    rejectAnswer(index) {
      //if (this.currentAnswer) {
        const answer = this.destinationAnswers[index];
        answer.status = "rejected";
        // Logik för att neka svaret
        socket.emit("rejectAnswer", {
          pollId: this.pollId,
          user: answer.name,
          points: 0,
        });
        console.log("Nekade svar:", answer);
        // Uppdatera visningen
        this.currentAnswer = null;
      },

      toggleAnswerStatus(index, questionIndex, status) {
        const answer = this.questionAnswers[index];
        const question = answer.answers[questionIndex];

        if (question.status === status) {
          question.status = null; // Nollställ status om samma knapp trycks igen
        } else {
          question.status = status; // Sätt till vald status
        }

        console.log(`Fråga ${questionIndex + 1} status ändrad till:`, question.status);
      },

      confirmAnswer(index) {
        const answer = this.questionAnswers[index];
        const correctCount = answer.answers.filter(q => q.status === 'approved').length;

        if (correctCount === 2) {
          answer.points = 3; // Alla rätt
          answer.status = "approved";
        } else if (correctCount === 1) {
          answer.points = 1; // En rätt
          answer.status = "partially-approved";
        } else {
          answer.points = 0; // Inga rätt
          answer.status = "rejected";
        }
        
        answer.confirmed = true;
        console.log("Bekräftade poäng efter frågor:", answer.points);

        socket.emit("confirmQuestionAnswers", {
          pollId: this.pollId,
          user: answer.name,
          points: answer.points,
        });
        this.updatePoints(answer.name, answer.points); 
      },
      
      goToQuestions() {
        console.log("stopMusic-händelse mottagen");
        socket.emit("stopMusic", this.pollId);
        this.questionAnswer = true;
        socket.emit("startQuestions", this.pollId);
      },

      goToScores(){
        socket.emit("showScores", this.pollId);
        this.$router.push('/points/' + this.pollId);
        //socket.emit("startScores", this.pollId)
      },
      updatePoints(user, points) {
        socket.emit("updatePoints", {
          pollId: this.pollId,
          user,
          points
        });
    },
      resetAnswers() {
        this.destinationAnswers = [];
        this.questionAnswers = [];
        this.currentCity = null;
        console.log("Tidigare resa och svar är rensade")
      },
  }
}
  //},
//}
  



</script>

<style scoped>
body {
    background: linear-gradient(to right, #d1e7ff, #d3bdf3);
    height:100%;
    min-height: 100vh;
    font-family: 'Futura';
    }

h1 {
  margin-top: 0px;
  padding-top: 30px;
}

.answerBox {
  background-color: white;
  border: 2px solid #ccc;
  border-radius: 10px;
  padding: 20px;
  margin: 20px auto;
  width: 80%;
  max-width: 600px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s, border-color 0.3s;
}

.approved {
  background-color: #d4edda; /* Ljusgrön */
  border-color: #28a745; /* Grön */
}

.rejected {
  background-color: #f8d7da; /* Ljusröd */
  border-color: #dc3545; /* Röd */
}

.answerBox.partially-approved {
  background-color: #fff3cd; /* Gul */
  border-color: #ffc107;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 5px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 20px;
}
.approve-btn {
  background-color: #5dba73e3;
  border:none;
  border-radius: 5px;
  font-size: 15px;
  font-family: 'Futura';

}
.reject-btn {
  background-color: #db6874;
  border: none;
  border-radius: 5px;
  font-size: 15px;
  font-family: 'Futura';

}

.approve-btn:hover, .reject-btn:hover {
  opacity: 0.8;
  cursor: pointer;
}

.questionButton {
  background-color: #94b8ee;
  border: 2px solid rgba(69, 87, 221, 0.717);
  margin: 10px;
  border-radius: 10px;
  font-family: 'Futura';
  font-size: 15px;
  width: 200px;
  height: 60px;
  position: fixed;
  bottom: 20px;
  right: 20px;

}

.questionButton:hover {
    transform: scale(1.1);
    cursor: pointer;
  }

  .approve-btn.active {
  background-color: #28a745; /* Grön */
  color: white;
}

.reject-btn.active {
  background-color: #dc3545; /* Röd */
  color: white;
}

.confirm-btn {
  background-color: #58a7fa; /* Blå */
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
  font-family: 'Futura';
}

.confirm-btn:hover {
  opacity: 0.9;
}
button:disabled {  
  opacity: 0.6; /* G%C3%B6r knappen genomskinlig */  
  cursor: not-allowed; /* Visar att knappen inte kan klickas */
}

.confirm-btn:disabled {
  background-color: #6c757d; /* Grå */
}

.waitForAnswer {
  font-size: 20px;
  font-family: 'Futura', sans-serif;
  margin: 30px 
}


</style>

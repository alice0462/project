<template>
  <body>
    <h1>Destination: {{ this.currentCity }}</h1>
    <div v-if="destinationAnswers.length > 0 && !questionAnswer">
      <div v-for="(answer, index) in destinationAnswers" :key="index" :class="['answerBox', answer.status]">
        <p><strong>Spelare:</strong> {{ answer.name }} 
          <strong>Gissning:</strong> {{ answer.guess }}
          <strong>Poäng:</strong> {{ answer.points }}
        </p>

        <p v-if="answer.status === 'approved'">Status: <strong>Godkänd</strong></p>
        <p v-else-if="answer.status === 'rejected'">Status: <strong>Nekad</strong></p>

      <div v-else class="buttons">
        <button class="approve-btn" @click="approveAnswer(index)">Godkänn</button>
        <button class="reject-btn" @click="rejectAnswer(index)">Neka</button>
      </div>
    </div>
    <button class="questionButton" @click="goToQuestions">Gå vidare till frågorna om staden</button>
    </div>
      
    <div v-if="questionAnswers.length > 0 && questionAnswer">
      <div v-for="(answer, index) in questionAnswers" :key="index" :class="['answerBox', answer.status]">
        <p><strong>Spelare:</strong> {{ answer.name }}</p>
        <p><strong>Svar på fråga 1:</strong> {{ answer.answers[0].guess }}</p>
        <div v-if="!answer.confirmed" class="buttons">
          <button class="approve-btn" :class="{ active: answer.answers[0].status === 'approved' }" @click="toggleAnswerStatus(index, 0, 'approved')">
            Godkänn
          </button>
          <button class="reject-btn" :class="{ active: answer.answers[0].status === 'rejected' }" @click="toggleAnswerStatus(index, 0, 'rejected')">
            Neka
          </button>
          </div>

        <p><strong>Svar på fråga 2:</strong> {{ answer.answers[1].guess }}</p>
        <div v-if="!answer.confirmed" class="buttons">
          <button class="approve-btn" :class="{ active: answer.answers[1].status === 'approved' }" @click="toggleAnswerStatus(index, 1, 'approved')">
            Godkänn
          </button>
          <button class="reject-btn" :class="{ active: answer.answers[1].status === 'rejected' }" @click="toggleAnswerStatus(index, 1, 'rejected')">
            Neka
          </button>
        </div>
        

        <div v-if="!answer.confirmed">
          <button class="confirm-btn" @click="confirmAnswer(index)">Bekräfta</button>
        </div>

        <div v-if="answer.confirmed">
          <p><strong>Poäng:</strong> {{ answer.points }}</p>
        </div>
        
        </div>
    </div>
  </body>

</template>

<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");


//HALLOJI STUGAN
export default {
    name: "Answers",
    data: function () {
        return {
            pollId: "",
            uiLabels: {},
            lang: localStorage.getItem("lang") || "en",
            participants: [],
            selectedLevel: "",
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
    console.log("hejhej")
    socket.on("updateCurrentCity", (data) => {
      if (data.currentCity) {
        this.currentCity = data.currentCity;
        console.log("Mottagen stad:", this.currentCity);
      }
    });
    socket.on("submittedAnswersUpdate", (answers) => {
      console.log("hejsvejs")
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
  methods: {
    approveAnswer(index) {
      //if (this.currentAnswer) {
        const answer = this.destinationAnswers[index];
        answer.status = "approved"
        // Logik för att godkänna svaret
        console.log("Godkände svar:", answer);
        socket.emit("approveAnswer", {
          pollId: this.pollId,
          user: answer.name,
          points: answer.points,
        });

        // Uppdatera visningen
        this.currentAnswer = null;
      },

    rejectAnswer(index) {
      //if (this.currentAnswer) {
        const answer = this.destinationAnswers[index];
        answer.status = "rejected";
        // Logik för att neka svaret
        console.log("Nekade svar:", answer);
        socket.emit("rejectAnswer", {
          pollId: this.pollId,
          user: answer.name,
          points: 0,
        });

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
      },

      goToQuestions() {
        this.questionAnswer = true;
        socket.emit("startQuestions", this.pollId);
        
      },
    },
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
  background-color: #72a4f0;
  border: 1px solid rgba(69, 87, 221, 0.717);
  border-radius: 5px;
  font-family: 'Futura';
  font-size: 17px;
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


</style>

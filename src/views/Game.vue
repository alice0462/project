<template>
    <body>
    <div class="gameSite">
        <div class="circle" v-if="!showQuestions">
            <div class="startTimer">
                {{ timer }}
            </div>
        </div>
        <div class="clues" v-if="showClues">
        <h2>{{ currentPoint }}</h2>
      <p>{{ currentClue }}</p>
    </div>
    
    <div class="final-city" v-if="showFinalCityMessage">
    {{ showCity() }}
    </div>

    <div class="city-questions" v-if="showQuestions">
    <h1>{{questionsAbout}} {{ this.currentCity }}</h1>
        <div v-for="(question, index) in currentQuestions" :key="index">
            <h3>{{questionNumber}} {{ index + 1 }}</h3>
            <p>{{ question }}</p>
        </div>
    </div>
    </div>
</body>
</template>

<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");
import cluesSv from '@/assets/clues-sv.json';
import questionsSv from '@/assets/questions-sv.json';
import cluesEn from '@/assets/clues-en.json';
import questionsEn from '@/assets/questions-en.json';
import cluesPointsSv from '@/assets/cluesPoints-sv.json';
import cluesPointsEn from '@/assets/cluesPoints-en.json';
import playersSv from '@/assets/players-sv.json';
import playersEn from '@/assets/players-en.json';




  export default {
    name: "Game",
    data: function () {
        return {
            pollId: "",
            timer: 5,
            cities: [],
            currentCityIndex: 0, // Vilken stad vi är på
            currentClueIndex: 0, // Vilken ledtråd i staden vi är på
            clues: {}, // Håller ledtrådarna för den aktuella staden
            showFinalCityMessage: false,
            showClues: true,
            showQuestions: false,
            thisPoint: 10,
            timeElapsed: 0,
            intervalId: null,
            lang: localStorage.getItem( "lang") || "en",
        };
    },

    computed: {
    currentCity() {
      // Hämta namnet på den aktuella staden
      return this.cities[this.currentCityIndex]?.name || "Unkown city";

    },
    currentClue() {
      // Hämta aktuell ledtråd baserat på stad och index
      
      //INNAN NYTT CARRO 7/1
      //const cityClues = cluesSv.ledtradar[this.currentCity] || [];
      //return cityClues[this.currentClueIndex] || "Inga fler ledtrådar.";

      //NYTT CARRO 7/1
      const cityClues = this.lang === "sv" ? cluesSv.ledtradar : cluesEn.clues;
      return cityClues[this.currentCity]?.[this.currentClueIndex] || "No more clues.";
    },

    currentQuestions(){
        //INNAN NYTT CARRO 7/1
        //const cityQuestions = questionsSv.fragor[this.currentCity] || [];
        //return cityQuestions

        //NYTT CARRO 7/1
        const cityQuestions = this.lang === "sv" ? questionsSv.fragor : questionsEn.questions;
        return cityQuestions[this.currentCity] || [];

    },
    currentPoint() {
        //return cluesPointsSv.poang[this.thisPoint] || "Okända poäng";
        //NYTT CARRO 7/1
        const points = this.lang === "sv" ? cluesPointsSv.points : cluesPointsEn.points;
        return points[this.thisPoint] || (this.lang === "sv" ? "Okända poäng" : "Unknown points");
        
    },
    questionNumber(){
        return this.lang === "sv" ? questionsSv.questionNumber : questionsEn.questionNumber;
    },
    questionsAbout(){
        return this.lang === "sv" ? playersSv.questionsAbout : playersEn.questionsAbout;
    },
},

//HEJSSANANNNNNANNADNND
    created: function () {
        socket.on( "uiLabels", labels => this.uiLabels = labels );
        socket.emit( "getUILabels", this.lang );

        this.pollId = this.$route.params.id;
        socket.on('chosenCities', (c) => {
            console.log("Valda städer mottagna:", c);
            this.cities = c;
            //this.startCountdown();
        }); // admin väljer när allt ska skickas ut
        socket.on("gameStarted", (startTime) => {
            console.log("Starttid mottagen:", startTime);
            this.startTimer(startTime);
        });
        socket.on("showQuestions", pollId => {
            this.showQuestions = true;
            this.showClues = false;
            this.showFinalCityMessage = false;
        })
        socket.emit("joinPoll", this.pollId);
        socket.emit("requestCities", this.pollId); // jag ber om informationen när jag går med i Game
        socket.emit("requestStartTime", this.pollId);
        //this.loadClues();
        //this.startCountdown();
        },
  
     methods: {

        /*loadClues() {
            const cityName = this.currentCity;
            if (cluesSv.ledtrådar[cityName]) {
                this.clues = cluesSv.ledtrådar[cityName];
                this.currentClueIndex = 0;
            } else {
                alert('finns inga ledtrådar för staden: ${cityName}')
                this.clues = [];
            }

            /*this.cities.forEach((city) => {
                if (cluesSv.ledtrådar[city.name]) {
                    this.clues[city.name] = cluesSv.ledtrådar[city.name];
                }
            });*/
            startTimer(startTime) {
                this.timeElapsed = Math.floor((Date.now() - startTime) / 1000) //Tid från när vi startade och nu i sek
                this.timer =5 - (this.timeElapsed % 5); 

                this.intervalId = setInterval (() => {
                    if (this.timer > 0) {
                        this.timer--; 
                    } else {
                        this.nextClueOrCity()
                        this.timer = 5;
                    }
                }, 1000); 
            },
        nextClueOrCity() {
            console.log(cluesSv)
            console.log(this.currentCity)
            socket.emit("currentCity", { currentCity: this.currentCity, pollId: this.pollId });
            if (
                this.currentClueIndex < cluesSv["ledtradar"][this.currentCity].length - 1
            ) {
                this.currentClueIndex++;
                this.nextPoint(); // visa nästa ledtråd från samma stad
            //} else if (this.currentCityIndex < this.selectedCities.length - 1) {
              //this.currentCityIndex++; // går till nästa stad
               // this.currentClueIndex = 0; // Börja med första ledtråden i nästa stad
            } 
            else {  // Alla städer och ledtrådar är visade
                this.showClues = false;
                this.showFinalCityMessage = true;
                 
                
                clearInterval(this.intervalId);
            }
        },
        showCity(){
            return `${this.uiLabels.reachedCity} ${this.currentCity}!`;
        },
        showQuestions(){
            this.showFinalCityMessage = false
        },
        nextPoint(){
                if (this.showClues && this.thisPoint > 2) {
                    this.thisPoint -= 2;
                }
            }
    }
};
</script>

<style scoped>
html, body {
    margin: 0px;
    padding: 0px;
    height: 100%;
}
.gameSite {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: linear-gradient(pink, rgb(246, 157, 199)) ;
    
}
h1 {
    font-family: 'Futura';
    color:#333;
    margin-top: 0px;
}


.clues {
    background-color: #d2e0e6; 
    padding: 20px;
    border-radius: 15px; 
    width: 60%; 
    max-width: 700px; 
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    color: black;
    font-size: 1.1rem;
    position: relative;
}

.circle {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    border: 5px solid black;;
    display: flex;
    position: relative;
    justify-self: end;
    background: yellow;
    top: 50px;
    margin-right: 50px;
    font-size: 50px;
    font-weight: bold;
    color: black;
    align-items: center; 
    justify-content: center;

}

.final-city{
    width: auto; 
    height: auto;
    color: black;
    font-weight: bold;
    font-size: 50px;
    text-align: center;
    
}
.city-questions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px; /* Lägger till mellanrum mellan rutorna */
}

.city-questions div {
    background-color: #d9f1ff; /* Ljusblå färg */
    margin: 5px auto 20px;
    padding: 20px;
    border-radius: 15px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    max-width: 600px;
    text-align: center;
    font-size: 1.2rem;
    font-family: 'Futura';
    color: #333;
}



</style>
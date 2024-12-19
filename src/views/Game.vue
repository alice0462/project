<template>
    <div class="gameSite">
        <div class="circle">
            <div class="startTimer">
                {{ timer }}
            </div>
        </div>
        <div class="clues" v-if="showClues">
        <h2>{{ currentPoint }}</h2>
      <p>{{ currentClue }}</p>
    </div>
    
    <button class="final-city" v-if="showFinalCityMessage" @click="showQuestions = true">
    {{ showCity() }}
    </button>

    <div class="city-questions" v-if="showQuestions" >
        {{ currentQuestions }}>
    </div>
    </div>
</template>

<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");
import cluesSv from '@/assets/clues-sv.json';
import questionsSv from '@/assets/questions-sv.json';
import cluesPoints from '@/assets/cluesPoints.json';

  export default {
    name: "Game",
    data: function () {
        return {
            pollId: "",
            timer: 30,
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
        };
    },

    computed: {
    currentCity() {
      // Hämta namnet på den aktuella staden
      return this.cities[this.currentCityIndex]?.name || "Okänd stad";

    },
    currentClue() {
      // Hämta aktuell ledtråd baserat på stad och index
      const cityClues = cluesSv.ledtradar[this.currentCity] || [];
      return cityClues[this.currentClueIndex] || "Inga fler ledtrådar.";
    },

    currentQuestions(){
        const cityQuestions = questionsSv.fragor[this.currentCity] || [];
        return cityQuestions
    },
    currentPoint() {
        return cluesPoints.points[this.thisPoint] || "Okända poäng";
    }
},

//HEJSSANANNNNNANNADNND
    created: function () {

        this.pollId = this.$route.params.id;
        socket.on('chosenCities', (c) => {
            console.log("Valda städer mottagna:", c);
            this.cities = c;
            //this.startCountdown();
        }); // admin väljer när allt ska skickas ut
        socket.on("gameStarted", (startTime) => {
            console.log("Starttid mottagen:", startTime);
            this.startTimer(startTime);
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
                this.timer = 30 - (this.timeElapsed % 30); 

                this.intervalId = setInterval (() => {
                    if (this.timer > 0) {
                        this.timer--; 
                    } else {
                        this.nextClueOrCity()
                        this.timer = 30;
                    }
                }, 1000); 
            },
        nextClueOrCity() {
            console.log(cluesSv)
            console.log(this.currentCity)
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
            return `Vi har kommit till ${this.currentCity}`;
        },
        showQuestions(){
            this.showFinalCityMessage = false
        },
        nextPoint(){
            if (this.showClues && this.thisPoint > 2) {
            this.thisPoint -= 2;      
    }
        },
       
 
    }
};
</script>

<style scoped>

.gameSite {
    height: 100vh;
    background: linear-gradient(pink, rgb(246, 157, 199)) ;
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
    background-color: #fad02a; 
    width: 300px; 
    height: 300px;
    color: black;
    font-size: 30px;
    
}
</style>
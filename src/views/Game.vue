<template>
    <div>
    <div class="gameSite">
        <div class="circle" v-if="!showQuestions && !showFinalCityMessage">
            <div class="startTimer">
                {{ timer }}
            </div>
        </div>
        <div class="headline" v-if="!showQuestions && !showFinalCityMessage">
            {{ uiLabels.headline }}
        </div>
        <div class="clues" v-if="showClues">
        <h3>{{ currentPoint }}</h3>
      <p>{{ currentClue }}</p>
    </div>
    
    <div class="final-city" v-if="showFinalCityMessage && !showQuestions" >
        {{ showCity() }}
    </div>

    <div class="city-questions" v-if="showQuestions">
        <p>{{questionsAbout}} {{ this.currentCity }}</p>
        <div v-for="(question, index) in currentQuestions" :key="index">
            <h3>{{questionNumber}} {{ index + 1 }}</h3>
            <p>{{ question }}</p>
        </div>
    </div>
    </div>
</div>
</template>

<script>
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("currentNetwork"));
import cluesSv from '@/assets/clues-sv.json';
import questionsSv from '@/assets/questions-sv.json';
import cluesEn from '@/assets/clues-en.json';
import questionsEn from '@/assets/questions-en.json';
import cluesPointsSv from '@/assets/cluesPoints-sv.json';
import cluesPointsEn from '@/assets/cluesPoints-en.json';
import playersSv from '@/assets/players-sv.json';
import playersEn from '@/assets/players-en.json';
import soundFile from '@/assets/lat.mp3';




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
            audio: null,
            lastCity: false,
        };
    },

    computed: {
    currentCity() {
      // Hämta namnet på den aktuella staden
      console.log("currentCityIndex:", this.currentCityIndex, "cities:", this.cities);
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
        console.log("currentCity:", this.currentCity, "questions:", cityQuestions);
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
        socket.on('fullGame', (data) => {
            console.log("Valda städer mottagna:", data.cities);
            this.cities = data.cities;
            this.currentCityIndex = data.currentCityIndex;
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
        socket.on("goToNextCity", (cityIndex) => {
        console.log("HALLIHALLÅ:", cityIndex);
        this.currentCityIndex = cityIndex;
            /*const cityIndex = this.cities.findIndex(city => city.name === data.currentCity.name);
            console.log("CITIES ARRAY:", this.cities);
            console.log("CURRENT CITY DATA:", data.currentCity);
            console.log("CityIndex:", cityIndex);
            if (cityIndex !== -1) {
                this.currentCityIndex = cityIndex;
                this.currentClueIndex = 0; // Återställ ledtrådsindex
                this.showClues = true; // Visa ledtrådar igen
                this.showFinalCityMessage = false;
                this.thisPoint = 10; // Återställ poäng
                //this.currentCity = data.currentCity;
                console.log("Ny mottagen stad:", this.currentCity);
            }*/
        
        });

        this.startBackgroundAudio();

        socket.on("stopMusic", () => {
            console.log("stopMusic-händelse mottagen i Game.vue");
            this.stopBackgroundAudio(); // Stoppa musiken
        });

    
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
                socket.emit("currentCity", { currentCity: this.currentCity, pollId: this.pollId });
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
            console.log("Nuvarande stad:",this.currentCity)
            
            if (
                this.currentClueIndex < cluesSv["ledtradar"][this.currentCity].length - 1) 
                {
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
            if (this.currentCityIndex === this.cities.length - 1) {
                this.lastCity = true;
                console.log(this.currentCityIndex, "och", this.cities.length - 1, "Sista staden:", this.lastCity);
                socket.emit("lastCity", this.pollId);
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
            },
        
        startBackgroundAudio() {
            this.audio = new Audio(soundFile); // Länk till din ljudfil
            this.audio.loop = true; // Ljudet spelas i en loop
            this.audio.play()
            console.log("Ljudet spelar")
        },
        stopBackgroundAudio() {
            if (this.audio) {
                console.log("Stoppar ljudet"); // Logga för att se om metoden körs
                this.audio.pause();
                this.audio.currentTime = 0; // Återställ ljudet
                } else {
                    console.log("Ingen ljudinstans hittades");
                }
        },
    },
};

</script>

<style scoped>
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
    font-family: 'Futura';
}

.circle {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    border: 5px solid black;;
    display: flex;
    background: yellow;
    font-size: 50px;
    font-weight: bold;
    color: black;
    align-items: center; 
    justify-content: center;
    top: 10px;
    right: 10px;

}

.final-city{
    width: auto; 
    height: auto;
    color: black;
    
    font-size: 60px;
    text-align: center;
    
}
.city-questions {
    position: absolute;
    font-size: 50px;
    font-family: 'Futura', sans-serif;
    top: 70px;
    justify-content: center;
    
   
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

.headline {
    position: absolute;
    font-size: 50px;
    font-family: 'Futura', sans-serif;
    top: 70px;
    justify-content: center;

}



</style>"
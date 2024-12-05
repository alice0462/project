<template>
  <body>
  <header>
    <div v-bind:class="['hamburger', {'close': !hideNav}]" 
         v-on:click="toggleNav">
    </div>
    <div class="logo">
      <!--<img src="/img/logo.png"> -->
      Destination Unknown 
      <!--<img src="../assets/logo.svg">-->
    </div>

    <button class="languageButtonClass" v-on:click="switchLanguage">
      {{ uiLabels.changeLanguage }}
    </button>
  </header>
  
  

  <!--<h1>{{ uiLabels["sales-pitch"] }}</h1>
  <h2>{{ uiLabels.subHeading }}</h2>
  <label>
    Write poll id: 
    <input type="text" v-model="newPollId">
  </label>
  -->
  <br>
  <img class="imageOfWorld" src="/public/Jordglob.png">
<br>
  <router-link to="/create/">
  <button class="mainButtons" id="createPollClass" >
      {{ uiLabels.createPoll }}
  </button>
  </router-link>

  <router-link v-bind:to="'/lobby/' + newPollId">
    <button class="mainButtons" id="participatePollClass">
    {{ uiLabels.participatePoll }}
    </button>
  </router-link>
  
  
    <button class="mainButtons" id="aboutClass" @click.prevent="showRulesText = true">
      {{ uiLabels.about }}  
    </button>


<div v-if="showRulesText" class="showRulesTextClass">
  <div class="showRulesTextClass-content">
    <span class="close" @click="closeRulesText">&times;</span>
    <h3>Spelregler</h3>
    <p>Vi besöker en okänd destination, en stad i världen, och ditt jobb är att lista ut vart vi är påväg!</p>
    <p>Du får höra ett antal ledtrådar ledtrådar värda 10p, 8p, 6p, 4p och 2p. Uppe i högra hörnet ser du en timer och du måste svara inom den givna tiden. När du tror du vet destinationen, drar du i nödbromsen och skriver in ditt svar!</p>
    <p>När destinationen är officiell, ska du svara på två frågor kopplade till destinationen. Rätt svar på 1 fråga ger 1 poäng, rätt svar på 2 frågor ger 3 poäng. Den med flest poäng när spelet avslutas vinner!</p>
  </div>
</div>
</body>
</template>

<script>



import ResponsiveNav from '@/components/ResponsiveNav.vue';
import io from 'socket.io-client';
const socket = io("localhost:3000");

export default {
  name: 'StartView',
  components: {
    ResponsiveNav
  },
  data: function () {
    return {
      uiLabels: {},
      newPollId: "",
      somePollId: "",
      lang: localStorage.getItem( "lang") || "en",
      hideNav: true,
      showRulesText: false
    }
  },
  created: function () {
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.emit( "getUILabels", this.lang );
  },
  methods: {
    switchLanguage: function() {
      if (this.lang === "en") {
        this.lang = "sv"
      }
      else {
        this.lang = "en"
      }
      localStorage.setItem( "lang", this.lang );
      socket.emit( "getUILabels", this.lang );
    },
    toggleNav: function () {
      this.hideNav = ! this.hideNav;
    },
    closeRulesText () {
      this.showRulesText = false;
    }
  }
}
</script>
<style scoped>
  body{
    background: linear-gradient(5deg, rgb(123, 168, 205), #d3d3f5);
    height: 100%; 
    min-height: 100vh;
    width: 100%;  
  }
  header {
    background: linear-gradient(5deg, #d3d3f5), rgb(123, 168, 205);
    width: 100%;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
  }
  .logo {
    text-transform: uppercase;
    letter-spacing: 0.25em;
    font-size: 50px;
    color: white;
    padding-top:0.2em;
    text-align: center;
  }
  .logo img {
    height:2.5rem;
    vertical-align: bottom;
    margin-right: 0.5rem; 
  }
  .hamburger {
    color:rgb(222, 223, 223);
    width:1em;
    display: flex;
    align-items: center;
    justify-content: left;
    padding:0.5rem;
    top:0;
    left:0;
    height: 2rem;
    cursor: pointer;
    font-size: 1.5rem;
  }

@media screen and (max-width:50em) {
  .logo {
    font-size: 5vw;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .hamburger::before {
    content: "☰";
  }
  .close::before {
    content: "✕";
  }
  .hide {
    left:-12em;
  }
}

.mainButtons {
  color: rgb(79, 80, 80);
  font-family: "futura";
  font-size: 30px;
  height: 120px;
  width: 300px;
  border-radius: 20px;
  margin: 70px 20px;
  cursor: pointer;
}

#createPollClass {
  background: linear-gradient(5deg, #ffa82f, #eaceaf);
}
#participatePollClass {
  background: linear-gradient(5deg, #47a657, #bbf8bb);
}
#aboutClass {
  background: linear-gradient(5deg, #ad5c99, #fdc8ec);
}
.languageButtonClass{
  color: black;
  background: linear-gradient(5deg, #7fa8c3, #9f9ff2);
  border-radius: 15px;
  font-family: "futura";
  font-size: 17px;
  height: 80px;
  width:150px;
  justify-self: end;
  margin: 10px;
  cursor: pointer;
}
.imageOfWorld {
height: 27%;
width: 27%;
}




.showRulesTextClass {
  position: fixed;
  z-index: 1; 
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); 
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "futura";
}

.showRulesTextClass-content {
  background-color: #d2e0e6; 
  padding: 20px;
  border-radius: 15px; 
  width: 60%; 
  max-width: 700px; 
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2); /* Skugga */
  color: black;
  font-size: 1.1rem;
  position: relative;
}

.close {
  color: #333;
  font-size: 24px;
  font-weight: bold;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}
</style>

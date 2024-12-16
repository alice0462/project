<template>
  <body>
  <header>
    <button class="languageButtonClass" v-on:click="switchLanguage">
      <img :src="languageFlag" alt="Switch Language" />
    </button>
    

    <div class="logo">
      <!--<img src="/img/logo.png"> -->
      Destination Unknown 
      <!--<img src="../assets/logo.svg">-->
    </div>
    

    <button class="ruleButton" @click="showRulesText = true" >
      {{ uiLabels.about }}</button>

      <div v-bind:class="['hamburger', {'close': !hideNav}]" 
         v-on:click="toggleNav">
    </div>

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

    <button class="mainButtons" id="createPollClass" v-on:click="createPoll">
      {{ uiLabels.createPoll }}</button>


    <button class="mainButtons" id="participatePollClass" v-on:click="participatePoll">
      {{ uiLabels.participatePoll }}
    </button>

  <router-link to="/poll/">
    <button class="mainButtons" id="screenViewerClass" v-on:click="screenViewer">
      {{ uiLabels.screenViewer }}
    </button>
  </router-link>
  <!-- */<button class="mainButtons" id="rulesClass" @click="showRulesText = true" >
    {{ uiLabels.about }}</button>-->


 <!-- <router-link v-bind:to="'/lobby/' + newPollId">
    <button class="mainButtons" id="participatePollClass">
    {{ uiLabels.participatePoll }}
    </button>
  </router-link>-->


<div v-if="showRulesText" class="showRulesTextClass">
  <div class="showRulesTextClass-content">
    <span class="close" @click="closeRulesText">&times;</span>
    <h3> {{ uiLabels.rulesTitle }}</h3>
    {{ uiLabels.rules }}
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
      showRulesText: false,
      pollId:""
    }
  },
  created: function () {
    socket.on( "uiLabels", labels => this.uiLabels = labels );
    socket.emit( "getUILabels", this.lang );
  },
  computed:{
    languageFlag () {
      return this.lang === "en"
      ? "/public/svensk-flagga.png"
      : "/public/brittisk-flagga.png";
    }
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
    },
    createPoll: function () {
      this.pollId = Math.floor(1000 + Math.random() * 9000);
      console.log(this.pollId);
      socket.emit("createPoll", {pollId: this.pollId, lang: this.lang });
      this.$router.push("/create/" + this.pollId);
    },
    participatePoll: function() {
      this.$router.push("/prelobby/");
    },
    screenViewer: function() {

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
  margin: 0 20px 20px;
  cursor: pointer;
}

#createPollClass {
  background: linear-gradient(5deg, #ffa82f, #eaceaf);
}
#participatePollClass {
  background: linear-gradient(5deg, #47a657, #bbf8bb);
}
#rulesClass {
  background: linear-gradient(5deg, #ad5c99, #fdc8ec);
}
#screenViewerClass {
  background: linear-gradient(5deg, #4a90e2, #a4d3f8); /* Anpassa färger */
}

.languageButtonClass {
  padding: 10px; /* Tar bort inre mellanrum */
  margin: 0; /* Tar bort yttre mellanrum */
  overflow: hidden; /* Förhindrar att innehållet sticker ut */
  border: none; /* Tar bort standardkant */
  width: 100px; /* Ställ in knappens bredd */
  height: 60px; /* Ställ in knappens höjd */
  display: flex; /* Gör det till en flexbehållare */
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: none; /* Tar bort bakgrundsfärg */
}

.imageOfWorld {
height: 27%;
width: 27%;
margin-bottom: 60px;
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
.languageButtonClass img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ruleButton {
  color: rgb(79, 80, 80);
  font-family: "futura";
  font-size: 14px;
  height: 50px;
  width: 120px;
  border-radius: 5px;
  margin: 15px;
  cursor: pointer;
  background: linear-gradient(5deg, #fae0fad8, #fdc8ecb1);
  justify-self: end;
}


</style>

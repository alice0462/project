<template>
  <body>
    <div v-if="currentAnswer">
      <h1>Godkänn eller Neka svar</h1>
      <div class="answer-box">
        <p>{{ currentAnswer.text }}</p>
      </div>
      <div class="buttons">
        <button class="approve-btn" @click="approveAnswer">Godkänn</button>
        <button class="reject-btn" @click="rejectAnswer">Neka</button>
      </div>
    </div>
    <div v-else>
      <h2>Alla svar har granskats!</h2>
    </div>
  </body>
</template>

<script>
import io from 'socket.io-client';
const socket = io("localhost:3000");
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
        }
    },
    created: function () {
    this.pollId = this.$route.params.id;
  }
  }



</script>

<style scoped>
body {
    background: linear-gradient(to right, #d1e7ff, #d3bdf3);
    height:100%;
    min-height: 100vh;
    }
</style>

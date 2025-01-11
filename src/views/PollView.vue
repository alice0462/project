<template>
  <div class="landing-page">
    <div class="background-image">
      <h1>DESTINATION UNKNOWN</h1>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client';
const socket = io(sessionStorage.getItem("currentNetwork"));

export default {
  name: "Lobby",
  data: function () {
    return {
      pollId: "",
      uiLabels: {},
      lang: localStorage.getItem("lang") || "en",
      participants: [],
      selectedToGameCode: "",
      selectedCities: [],
      role: localStorage.getItem("role"), 
    }
  },
  
  created: function () {
    socket.on("goToLobby", pollId => {
      localStorage.setItem("role", "screen");
      this.$router.push("/lobby/" + pollId);
    });
    socket.emit("registerScreen");
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@400;700&display=swap');

  .landing-page {
    height: 100vh; 
    width: 100%; 
    display: flex;
    justify-content: center; 
    align-items: center; 
    overflow: hidden; 
  }
  .background-image {
    background-image: url('https://www.airfaregeeks.com.au/wp-content/uploads/2022/01/Banner-Travel-the-world.jpeg'); 
    background-size: cover; 
    background-position: center; 
    height: 100%; 
    width: 100%; 
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  h1 {
    font-family: 'Exo 2'; 
    font-size: 5rem;
    font-weight: bold;
    color: rgb(0, 0, 0);
    text-shadow: 2px 2px 10px rgba(124, 178, 255, 0.7); 
    text-align: center;
    z-index: 2;
  }
  @media screen and (max-width: 60em) {
    .landing-page {
      flex-direction: column; 
      padding: 20px; 
    }
    h1 {
      font-size: 3rem; 
      text-shadow: 1px 1px 5px rgba(124, 178, 255, 0.5); 
    }
  }
</style>


<template>
    <div class="gameSite">
        <div class="circle">
            <div class="startTimer">
                {{ timer }}
            </div>
        </div>
    <div class="clues">
        ledtrådar
    </div>    
    </div>
</template>

<script>
  export default {
    name: "Game",
    data: function () {
        return {
            pollId: "",
            timer: 60,
            cities: [],

        }
    },
    created: function () {
        this.pollId = this.$route.params.id;
        this.startCountdown();
        },
  
     methods: {
        startCountdown: function () {
            this.timer = 60; 
            this.intervalId = setInterval(() => {
        if (this.timer > 0) {
            this.timer--; 
        } else {
            clearInterval(this.intervalId); 
            this.intervalId = null;
        }
        }, 1000); 
        }   
        
    }
};

</script>

<style scoped>

.gameSite {
    height: 100vh;
    background: linear-gradient(pink, rgb(246, 157, 199)) ;
}

.clues {
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
</style>
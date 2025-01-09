function sockets(io, socket, data) {
  
  socket.on('getUILabels', function(lang) {
    socket.emit('uiLabels', data.getUILabels(lang));
  });

  socket.on('createPoll', function(d) {
    data.createPoll(d.pollId, d.lang)
    socket.emit('pollData', data.getPoll(d.pollId));
  });

  socket.on('addQuestion', function(d) {
    data.addQuestion(d.pollId, {q: d.q, a: d.a});
    socket.emit('questionUpdate', data.getQuestion(d.pollId));
  });

  socket.on('joinPoll', function(pollId) {
    socket.join(pollId);
    socket.emit('questionUpdate', data.getQuestion(pollId))
    socket.emit('submittedAnswersUpdate', data.getSubmittedAnswers(pollId));
  });

  socket.on('participateInPoll', function(d) {
    data.participateInPoll(d.pollId, d.name);
    io.to(d.pollId).emit('participantsUpdate', data.getParticipants(d.pollId));
  });
  socket.on('startPoll', function(pollId) {
    io.to(pollId).emit('startPoll');
  })
  socket.on('runQuestion', function(d) {
    let question = data.getQuestion(d.pollId, d.questionNumber);
    io.to(d.pollId).emit('questionUpdate', question);
    io.to(d.pollId).emit('submittedAnswersUpdate', data.getSubmittedAnswers(d.pollId));
  });

  socket.on('submitAnswer', function(d) {
    data.submitAnswer(d.pollId, d.answer);
    io.to(d.pollId).emit('submittedAnswersUpdate', data.getSubmittedAnswers(d.pollId));
  }); 

  socket.on("sendCities", (d) => {
    console.log("Valda städer:", d);
    data.addCities(d.pollId, d.data);
    socket.emit('chosenCities', data.getCities(d.pollId))
    // Broadcast till alla anslutna klienter
    //io.to(d.pollId).emit("selectedCities", d);//
  });

  socket.on("sendLevel", (d) => {
    console.log("Mottagen nivå:", d);
    data.setLevel(d.pollId, d.data);
    socket.emit("selectedLevel", data.getLevel(d.pollId));
    // Broadcast till alla anslutna klienter
  });

  socket.on("getParticipants", pollId => {
    io.to(pollId).emit('participantsUpdate', data.getParticipants(pollId))
  });

  socket.on("requestCities", pollId => {
    socket.emit('chosenCities', data.getCities(pollId))
  });

  socket.on("requestLevel", pollId => {
    socket.emit('selectedLevel', data.getLevel(pollId))
  });

  socket.on("currentCity", (d) => {
    console.log("Aktuell stad skickas:", d.currentCity, "för pollId:", d.pollId);
    io.to(d.pollId).emit("updateCurrentCity", { currentCity: d.currentCity });
  });




  //socket.on("sendCities", (d) => {
    //console.log("Mottagna städer med index:", d.data.cities);
    //data.addCities(d.pollId, d.data); // Spara datan (städer med index)
  //});

  socket.on("getCurrentParticipant", (d) => {
  })

  /*socket.on("answerSubmit", (d) => {
    console.log("Mottog answerSubmit med data:", d);
    data.destinationAnswer(d.user, d.pollId, d.type, d.guess, d.points)
    const updatedAnswers = data.getSubmittedAnswers(d.pollId);
    io.to(d.pollId).emit('submittedAnswersUpdate', data.getSubmittedAnswers(d.pollId));
    console.log("Uppdaterade svar som skickas:", updatedAnswers, d.pollId);

  });*/

  socket.on("answerSubmit", (d) => {
    console.log("Mottog answerSubmit med data:", d);
    if (d.type === "destination") {
      data.destinationAnswer(d.user, d.pollId, d.type, d.guess, d.points);
    } else if (d.type === "questions") {
        data.submitQuestionAnswers(d.user, d.pollId, d.answers);
      
    }
    const updatedAnswers = data.getSubmittedAnswers(d.pollId);
    io.to(d.pollId).emit("submittedAnswersUpdate", updatedAnswers);
  });

  socket.on("startGame", pollId => {
    data.startTime(pollId);
    io.to(pollId).emit("gameStarted", data.startTime(pollId));
    console.log("Spelet startade för pollId:", pollId, "med starttid:", data.startTime(pollId));
  });
  
  socket.on("registerScreen", () => {
    console.log("Storskärm registrerad:", socket.id);
    socket.join("screens"); // Lägg storskärmen i ett unikt rum
  });

  socket.on("updateScreen", pollId => {
    io.to("screens").emit("goToLobby", pollId);
  });

  socket.on("requestStartTime", pollId => {
    socket.emit('gameStarted', data.startTime(pollId))
  });

  socket.on("startQuestions", pollId => {
    io.to(pollId).emit("showQuestions", pollId);
  });

  socket.on("startScores", pollId => {
    io.to(pollId).emit("showScores", data.showScores(pollId));
  })

  socket.on("updatePoints", (d) => {
    console.log(`Uppdaterar poäng för användare ${d.user}:`, d.points);
    data.addPoints(d.pollId, d.user, d.points); // Lägg till poäng
    //io.to(d.pollId).emit("participantLeaderbord", data.getParticipants(d.pollId)); // Skicka uppdaterade deltagarlistan
  });

  socket.on("getScores", pollId => {
    console.log("inne i getScores, pollID:", pollId)
    io.to(pollId).emit("participantLeaderbord", data.getParticipants(pollId));
  });

}



export { sockets };
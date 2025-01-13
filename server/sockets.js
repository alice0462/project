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
  });

  socket.on("sendToGamecode", (d) => {
    console.log("Gå till spelkod:", d);
    data.readySetGo(d.pollId, d.data);
    socket.emit("selectedToGameCode", data.getCode(d.pollId));
  });

  socket.on("getParticipants", pollId => {
    io.to(pollId).emit('participantsUpdate', data.getParticipants(pollId))
  });

  socket.on("requestCities", pollId => {
    socket.emit('fullGame', data.getPoll(pollId))
  });

  socket.on("requestCode", pollId => {
    socket.emit('selectedToGameCode', data.getCode(pollId))
  });

  socket.on("currentCity", (d) => {
    console.log("Aktuell stad skickas:", d.currentCity, "för pollId:", d.pollId);
    io.to(d.pollId).emit("updateCurrentCity", { currentCity: data.getCurrentCity (d.pollId) });
  });

  socket.on("showScores", (pollId) => {
    console.log(`Visa poängställning för omröstning ${pollId}`);
    socket.to(pollId).emit("showScores", pollId); 
  });

  socket.on("getCurrentParticipant", (d) => {
  });

  socket.on("answerSubmit", (d) => {
    console.log("Mottog answerSubmit med data:", d);
    if (d.type === "destination") {
      data.destinationAnswer(d.user, d.pollId, d.type, d.correctCity, d.guess, d.points);
    } else if (d.type === "questions") {
        data.submitQuestionAnswers(d.user, d.pollId, d.correctCity, d.answers);
      
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
    socket.join("screens");
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
    data.addPoints(d.pollId, d.user, d.points); 
    io.to(d.pollId).emit("participantLeaderbord",  data.getLeaderboard(d.pollId));
  });

  socket.on("getScores", pollId => {
    console.log("inne i getScores, pollID:", pollId);
    console.log("Skickar leaderboard", data.getLeaderboard(pollId));
    io.to(pollId).emit("participantLeaderbord",  data.getLeaderboard(pollId));
  });

  socket.on("nextCity", (pollId) => {
  const nextCity = data.getNextCity(pollId);
  if (nextCity !== null) {
    data.updateStartTime(pollId);
    data.resetAnswer(pollId);
    console.log(`Nästa stad för pollId ${pollId}:`, nextCity); 
    console.log("HÅLLKÄFTEN");
    io.to(pollId).emit("goToNextCity", nextCity); 
  } else {
    console.log("Inga fler städer för pollId:", pollId);
    io.to(pollId).emit("endOfJourney"); 
  }
  });

  socket.on("lastCity", (pollId) => {
    io.to(pollId).emit("finalDestination", pollId);
  });

  socket.on("nextView", (pollId) => {
    io.to(pollId).emit("sendNextView", pollId);
  });

  socket.on("stopMusic", (pollId) => {
    console.log(`Stoppa musiken för pollId: ${pollId}`);
    io.to(pollId).emit("stopMusic"); 
  });

  socket.on("stopSecondMusic", (pollId) => {
    console.log(`Stoppa musiken för pollId: ${pollId}`);
    io.to(pollId).emit("stopSecondMusic"); 
  });

  socket.on("resetGame", (pollId) => {
    console.log(`Återställer spelet för pollId: ${pollId}`);
    io.to(pollId).emit("gameReset");
  });
}



export { sockets };
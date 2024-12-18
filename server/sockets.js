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
    // Broadcast till alla anslutna klienter
  });

  socket.on("getParticipants", pollId => {
    io.to(pollId).emit('participantsUpdate', data.getParticipants(pollId))
  });

  socket.on("requestCities", pollId => {
    socket.emit('chosenCities', data.getCities(pollId))
  })



  //socket.on("sendCities", (d) => {
    //console.log("Mottagna städer med index:", d.data.cities);
    //data.addCities(d.pollId, d.data); // Spara datan (städer med index)
  //});

}



export { sockets };
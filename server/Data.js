'use strict';
import {readFileSync} from "fs";

// Store data in an object to keep the global namespace clean. In an actual implementation this would be interfacing a database...
function Data() {
  this.polls = {};
  this.polls['test'] = {
    lang: "en",
    questions: [
      {q: "How old are you?", 
       a: ["0-13", "14-18", "19-25", "26-35", "36-45","45-"]
      },
      {q: "How much do you enjoy coding?", 
       a: ["1", "2", "3", "4", "5"]
      }
    ],
    answers: [],
    currentQuestion: 0,
    participants: [],
  }
}

/***********************************************
For performance reasons, methods are added to the
prototype of the Data object/class
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
***********************************************/

Data.prototype.pollExists = function (pollId) {
  return typeof this.polls[pollId] !== "undefined"
}

Data.prototype.getUILabels = function (lang) {
  //check if lang is valid before trying to load the dictionary file
  if (!["en", "sv"].some( el => el === lang))
    lang = "en";
  const labels = readFileSync("./server/data/labels-" + lang + ".json");
  return JSON.parse(labels);
}

Data.prototype.createPoll = function(pollId, lang="en") {
  if (!this.pollExists(pollId)) {
    let poll = {};
    poll.lang = lang;  
    poll.questions = [];
    poll.answers = [];
    poll.participants = [];
    poll.currentQuestion = 0;
    poll.cities = [],
    poll.level = "",
    poll.guesses = [],              
    this.polls[pollId] = poll;
    console.log("poll created", pollId, poll);
  }
  return this.polls[pollId];
}

Data.prototype.getPoll = function(pollId) {
  if (this.pollExists(pollId)) {
    return this.polls[pollId];
  }
  return {};
}

Data.prototype.participateInPoll = function(pollId, name) {
  console.log("participant will be added to", pollId, name);
  if (this.pollExists(pollId)) {
    this.polls[pollId].participants.push({name: name})
  }
}


Data.prototype.getParticipants = function(pollId) {
  const poll = this.polls[pollId];
  console.log("participants requested for", pollId);
  if (this.pollExists(pollId)) { 
    console.log(this.polls[pollId].participants);
    return this.polls[pollId].participants;
  }
  return [];
}

Data.prototype.addQuestion = function(pollId, q) {
  if (this.pollExists(pollId)) {
    this.polls[pollId].questions.push(q);
  }
}

Data.prototype.getQuestion = function(pollId, qId = null) {
  if (this.pollExists(pollId)) {
    const poll = this.polls[pollId];
    if (qId !== null) {
      poll.currentQuestion = qId;
    }
    return poll.questions[poll.currentQuestion];
  }
  return {}
}

Data.prototype.getSubmittedAnswers = function(pollId) {
  if (this.pollExists(pollId)) {
    const poll = this.polls[pollId];
    const answers = poll.answers[poll.currentQuestion];
    if (typeof poll.questions[poll.currentQuestion] !== 'undefined') {
      return answers;
    }
  }
  return {}
}

Data.prototype.submitAnswer = function(pollId, answer) {
  if (this.pollExists(pollId)) {
    const poll = this.polls[pollId];
    let answers = poll.answers[poll.currentQuestion];
    // create answers object if no answers have yet been submitted
    if (typeof answers !== 'object') {
      answers = {};
      answers[answer] = 1;
      poll.answers.push(answers);
    }
    // create answer property if that specific answer has not yet been submitted
    else if (typeof answers[answer] === 'undefined') {
      answers[answer] = 1;
    }
    // if the property already exists, increase the number
    else
      answers[answer] += 1
    console.log("answers looks like ", answers, typeof answers);
  }
}

Data.prototype.addCities = function(pollId, data) {
  console.log(data);
  //this.polls[pollId] = { pollId: pollId }; // Skapar en ny objektstruktur
  this.polls[pollId].cities = data.cities; // Tilldelar cities till objektet
  console.log("INFO!!!!:", data)
};

Data.prototype.setLevel = function(pollId, data) {
  console.log(data);
  //this.polls[pollId] = { pollId: pollId }; // Skapar en ny objektstruktur
  this.polls[pollId].level = data.level;
  console.log("INFO!!!!:", data);
  console.log(this.polls[pollId])
};

Data.prototype.getCities = function(pollId, data) {
  const poll = this.polls[pollId];
  console.log("cities requested for:", pollId);
  if (this.pollExists(pollId)) {
    console.log(this.polls[pollId].cities);
    return this.polls[pollId].cities;
  }
  return [];
}
Data.prototype.destinationAnswer = function(user, pollId, guess) {
  console.log("Sparar svar för:", user, pollId, guess);

  if (this.pollExists(pollId)) {
    const poll = this.polls[pollId];

    // Kontrollera att guesses finns
    if (!poll.guesses) {
      poll.guesses = [];
    }

    // Kontrollera om användaren redan har skickat ett svar
    const existingAnswer = poll.guesses.find(g => g.name === user);
    if (existingAnswer) {
      existingAnswer.guess = guess; // Uppdatera tidigare svar
      console.log("Svar uppdaterat för:", user, guess);
    } else {
      poll.guesses.push({ name: user, guess: guess });
      console.log("Nytt svar sparat för:", user, guess);
    }
  } else {
    console.log("Poll finns inte:", pollId);
  }
};
Data.prototype.getSubmittedAnswers = function(pollId) {
  console.log("Hämtar svar för pollId:", pollId);

  // Kontrollera om omröstningen existerar i datalagret
  if (this.pollExists(pollId)) {
    const poll = this.polls[pollId];
    console.log("Hittade omröstning:", poll);

    // Returnera listan av guesses om den existerar, annars en tom array
    return poll.guesses || [];
  } else {
    console.log("Poll finns inte för getSubmittedAnswers:", pollId);
    return [];
  }
};


export { Data };




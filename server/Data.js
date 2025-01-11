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
    scores: []
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
    poll.startTime = null,    
    poll.points = 0;        
    this.polls[pollId] = poll;
    poll.currentCityIndex = 0;
    poll.lastCity = false;
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

Data.prototype.addPoints = function(pollId, user, points) {
  if (this.pollExists(pollId)) {
    const poll = this.polls[pollId];

    // Leta efter deltagaren
    const participant = poll.participants.find(p => p.name === user);
    participant.points = (participant.points || 0) + points; // Addera poängen
    
    console.log(`Totala poäng för ${user}:`, participant ? participant.points : points);
  } else {
    console.log(`Poll finns inte: ${pollId}`);
  }
};


/*Data.prototype.getLeaderboard = function (pollId) {
  if (this.pollExists(pollId)) {
    return this.polls[pollId].participants.map(p => ({
      name: p.name,
      points: p.points || 0, // Om deltagaren inte har några poäng ännu, sätt till 0
    }));
  }
  return [];
};*/

Data.prototype.getLeaderboard = function (pollId) {
  if (this.pollExists(pollId)) {
    const leaderboard = [];
    for (const participant of this.polls[pollId].participants) {
      leaderboard.push({
        name: participant.name,
        points: participant.points || 0
      });
    }
    return leaderboard;
  }
  return [];
};

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

/*Data.prototype.readySetGo = function(pollId, data) {
  console.log(data);
  //this.polls[pollId] = { pollId: pollId }; // Skapar en ny objektstruktur
  this.polls[pollId].level = data.level;
  console.log("INFO!!!!:", data);
  console.log(this.polls[pollId])
};*/

Data.prototype.getCities = function(pollId, data) {
  const poll = this.polls[pollId];
  console.log("cities requested for:", pollId);
  if (this.pollExists(pollId)) {
    console.log(this.polls[pollId].cities);
    return this.polls[pollId].cities;
  }
  return [];
}

Data.prototype.getCode = function(pollId, data) {
  const poll = this.polls[pollId];
  console.log("level requested for:", pollId);
  if(this.pollExists(pollId)) {
    console.log(this.polls[pollId].level);
    return this.polls[pollId].level;
  }
  return [];
}

Data.prototype.destinationAnswer = function(user, pollId, type, guess, points) {
  console.log("Sparar svar för:", user, pollId, type, guess, points);

  if (this.pollExists(pollId)) {
    const poll = this.polls[pollId];

    // Kontrollera att guesses finns
    if (!poll.guesses) {
      poll.guesses = [];
    }

    // Kontrollera om användaren redan har skickat ett svar
    const existingAnswer = poll.guesses.find(g => g.name === user && g.type === "destination");
    if (existingAnswer) {
      existingAnswer.guess = guess; // Uppdatera tidigare svar
      existingAnswer.points = points;
      console.log("Destinationssvar uppdaterat för:", user, guess, points);
    } else {
      poll.guesses.push({ name: user, type: "destination", guess: guess, points: points });
      console.log("Nytt svar sparat för:", user, guess, points);
    }
  } else {
    console.log("Poll finns inte:", pollId);
  }
};

Data.prototype.submitQuestionAnswers = function (user, pollId, answers) {
  if (this.pollExists(pollId)) {
    const poll = this.polls[pollId];

    if (!poll.guesses) {
      poll.guesses = [];
    }

    const userAnswers = poll.guesses.find(g => g.name === user && g.type === "questions");

    if (userAnswers) {
      userAnswers.answers = answers; // Uppdatera befintliga svar
    } else {
      poll.guesses.push({
        name: user,
        type: "questions",
        answers: answers,
      });
    }
  }
};

Data.prototype.getSubmittedAnswers = function(pollId) {
  console.log("Hämtar svar för pollId:", pollId);

  // Kontrollera om omröstningen existerar i datalagret
  if (this.pollExists(pollId)) {
    console.log("Hittade omröstning:", this.polls[pollId]);

    // Returnera listan av guesses om den existerar, annars en tom array
    return this.polls[pollId].guesses;
  } else {
    console.log("Poll finns inte för getSubmittedAnswers:", pollId);
    return [];
  }
};


Data.prototype.startTime = function (pollId) {
  if (this.pollExists(pollId)) {
    if (!this.polls[pollId].startTime){
      this.polls[pollId].startTime = Date.now(); //Sparar akturell tid i millisekunder
      console.log("Starttid är satt för pollId:", pollId, this.polls[pollId].startTime);
    }
    return this.polls[pollId].startTime;
  }
  return null;
};

Data.prototype.getNextCity = function(pollId) {
  if (this.pollExists(pollId)) {
    const poll = this.polls[pollId];
    console.log(`Hämtar nästa stad. Nuvarande index: ${poll.currentCityIndex}, Totalt: ${poll.cities.length}`);
    if (poll.currentCityIndex < poll.cities.length) {
      poll.currentCityIndex += 1; // Öka indexet
      //const nextCity = poll.cities[poll.currentCityIndex];
      //this.polls[pollId] = poll; // Uppdatera lagret
      console.log(`Ny currentCityIndex sparad: ${poll.currentCityIndex}`);
      //console.log(`Nästa stad skickas: ${nextCity.name}, Uppdaterad index: ${poll.currentCityIndex}`);
      return poll.currentCityIndex;
    }
  }
  return null; // Om det inte finns fler städer
};

Data.prototype.resetPoll = function (pollId) {
  if (this.pollExists(pollId)) {
    delete this.polls[pollId]; // Radera alla data för omröstningen
    console.log(`Spelet för pollId ${pollId} har återställts.`);
  }
}

export { Data };




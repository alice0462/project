'use strict';
import {readFileSync} from "fs";

function Data() {
  this.polls = {};
  this.polls['test'] = {
    lang: "en",
    questions: [],
    answers: [],
    currentQuestion: 0,
    participants: [],
    scores: []
  }
}

Data.prototype.pollExists = function (pollId) {
  return typeof this.polls[pollId] !== "undefined"
}

Data.prototype.getUILabels = function (lang) {
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

    const participant = poll.participants.find(p => p.name === user);
    participant.points = (participant.points || 0) + points; 
    
    console.log(`Totala poäng för ${user}:`, participant ? participant.points : points);
  } else {
    console.log(`Poll finns inte: ${pollId}`);
  }
};

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
    if (typeof answers !== 'object') {
      answers = {};
      answers[answer] = 1;
      poll.answers.push(answers);
    }
    else if (typeof answers[answer] === 'undefined') {
      answers[answer] = 1;
    }
    else
      answers[answer] += 1
    console.log("answers looks like ", answers, typeof answers);
  }
}

Data.prototype.addCities = function(pollId, data) {
  console.log(data);
  this.polls[pollId].cities = data.cities; 
  console.log("INFO!!!!:", data)
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

Data.prototype.getCode = function(pollId, data) {
  const poll = this.polls[pollId];
  console.log("level requested for:", pollId);
  if(this.pollExists(pollId)) {
    console.log(this.polls[pollId].level);
    return this.polls[pollId].level;
  }
  return [];
}

Data.prototype.destinationAnswer = function(user, pollId, type, correctCity, guess, points) {
  console.log("Sparar svar för:", user, pollId, type, correctCity, guess, points);

  if (this.pollExists(pollId)) {
    const poll = this.polls[pollId];

    if (!poll.guesses) {
      poll.guesses = [];
    }

    const existingAnswer = poll.guesses.find(g => g.name === user && g.type === "destination");
    if (existingAnswer) {
      existingAnswer.guess = guess; 
      existingAnswer.points = points;
      console.log("Destinationssvar uppdaterat för:", user, guess, points);
    } else {
      poll.guesses.push({ name: user, type: "destination", correctCity: correctCity, guess: guess, points: points });
      console.log("Nytt svar sparat för:", user, guess, points);
    }
  } else {
    console.log("Poll finns inte:", pollId);
  }
};

Data.prototype.submitQuestionAnswers = function (user, pollId, correctCity, answers) {
  if (this.pollExists(pollId)) {
    const poll = this.polls[pollId];

    if (!poll.guesses) {
      poll.guesses = [];
    }

    const userAnswers = poll.guesses.find(g => g.name === user && g.type === "questions");

    if (userAnswers) {
      userAnswers.answers = answers; 
    } else {
      poll.guesses.push({
        name: user,
        type: "questions",
        correctCity: correctCity,
        answers: answers,
      });
    }
  }
};

Data.prototype.resetAnswer = function (pollId) {
  if (this.pollExists(pollId)) {
    this.polls[pollId].guesses = [];
    this.polls[pollId].answer = [];
  }
};

Data.prototype.getSubmittedAnswers = function(pollId) {
  console.log("Hämtar svar för pollId:", pollId);

  if (this.pollExists(pollId)) {
    console.log("Hittade omröstning:", this.polls[pollId]);

    return this.polls[pollId].guesses;
  } else {
    console.log("Poll finns inte för getSubmittedAnswers:", pollId);
    return [];
  }
};


Data.prototype.startTime = function (pollId) {
  if (this.pollExists(pollId)) {
    if (!this.polls[pollId].startTime){
      this.polls[pollId].startTime = Date.now();
      console.log("Starttid är satt för pollId:", pollId, this.polls[pollId].startTime);
    }
    return this.polls[pollId].startTime;
  }
  return null;
};
Data.prototype.updateStartTime = function (pollId) {
  if (this.pollExists(pollId)) {
    this.polls[pollId].startTime = Date.now();
    console.log("Starttiden uppdaterad för pollId:", pollId, this.polls[pollId].startTime);
    return this.polls[pollId].startTime;
  }
  return null;
}

Data.prototype.getNextCity = function(pollId) {
  if (this.pollExists(pollId)) {
    const poll = this.polls[pollId];
    console.log(`Hämtar nästa stad. Nuvarande index: ${poll.currentCityIndex}, Totalt: ${poll.cities.length}`);
    if (poll.currentCityIndex < poll.cities.length) {
      poll.currentCityIndex += 1; 
      console.log(`Ny currentCityIndex sparad: ${poll.currentCityIndex}`);
      return poll.currentCityIndex;
    }
  }
  return null; 
};

Data.prototype.resetPoll = function (pollId) {
  if (this.pollExists(pollId)) {
    delete this.polls[pollId]; 
    console.log(`Spelet för pollId ${pollId} har återställts.`);
  }
};


Data.prototype.getCurrentCity = function(pollId) {
  if (this.pollExists(pollId)) {
    const poll = this.polls[pollId]
      return poll.cities[poll.currentCityIndex];
  }
  return null; 
};

export { Data };




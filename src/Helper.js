const base64 = require('base-64');
const utf8 = require('utf8');

var helperChar = {};
var helperPlayer = {};

function setHelperDictChar(data) {
  helperChar = data;
}

function setHelperDictPlayer(data) {
  helperPlayer = data;
}

function generateContent(text) {
  if (helperChar[text]) {
    return generateContentCharacter(text);
  }
  else {
    return generateContentPlayer(text);
  }
}

function generateContentPlayer(playerName) {
  if (!helperPlayer.hasOwnProperty(playerName)) {
    return null;
  }

  var contentString = `
  <table>
    <tr>
      <th>Tournament</th>
      <th>Year</th>
      <th>Characters</th>
    </tr>`;

  for (var i = 0; i < helperPlayer[playerName].tournaments.length; i++) {
      var iterationData = "<tr>";
      iterationData += "<td>" + helperPlayer[playerName].tournaments[i].tournament + "</td>";
      iterationData += "<td>" + helperPlayer[playerName].tournaments[i].year  + "</td>";
      iterationData += "<td>" + helperPlayer[playerName].tournaments[i].characters.join(", ") + "</td>";
      iterationData += "</tr>";
      contentString += iterationData;
  }

  contentString += "</table>";
  return contentString;
}

function generateContentCharacter(character) {
  //when you call it on player it also calls it here for some reason. we don't want to trigger if it doesnt have it
  if (!helperChar.hasOwnProperty(character)) {
    return null;
  }

  var contentString = `
  <table>
    <tr>
      <th>Tournament</th>
      <th>Year</th>
      <th>Player</th>
      <th>Characters</th>
    </tr>`;

  for (var i = 0; i < helperChar[character].tournaments.length; i++) {
      var iterationData = "<tr>";
      iterationData += "<td>" + helperChar[character].tournaments[i].tournament + "</td>";
      iterationData += "<td>" + helperChar[character].tournaments[i].currentYear  + "</td>";
      iterationData += "<td>" + helperChar[character].tournaments[i].player + "</td>";
      iterationData += "<td>" + helperChar[character].tournaments[i].characters.join(", ") + "</td>";
      iterationData += "</tr>";
      contentString += iterationData;
  }

  contentString += "</table>";
  return contentString;
}

function findLabel(data, index) {
  var retList = [];

  for (var i = 0; i < data.length; i++) {
    retList.push(data[i][index]);
  }

  return retList;
}

function makeData(data) {
  return {
    labels: findLabel(data, 0),
    datasets: [{
      data: findLabel(data, 1),
      backgroundColor: findLabel(data, 2),
      hoverBackgroundColor: findLabel(data, 2)
    }],

  };
}

function readText(dict) {
  var bytes = base64.decode(dict.split(',')[1]);
  var text = utf8.decode(bytes);
  return text;
}

function generateJSONResults(results) {
  var l = [];
  var currentYear = "";
  var resultsArr = results.split("\n");
  for (var i = 0; i < resultsArr.length; i++) {
    var p = parseInt(resultsArr[i], 10);
    if (isNaN(p)) {
      l.push(parseTab(currentYear, resultsArr[i]));
    }
    else {
      currentYear = resultsArr[i];
    }
  }

  return l;
}

function parseTab(currentYear, line) {
  var tournament = "";
  var characters = [];
  var player = "";

  var tabDelimitedArray = line.split("\t");
  for (var i = 0; i < tabDelimitedArray.length; i++) {
    if (tabDelimitedArray[i].indexOf("Smasher:") !== -1) {
      player = tabDelimitedArray[i].split(":")[1];
    }

    else if (tabDelimitedArray[i].indexOf("(SSBM)") !== -1) {
      if (tabDelimitedArray[i].split(" ").length === 2) {
        characters.push(tabDelimitedArray[i].split(" ")[0]);
      }
      else if (tabDelimitedArray[i].split(" ").length === 3) {
        characters.push(tabDelimitedArray[i].split(" ")[0] + " " + tabDelimitedArray[i].split(" ")[1]);
      }
    }

    else {
      tournament = tabDelimitedArray[i];
    }
  }

  if ((player) === "") {
    return;
  }

  return {
    "currentYear": currentYear,
    "tournament": tournament,
    "player": player,
    "characters": characters
  }
}

export {readText, makeData, findLabel, generateJSONResults, generateContent, setHelperDictChar, setHelperDictPlayer};

import React, { Component } from 'react';
import './App.css';
import {Pie} from 'react-chartjs-2';
const base64 = require('base-64');
const utf8 = require('utf8');
const results = require('./tournamentResults.txt');

const data = {
	labels: [
		'Red',
		'Green',
		'Yellow'
	],
	datasets: [{
		data: [300, 50, 100],
		backgroundColor: [
		'#FF6384',
		'#36A2EB',
		'#FFCE56'
		],
		hoverBackgroundColor: [
		'#FF6384',
		'#36A2EB',
		'#FFCE56'
		]
	}]
};

class Chartfile extends Component {
  constructor() {
    super();
    this.players = {};
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  findLabel(data, index) {
    var retList = [];

    for (var i = 0; i < data.length; i++) {
      retList.push(data[i][index]);
    }

    return retList;
  }

  makeData(data) {
    //TODO: Get rid of this
    var colors = [];
    for (var i = 0; i < data.length; i++) {
      colors.push(this.getRandomColor());
    }
    console.log(data);
    console.log(this.findLabel(data, 1));

    return {
      labels: this.findLabel(data, 0),
      datasets: [{
        data: this.findLabel(data, 1),
        backgroundColor: colors,
        hoverBackgroundColor: colors
      }]
    };
  }

  readText() {
    var bytes = base64.decode(results.split(',')[1]);
    var text = utf8.decode(bytes);
    return text;
  }

  generateJSON(results) {
    var currentYear = "";
    var resultsArr = results.split("\n");
    for (var i = 0; i < resultsArr.length; i++) {
      var p = parseInt(resultsArr[i], 10);
      if (isNaN(p)) {
        this.parseTab(currentYear, resultsArr[i]);
      }
      else {
        currentYear = resultsArr[i];
      }
    }
  }

  parseTab(currentYear, line) {
    var tournament = "";
    var characters = [];
    var player = "";

    var tabDelimitedArray = line.split("\t");
    for (var i = 0; i < tabDelimitedArray.length; i++) {
      if (tabDelimitedArray[i].indexOf("Smasher:") !== -1) {
        player = tabDelimitedArray[i].split(":")[1];
      }

      else if (tabDelimitedArray[i].indexOf("(SSBM)") !== -1) {
        characters.push(tabDelimitedArray[i].split(" ")[0]);
      }

      else {
        tournament = tabDelimitedArray[i];
      }
    }

    if ((player) === "") {
      return;
    }

    //set if not already set
    if (!this.players.hasOwnProperty(player)) {
      this.players[player] = {};
    }

    if (!this.players[player].hasOwnProperty('tournaments')) {
      this.players[player].tournaments = [];
    }

    this.players[player].tournaments.push({
      "year": currentYear,
      "tournament": tournament,
      "characters": characters
    });
    return;
  }

  /*
  TODO: Add time frame functionality for these next few functions
  */
  generateBestPlayer() {
    var bestPlayers = [];
    for (var key in this.players) {
      if (this.players.hasOwnProperty(key)) {
        var nWins = [];
        nWins.push(key);
        nWins.push(this.players[key].tournaments.length);
        bestPlayers.push(nWins);
      }
    }
    return bestPlayers;
  }

  render() {
    var results = this.readText();
    this.generateJSON(results);
    console.log(this.players);
    var bestPlayers = this.generateBestPlayer();
    var plotData = this.makeData(bestPlayers);
    console.log(plotData);
    console.log(data);

    return (
      <div>
        <Pie ref='chart' data={plotData} />
      </div>
    );
  }
}

export default Chartfile;

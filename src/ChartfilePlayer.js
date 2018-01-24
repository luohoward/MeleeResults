import React, { Component } from 'react';
import {readText, makeData, generateJSONResults} from './Helper.js';
import './App.css';
import {Pie} from 'react-chartjs-2';
const m_results = require('./tournamentResults.txt');
const m_colors = require('./colors.txt');

class ChartfilePlayer extends Component {
  constructor() {
    super();
    this.players = {};
  }

  generateJSONColorResults(color) {
    var colorArr = color.split("\n");
    for (var i = 0; i < colorArr.length; i++) {
      var a = colorArr[i].split(":");
      this.players[a[0]].color = a[1];
    }
  }

  setPlayerArray(blob) {
    for (var i = 0; i < blob.length; i++ ) {
      if (blob[i] != null) {
        if (!this.players.hasOwnProperty(blob[i].player)) {
          this.players[blob[i].player] = {};
        }

        if (!this.players[blob[i].player].hasOwnProperty('tournaments')) {
          this.players[blob[i].player].tournaments = [];
        }

        this.players[blob[i].player].tournaments.push({
          "year": blob[i].currentYear,
          "tournament": blob[i].tournament,
          "characters": blob[i].characters
        });
      }
    }
  }

  generateBestPlayer() {
    var bestPlayers = [];
    for (var key in this.players) {
      if (this.players.hasOwnProperty(key)) {
        var nWins = [];
        nWins.push(key);
        nWins.push(this.players[key].tournaments.length);
        nWins.push(this.players[key].color);
        bestPlayers.push(nWins);
      }
    }
    return bestPlayers;
  }

  /*
  TODO: Add click events
  */

  render() {
    var results = readText(m_results);
    var colors = readText(m_colors);
    var jsonResults = generateJSONResults(results);
    this.setPlayerArray(jsonResults);
    this.generateJSONColorResults(colors);
    var bestPlayers = this.generateBestPlayer();
    var plotData = makeData(bestPlayers);
    return (
      <div>
        <h2>Best Players</h2>
        <Pie ref='chart' data={plotData} />
      </div>
    );
  }
}

export default ChartfilePlayer;

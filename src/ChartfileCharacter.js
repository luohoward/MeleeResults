import React, { Component } from 'react';
import {readText, makeData, generateJSONResults} from './Helper.js';
import './App.css';
import {Pie} from 'react-chartjs-2';
const m_results = require('./tournamentResults.txt');
const m_colors = require('./characters.txt');

class ChartfileCharacter extends Component {
  constructor() {
    super();
    this.characters = {};
  }

  generateJSONColorResults(color) {
    var colorArr = color.split("\n");
    for (var i = 0; i < colorArr.length; i++) {
      if (colorArr[i] != null) {
        var a = colorArr[i].split(":");
        this.characters[a[0]].color = a[1];
      }
    }
  }

  setCharacterArray(blob) {
    for (var i = 0; i < blob.length; i++) {
      if (blob[i] != null) {
        for (var j = 0; j < blob[i].characters.length; j++)  {
          if (!this.characters.hasOwnProperty(blob[i].characters[j])) {
            this.characters[blob[i].characters[j]] = {};
            this.characters[blob[i].characters[j]].victories = 1;
            this.characters[blob[i].characters[j]].tournaments = [];
            this.characters[blob[i].characters[j]].tournaments.push(blob[i]);
          }
          else {
            this.characters[blob[i].characters[j]].victories++;
            this.characters[blob[i].characters[j]].tournaments.push(blob[i]);
          }
        }
      }
    }
  }

  generateBestCharacter() {
    var bestCharacters = [];
    for (var key in this.characters) {
      if (this.characters.hasOwnProperty(key)) {
        var nWins = [];
        nWins.push(key);
        nWins.push(this.characters[key].tournaments.length);
        nWins.push(this.characters[key].color);
        bestCharacters.push(nWins);
      }
    }
    return bestCharacters;
  }

  /*
  TODO: Add click events
  */

  render() {
    var results = readText(m_results);
    var colors = readText(m_colors);
    var jsonResults = generateJSONResults(results);
    this.setCharacterArray(jsonResults);
    this.generateJSONColorResults(colors);
    var bestCharacters = this.generateBestCharacter();
    console.log(bestCharacters);
    var plotData = makeData(bestCharacters);
    return (
      <div>
        <h2>Tournament Winning Characters (including secondaries)</h2>
        <Pie ref='chart' data={plotData} />
      </div>
    );
  }
}

export default ChartfileCharacter;

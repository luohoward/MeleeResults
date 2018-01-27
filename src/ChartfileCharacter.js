import React, { Component } from 'react';
import {readText, makeData, generateJSONResults, generateContent, setHelperDictChar} from './Helper.js';
import './assets/App.css';
import {Pie} from 'react-chartjs-2';
const m_results = require('./assets/tournamentResults.txt');
const m_colors = require('./assets/characters.txt');
const popupS = require('popups');

class ChartfileCharacter extends Component {
  constructor() {
    super();
    this.characters = {};
    this.legendOptions = {
      onClick: (e, item) => {
        popupS.modal({
          title: item.text,
          content: {
            html: generateContent(item.text)
          }
        });
      }
    }
    this.filterDataByYear = this.filterDataByYear.bind(this);
    this.state = {
      filter: "all"
    }
    this.results = readText(m_results);
    this.colors = readText(m_colors);
    this.jsonResults = generateJSONResults(this.results);

  }

  generateJSONColorResults(color) {
    var colorArr = color.split("\n");
    for (var i = 0; i < colorArr.length; i++) {
      if (colorArr[i] != null) {
        var a = colorArr[i].split(":");
        if (this.characters.hasOwnProperty(a[0])) {
          this.characters[a[0]].color = a[1];
        }
      }
    }
  }

  setCharacterArray(blob, filter) {
    this.characters = {};
    for (var i = 0; i < blob.length; i++) {
      if (blob[i] != null) {
        for (var j = 0; j < blob[i].characters.length; j++)  {
          if (!this.characters.hasOwnProperty(blob[i].characters[j])) {
            if (filter === "all" || filter === blob[i].currentYear) {
              this.characters[blob[i].characters[j]] = {};
              this.characters[blob[i].characters[j]].victories = 1;
              this.characters[blob[i].characters[j]].tournaments = [];
              this.characters[blob[i].characters[j]].tournaments.push(blob[i]);
            }
          }
          else {
            if (filter === "all" || filter === blob[i].currentYear) {
              this.characters[blob[i].characters[j]].victories++;
              this.characters[blob[i].characters[j]].tournaments.push(blob[i]);
            }
          }
        }
      }
    }
    setHelperDictChar(this.characters);
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

  filterDataByYear(event) {
    this.setState({
      filter: event.target.value
    });
  }

  render() {
    this.setCharacterArray(this.jsonResults, this.state.filter);
    this.generateJSONColorResults(this.colors);
    var bestCharacters = this.generateBestCharacter();
    var plotData = makeData(bestCharacters);
    return (
      <div>
        <h2>Tournament Winning Characters (including secondaries)</h2>
        <select ref="filterCharacter" value={this.state.filter} onChange={this.filterDataByYear}>
          <option value="all">all</option>
          <option value="2003">2003</option>
          <option value="2004">2004</option>
          <option value="2005">2005</option>
          <option value="2006">2006</option>
          <option value="2007">2007</option>
          <option value="2008">2008</option>
          <option value="2009">2009</option>
          <option value="2010">2010</option>
          <option value="2011">2011</option>
          <option value="2012">2012</option>
          <option value="2013">2013</option>
          <option value="2014">2014</option>
          <option value="2015">2015</option>
          <option value="2016">2016</option>
          <option value="2017">2017</option>
          <option value="2018">2018</option>
        </select>
        <Pie ref='chartChar' data={plotData} legend={this.legendOptions}/>
      </div>
    );
  }
}

export default ChartfileCharacter;

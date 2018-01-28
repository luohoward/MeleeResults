import React, { Component } from 'react';
import {readText, makeData, generateJSONResults, generateContent, setHelperDictPlayer} from './Helper.js';
import './assets/App.css';
import {Pie} from 'react-chartjs-2';
const m_results = require('./assets/tournamentResults.txt');
const m_colors = require('./assets/colors.txt');
const popupS = require('popups');

class ChartfilePlayer extends Component {
  constructor() {
    super();
    this.players = {};
    this.legendOptions = {
      onClick: (e, item) => {
        popupS.modal({
          title: item.text,
          content: {
            html: generateContent(item.text)
          }
        });
      }
    };
    this.state = {
      value: "all"
    }
    this.filterDataByYear = this.filterDataByYear.bind(this);
    this.results = readText(m_results);
    this.colors = readText(m_colors);
    this.jsonResults = generateJSONResults(this.results);
  }



  generateJSONColorResults(color) {
    var colorArr = color.split("\n");
    for (var i = 0; i < colorArr.length; i++) {
      var a = colorArr[i].split(":");
      if (this.players.hasOwnProperty(a[0])) {
        this.players[a[0]].color = a[1];
      }
    }
  }

  setPlayerArray(blob, filter) {
    this.players = {};
    for (var i = 0; i < blob.length; i++ ) {
      if (blob[i] != null) {
        if (!this.players.hasOwnProperty(blob[i].player)) {
          this.players[blob[i].player] = {};
        }

        if (!this.players[blob[i].player].hasOwnProperty('tournaments')) {
          this.players[blob[i].player].tournaments = [];
        }

        if (filter === 'all') {
          this.players[blob[i].player].tournaments.push({
            "year": blob[i].currentYear,
            "tournament": blob[i].tournament,
            "characters": blob[i].characters
          });
        }
        else
        {
          if (filter === blob[i].currentYear) {
            this.players[blob[i].player].tournaments.push({
              "year": blob[i].currentYear,
              "tournament": blob[i].tournament,
              "characters": blob[i].characters
            });
          }
        }
      }
    }

    for (var key in this.players) {
      if (this.players[key].tournaments.length === 0) {
        delete this.players[key];
      }
    }
    setHelperDictPlayer(this.players);
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

  filterDataByYear(event) {
    this.setState({
      value: event.target.value
    });
  }

  render() {
    this.setPlayerArray(this.jsonResults, this.state.value);
    this.generateJSONColorResults(this.colors);
    var bestPlayers = this.generateBestPlayer();
    var plotData = makeData(bestPlayers);
    return (
      <div>
        <h2>Best Players</h2>
        <select ref="filterPlayer" value={this.state.value} onChange={this.filterDataByYear}>
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
        <Pie ref='chartPlayer' data={plotData} legend={this.legendOptions}/>
      </div>
    );
  }
}

export default ChartfilePlayer;

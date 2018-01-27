import React, { Component } from 'react';
import ChartfilePlayer from './ChartfilePlayer';
import ChartfileCharacter from './ChartfileCharacter';
import './assets/App.css';

class App extends Component {
  constuctor() {
    this.state = {
      filter: 'all',
      players: {},
      characters: {}
    }
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>Melee Tournament Results</h1>
          <h4>Click the colors in the key for more detailed info</h4>
          <h6>(This site assumes that tournament wins are all counted equal for statistics sake)</h6>
          <h6>Data pulled from: <a href="https://www.ssbwiki.com/List_of_national_tournaments">https://www.ssbwiki.com/List_of_national_tournaments </a></h6>
        </div>
        <ChartfilePlayer/>
        <ChartfileCharacter/>
        <div className="App-header">
          <h4><b>Why I Made this site</b></h4>
          <p>I got really tired of my friend complaining that his character sucked instead of him actually improving at the game</p>
          <h6>I will try to update this site when I can. Data may be out of date sometimes</h6>
          <h6>If you want to help out, shoot me an email at bhowluo2@gmail.com</h6>
        </div>
      </div>
    );
  }
}

export default App;

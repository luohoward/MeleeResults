import React, { Component } from 'react';
import logo from './logo.svg';
import ChartfilePlayer from './ChartfilePlayer';
import ChartfileCharacter from './ChartfileCharacter';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>Melee Tournament Results</h1>
          <h6>(This site assumes that tournament wins are all counted equal for statistics sake)</h6>
        </div>
        <ChartfilePlayer/>
        <ChartfileCharacter/>
      </div>
    );
  }
}

export default App;

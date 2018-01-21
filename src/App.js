import React, { Component } from 'react';
import logo from './logo.svg';
import Chartfile from './Chartfile';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Melee Tournament Results</h2>
          <h6>(This site assumes that tournament wins are all counted equal for statistics sake)</h6>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Chartfile/>
      </div>

    );
  }
}

export default App;

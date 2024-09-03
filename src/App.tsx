
import React from 'react';
import NavBar from './components/NavBar/NavBar'
import ToolBox from './components/ToolBox/ToolBox'
import './App.css'
import GraphSchematics from './components/GraphSchematics/GraphSchematics';

export default class App extends React.Component {
  state = {
    isPlaying: false
  };

  onChangePlayState = (state: boolean) => {
    this.setState({ isPlaying: state });
  }

  onKeyPressed(event: any) {
    const keycodeStatistics = "KeyS";
    if (event.code === keycodeStatistics) {
      this.forceUpdate();
    }
  }

  render() {
    return (
      <div id="app" className="App" tabIndex={0} onKeyDown={(event) => this.onKeyPressed(event)}>
        <NavBar></NavBar>
        <ToolBox callbackPlaying={this.onChangePlayState}></ToolBox>
        <GraphSchematics isPlaying={this.state.isPlaying}></GraphSchematics>
      </div>
    );
  }
}

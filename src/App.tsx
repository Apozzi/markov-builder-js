
import React from 'react';
import NavBar from './components/NavBar/NavBar'
import ToolBox from './components/ToolBox/ToolBox'
import './App.css'
import GraphSchematics from './components/GraphSchematics/GraphSchematics';
import DataBar from './components/DataBar/DataBar';
import GraphSchematicsManager from './components/GraphSchematics/GraphSchematicsManager';

export default class App extends React.Component {
  state = {
    isPlaying: false
  };

  onChangePlayState = (state: boolean) => {
    this.setState({ isPlaying: state });
    GraphSchematicsManager.setPlayOrStop(state);
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
        <div className='control'>
          <div className='control-top '>▲</div>
          <div className='control-left'>◀</div>
          <div className='control-center'></div>
          <div className='control-right'>▶</div>
          <div className='control-botton'>▼</div>
        </div>
        <GraphSchematics></GraphSchematics>
        <DataBar></DataBar>
      </div>
    );
  }
}

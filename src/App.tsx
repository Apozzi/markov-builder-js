
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
          <div className='control-top' onMouseDown={() => GraphSchematicsManager.controlMoveUp()}>▲</div>
          <div className='control-left' onMouseDown={() => GraphSchematicsManager.controlMoveLeft()}>◀</div>
          <div className='control-center' onMouseDown={() => GraphSchematicsManager.controlToCenter()}></div>
          <div className='control-right' onMouseDown={() => GraphSchematicsManager.controlMoveRight()}>▶</div>
          <div className='control-bottom' onMouseDown={() => GraphSchematicsManager.controlMoveDown()}>▼</div>
        </div>
        <GraphSchematics></GraphSchematics>
        <DataBar></DataBar>
      </div>
    );
  }
}

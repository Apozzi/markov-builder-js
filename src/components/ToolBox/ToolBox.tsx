import React from 'react';
import SimulatorUtils from '../../utils/SimulatorUtils.tsx';
import './ToolBox.css';

export default class ToolBox extends React.Component<{callbackPlaying : any}> {

  state = {
    isPlaying: false
  };

  componentDidMount() {

  }

  onClickButton(objectId: String) {
    SimulatorUtils.cloneObject(objectId);
  }

  togglePlayButton() {
    this.setState({
      isPlaying: !this.state.isPlaying
    });
    this.props.callbackPlaying(!this.state.isPlaying);
  }

  render() {
    return (
      <div className="toolbox">
        {
          this.state.isPlaying ? 
          <div className="pause-button" onClick={() => this.togglePlayButton()}>❚❚</div> :
          <div className="play-button" onClick={() => this.togglePlayButton()}>►</div>
        }
        <div id="addV" className="toolbox-button" onMouseDown={() => this.onClickButton('vertice')} >
          <div className="toolbox-icon">◯</div>
          <div className="toolbox-text">Adicionar Vértice</div>
        </div>

        <div id="aresta" className="toolbox-button" onMouseDown={() => this.onClickButton('aresta')} >
          <div className="toolbox-icon">/</div>
          <div className="toolbox-text">Adicionar Aresta</div>
        </div>
        
      </div>
    )
  }

}
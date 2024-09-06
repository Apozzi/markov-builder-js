import React from 'react';
import SimulatorUtils from '../../utils/SimulatorUtils.tsx';
import './ToolBox.css';
import GraphSchematicsManager from '../GraphSchematics/GraphSchematicsManager.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartSimple } from '@fortawesome/free-solid-svg-icons';

export default class ToolBox extends React.Component<{callbackPlaying : any}> {

  state = {
    isPlaying: false
  };

  componentDidMount() {
    GraphSchematicsManager.exitCreationMode().subscribe(() => this.forceUpdate());
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

  toggleEdgeMode() {
    GraphSchematicsManager.toggleEdgeCreationMode({});
    this.forceUpdate();
  }

  render() {
    return (
      <div className={"toolbox" + (GraphSchematicsManager.getStateEdgeCreationMode() ? ' toolbox-crosshair' : '')}>
        {
          this.state.isPlaying ? 
          <div className="pause-button" onClick={() => this.togglePlayButton()}>❚❚</div> :
          <div className="play-button" onClick={() => this.togglePlayButton()}>►</div>
        }
        <div id="addV" className="toolbox-button" onMouseDown={() => this.onClickButton('vertice')} >
          <div className="toolbox-icon">◯</div>
          <div className="toolbox-text">Adicionar Vértice</div>
        </div>

        <div id="aresta" className={"toolbox-button " + (GraphSchematicsManager.getStateEdgeCreationMode() ? 'toolbox-button-on toolbox-crosshair' : '')} onMouseDown={() => this.toggleEdgeMode()} >
          <div className="toolbox-icon">/</div>
          <div className="toolbox-text">Adicionar Aresta</div>
        </div>

        <div id="aresta" className={"toolbox-button"}>
          <div className="toolbox-icon"><FontAwesomeIcon icon={faChartSimple} /></div>
          <div className="toolbox-text">Gráficos</div>
        </div>
        
      </div>
    )
  }

}
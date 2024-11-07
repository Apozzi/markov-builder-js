import React from 'react';
import SimulatorUtils from '../../utils/SimulatorUtils.tsx';
import './ToolBox.css';
import GraphSchematicsManager from '../GraphSchematics/GraphSchematicsManager.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartSimple } from '@fortawesome/free-solid-svg-icons';
import GraphViewModal from '../GraphViewModal/GraphViewModal';
import { FormattedMessage } from 'react-intl';

export default class ToolBox extends React.Component<{callbackPlaying : any}> {

  state = {
    isPlaying: false
  };

  componentDidMount() {
    GraphSchematicsManager.exitCreationMode().subscribe(() => this.forceUpdate());
    GraphSchematicsManager.isPlaying().subscribe((isPlaying) => this.setState({isPlaying}));
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
        <GraphViewModal></GraphViewModal>
        {
          this.state.isPlaying ? 
          <div className="pause-button" onClick={() => this.togglePlayButton()}>❚❚</div> :
          <div className="play-button" onClick={() => this.togglePlayButton()}>►</div>
        }
        <div id="addV" className="toolbox-button" onMouseDown={() => this.onClickButton('vertice')} >
          <div className="toolbox-icon">◯</div>
          <div className="toolbox-text"><FormattedMessage id={"add_vertex"}/></div>
        </div>

        <div id="aresta" className={"toolbox-button " + (GraphSchematicsManager.getStateEdgeCreationMode() ? 'toolbox-button-on toolbox-crosshair' : '')} onMouseDown={() => this.toggleEdgeMode()} >
          <div className="toolbox-icon">/</div>
          <div className="toolbox-text"><FormattedMessage id={"add_edge"}/></div>
        </div>
        
        <div id="aresta" className={"toolbox-button"} onClick={() => GraphViewModal.openModal({})}>
          <div className="toolbox-icon"><FontAwesomeIcon icon={faChartSimple} /></div>
          <div className="toolbox-text"><FormattedMessage id={"graphics"}/></div>
        </div>
        
      </div>
    )
  }

}
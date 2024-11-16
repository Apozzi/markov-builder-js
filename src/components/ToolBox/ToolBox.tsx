import React from 'react';
import SimulatorUtils from '../../utils/SimulatorUtils.tsx';
import './ToolBox.css';
import GraphSchematicsManager from '../GraphSchematics/GraphSchematicsManager.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartSimple } from '@fortawesome/free-solid-svg-icons';
import GraphViewModal from '../GraphViewModal/GraphViewModal';
import { FormattedMessage, injectIntl } from 'react-intl';

interface ToolBoxProps {
  callbackPlaying: any;
  intl: any;
}

interface ToolBoxState {
  isPlaying: boolean;
}


class ToolBox extends React.Component<ToolBoxProps, ToolBoxState> {
  state = {
    isPlaying: false
  };

  componentDidMount() {
    GraphSchematicsManager.exitCreationMode().subscribe(() => this.forceUpdate());
    GraphSchematicsManager.isPlaying().subscribe((isPlaying: any) => this.setState({isPlaying}));
  }

  onClickButton(objectId: String) {
    const { intl } = this.props;
    SimulatorUtils.cloneObject(objectId, intl);
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

export default injectIntl(ToolBox);
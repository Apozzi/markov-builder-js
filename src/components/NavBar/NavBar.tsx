import React from 'react';
import './NavBar.css';
import GraphSchematicsManager from '../GraphSchematics/GraphSchematicsManager';
import DetailsViewModal from '../DetailsViewModal/DetailsViewModal';
import AboutViewModal from '../AboutViewModal/AboutViewModal';
import CustomVerticeSongViewModal from '../CustomVerticeSongViewModal/CustomVerticeSongViewModal';
import ConfigurationViewModal from '../ConfigurationViewModal/ConfigurationViewModal';
import TreeLayoutConfigViewModal from '../TreeLayoutConfigViewModal/TreeLayoutConfigViewModal';
import RadialLayoutConfigViewModal from '../RadialLayoutConfigViewModal/RadialLayoutConfigViewModal';
import { FormattedMessage } from 'react-intl';


export default class NavBar extends React.Component<any> {
  saveGraph = () => {
    const fileName = prompt('Digite o nome do arquivo para salvar:', 'graph_state.json');
    if (!fileName) return;
    let state = GraphSchematicsManager.getGraphState()
    const jsonString = JSON.stringify(state);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.endsWith('.json') ? fileName : `${fileName}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  openGraph = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        try {
          const state = JSON.parse(content);
          GraphSchematicsManager.loadGraphState(state);
        } catch (error) {
          console.error('Error parsing JSON file:', error);
          alert('Invalid JSON file. Please select a valid graph state file.');
        }
      };
      reader.readAsText(file);
    }
  };

  openExamplePeriodic = () => {
    GraphSchematicsManager.loadGraphState({"offsetX":408,"offsetY":154,"width":1557,"height":1000,"scale":1,"vertices":[{"id":5,"x":391.01932292184966,"y":10.087062104120355,"label":"E","visitCount":0,"sound":{"type":"note","value":"A"}},{"id":2,"x":562.9018600859058,"y":435.77584151253916,"label":"B","visitCount":4,"sound":{"type":"note","value":"A"}},{"id":3,"x":-76.2213866037365,"y":443.61495214199954,"label":"C","visitCount":0,"sound":{"type":"note","value":"A"}},{"id":1,"x":91.3372781377626,"y":10.905327334640788,"label":"A","visitCount":0,"sound":{"type":"note","value":"A"}}],"edges":[{"source":1,"target":2},{"source":1,"target":3},{"source":2,"target":1},{"source":2,"target":5},{"source":3,"target":1},{"source":3,"target":5},{"source":5,"target":2},{"source":5,"target":3}],"selectedVertex":null,"draggingVertex":true,"edgeCreationMode":false,"edgeStartVertex":null,"edgeWeights":{"1":{"2":0.3,"3":0.7},"2":{"1":0.3,"5":0.7},"3":{"1":0.3,"5":0.7},"4":{"4":1},"5":{"2":0.3,"3":0.7}},"actualVertex":null,"audioContext":{},"vertexHistory":[]});
  };

  openExampleCounter = () => {
    GraphSchematicsManager.loadGraphState({"offsetX":-1,"offsetY":-1,"width":1724,"height":1000,"scale":1,"vertices":[{"id":1,"x":662,"y":192,"label":"A","visitCount":0},{"id":2,"x":917,"y":191,"label":"B","visitCount":0},{"id":3,"x":1012,"y":424,"label":"C","visitCount":0},{"id":4,"x":799,"y":591,"label":"D","visitCount":0},{"id":5,"x":578,"y":425,"label":"E","visitCount":0}],"edges":[{"source":1,"target":2},{"source":2,"target":3},{"source":3,"target":4},{"source":4,"target":5},{"source":5,"target":1}],"selectedVertex":null,"draggingVertex":false,"edgeCreationMode":false,"edgeStartVertex":null,"edgeWeights":{"1":{"2":1},"2":{"3":1},"3":{"4":1},"4":{"5":1},"5":{"1":1}},"actualVertex":null,"audioContext":{},"vertexHistory":[]});
  };

  openExampleTwoCommunicationClasses = () => {
    GraphSchematicsManager.loadGraphState({"offsetX":-89,"offsetY":110,"width":1557,"height":1000,"scale":1,"vertices":[{"id":5,"x":907,"y":72,"label":"E","visitCount":0,"sound":{"type":"note","value":"A"}},{"id":2,"x":1049,"y":296,"label":"B","visitCount":0,"sound":{"type":"note","value":"A"}},{"id":3,"x":738,"y":569,"label":"C","visitCount":0,"sound":{"type":"note","value":"A"}},{"id":1,"x":436,"y":307,"label":"A","visitCount":0,"sound":{"type":"note","value":"A"}},{"id":4,"x":554,"y":76,"label":"D","visitCount":0,"sound":{"type":"note","value":"A"}}],"edges":[{"source":1,"target":1},{"source":1,"target":2},{"source":1,"target":3},{"source":2,"target":1},{"source":2,"target":2},{"source":2,"target":3},{"source":3,"target":1},{"source":3,"target":2},{"source":3,"target":3},{"source":4,"target":4},{"source":4,"target":5},{"source":5,"target":4},{"source":5,"target":5}],"selectedVertex":null,"draggingVertex":false,"edgeCreationMode":false,"edgeStartVertex":null,"edgeWeights":{"1":{"1":0.2,"2":0.5,"3":0.3},"2":{"1":0.2,"2":0.3,"3":0.5},"3":{"1":0.5,"2":0.3,"3":0.2},"4":{"4":0.3,"5":0.7},"5":{"4":0.7,"5":0.3}},"actualVertex":null,"audioContext":{},"vertexHistory":[],"centroid":{"x":736.8,"y":264},"centroidUpdateCounter":35,"config":{"speed":1}});
  };

  openExampleTwoClassesWithSmallJump = () => {
    GraphSchematicsManager.loadGraphState({"offsetX":-63,"offsetY":128,"width":1557,"height":1000,"scale":1,"vertices":[{"id":5,"x":965,"y":17,"label":"E","visitCount":0,"sound":{"type":"note","value":"A"}},{"id":2,"x":1049,"y":296,"label":"B","visitCount":0,"sound":{"type":"note","value":"A"}},{"id":3,"x":738,"y":569,"label":"C","visitCount":0,"sound":{"type":"note","value":"A"}},{"id":1,"x":436,"y":307,"label":"A","visitCount":0,"sound":{"type":"note","value":"A"}},{"id":4,"x":504,"y":26,"label":"D","visitCount":0,"sound":{"type":"note","value":"A"}}],"edges":[{"source":1,"target":1},{"source":1,"target":2},{"source":1,"target":3},{"source":2,"target":1},{"source":2,"target":2},{"source":2,"target":3},{"source":2,"target":4},{"source":3,"target":1},{"source":3,"target":2},{"source":3,"target":3},{"source":4,"target":2},{"source":4,"target":4},{"source":4,"target":5},{"source":5,"target":4},{"source":5,"target":5}],"selectedVertex":null,"draggingVertex":false,"edgeCreationMode":false,"edgeStartVertex":null,"edgeWeights":{"1":{"1":0.2,"2":0.5,"3":0.3},"2":{"1":0.3,"2":0.3,"3":0.3,"4":0.1},"3":{"1":0.5,"2":0.3,"3":0.2},"4":{"2":0.1,"4":0.4,"5":0.4},"5":{"4":0.7,"5":0.3}},"actualVertex":null,"audioContext":{},"vertexHistory":[],"centroid":{"x":738.4,"y":243},"centroidUpdateCounter":51,"config":{"speed":1}});
  };

  render() {
    return (
      <div className="navbar">
        <DetailsViewModal></DetailsViewModal>
        <CustomVerticeSongViewModal></CustomVerticeSongViewModal>
        <ConfigurationViewModal></ConfigurationViewModal>
        <AboutViewModal></AboutViewModal>
        <TreeLayoutConfigViewModal></TreeLayoutConfigViewModal>
        <RadialLayoutConfigViewModal></RadialLayoutConfigViewModal>
        <div className="navbar--button" onClick={() => GraphSchematicsManager.resetAll()}>
          <FormattedMessage id={"clear"}/>
        </div>
        <div className="navbar--button" onClick={() => document.getElementById('file-input')?.click()}>
          <input
            id="file-input"
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={(e) => {
              this.openGraph(e);
              e.target.value = '';
            }}
          />
          <label className="file-input-label">
            <FormattedMessage id={"open"}/>
          </label>
        </div>
        <div className="navbar--button" onClick={this.saveGraph}>
          <FormattedMessage id={"save"}/>
        </div>

        <div className="navbar--button-with-subnav">
          <div className="navbar--button">
            <div className="navbar--arrow-icon">▼</div> <FormattedMessage id={"examples"}/>
          </div>
          <div className="subnav--content">
            <a onClick={() => this.openExamplePeriodic()}><FormattedMessage id={"periodic_example"}/></a>
            <a onClick={() => this.openExampleCounter()}><FormattedMessage id={"counter_example"}/></a>
            <a onClick={() => this.openExampleTwoCommunicationClasses()}><FormattedMessage id={"two_communication_classes_example"}/></a>
            <a onClick={() => this.openExampleTwoClassesWithSmallJump()}><FormattedMessage id={"two_classes_with_small_jump_example"}/></a>
          </div>
        </div>

        <div className="navbar--button-with-subnav">
          <div className="navbar--button">
            <div className="navbar--arrow-icon">▼</div> <FormattedMessage id={"graph_layout_and_organization"}/>
          </div>
          <div className="subnav--content">
            <a onClick={() => GraphSchematicsManager.applyCircularLayout()}><FormattedMessage id={"circular_layout"}/></a>
            <a onClick={() => RadialLayoutConfigViewModal.openModal({})}><FormattedMessage id={"radial_layout"}/></a>
            <a onClick={() => TreeLayoutConfigViewModal.openModal({})}><FormattedMessage id={"tree_layout"}/></a>
            <a onClick={()=> GraphSchematicsManager.applyGridLayout()}><FormattedMessage id={"grid_layout"}/></a>
            <a onClick={()=> GraphSchematicsManager.applySpectralLayout()}><FormattedMessage id={"spectral_layout"}/></a>
            <a onClick={() => GraphSchematicsManager.applyFruchtermanReingold()}><FormattedMessage id={"fruchterman_reingold"}/></a>
            <a onClick={()=> GraphSchematicsManager.applyKamadaKawai()}><FormattedMessage id={"kamada_kawai"}/></a>
          </div>
        </div>

        <div className="navbar--button-with-subnav">
          <div className="navbar--button">
            <div className="navbar--arrow-icon">▼</div> <FormattedMessage id={"details"}/>
          </div>
          <div className="subnav--content">
            <a onClick={() => DetailsViewModal.openModal({})}><FormattedMessage id={"transition_matrix"}/></a>
            <a onClick={() => CustomVerticeSongViewModal.openModal({})}><FormattedMessage id={"custom_sounds"}/></a>
            <a onClick={() => ConfigurationViewModal.openModal({})}><FormattedMessage id={"configurations"}/></a>
          </div>
        </div>

        <div className="navbar--button" onClick={() => AboutViewModal.openModal({})}>
          <FormattedMessage id={"about"}/>
        </div>
      </div>
    )
  }
}
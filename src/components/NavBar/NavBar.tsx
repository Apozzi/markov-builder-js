import React from 'react';
import './NavBar.css';
import GraphSchematicsManager from '../GraphSchematics/GraphSchematicsManager';
import DetailsViewModal from '../DetailsViewModal/DetailsViewModal';
import AboutViewModal from '../AboutViewModal/AboutViewModal';
import CustomVerticeSongViewModal from '../CustomVerticeSongViewModal/CustomVerticeSongViewModal';
import ConfigurationViewModal from '../ConfigurationViewModal/ConfigurationViewModal';
import TreeLayoutConfigViewModal from '../TreeLayoutConfigViewModal/TreeLayoutConfigViewModal';
import RadialLayoutConfigViewModal from '../RadialLayoutConfigViewModal/RadialLayoutConfigViewModal';


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
          Limpar
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
            Abrir
          </label>
        </div>
        <div className="navbar--button" onClick={this.saveGraph}>
          Salvar
        </div>

        <div className="navbar--button-with-subnav">
          <div className="navbar--button">
            <div className="navbar--arrow-icon">▼</div> Exemplos
          </div>
          <div className="subnav--content">
            <a onClick={() => this.openExamplePeriodic()}>Periódico</a>
            <a onClick={() => this.openExampleCounter()}>Contador</a>
            <a onClick={() => this.openExampleTwoCommunicationClasses()}>Duas classes de Sem Comunicação</a>
            <a onClick={() => this.openExampleTwoClassesWithSmallJump()}>Duas classes com Pulo</a>
          </div>
        </div>

        <div className="navbar--button-with-subnav">
          <div className="navbar--button">
            <div className="navbar--arrow-icon">▼</div> Layout / Organização do Grafo
          </div>
          <div className="subnav--content">
            <a onClick={() => GraphSchematicsManager.applyCircularLayout()}>Layout Circular</a>
            <a onClick={() => RadialLayoutConfigViewModal.openModal({})}>Layout Radial</a>
            <a onClick={() => TreeLayoutConfigViewModal.openModal({})}>Layout de Árvore</a>
            <a onClick={()=> GraphSchematicsManager.applyGridLayout()}>Layout de Grade</a>
            <a onClick={()=> GraphSchematicsManager.applySpectralLayout()}>Layout de Espectro</a>
            <a onClick={() => GraphSchematicsManager.applyFruchtermanReingold()}>Aplicar Algoritmo de Fruchterman-Reingold</a>
            <a onClick={()=> GraphSchematicsManager.applyKamadaKawai()}>Aplicar Algoritmo de Kamada-Kawai</a>
          </div>
        </div>

        <div className="navbar--button-with-subnav">
          <div className="navbar--button">
            <div className="navbar--arrow-icon">▼</div> Detalhes
          </div>
          <div className="subnav--content">
            <a onClick={() => DetailsViewModal.openModal({})}>Matrix de Transição</a>
            <a onClick={() => CustomVerticeSongViewModal.openModal({})}> Customização de Sons</a>
            <a onClick={() => ConfigurationViewModal.openModal({})}> Configurações</a>
          </div>
        </div>

        <div className="navbar--button" onClick={() => AboutViewModal.openModal({})}>
          Sobre
        </div>
      </div>
    )
  }
}
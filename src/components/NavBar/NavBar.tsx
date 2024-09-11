import React from 'react';
import './NavBar.css';
import GraphSchematicsManager from '../GraphSchematics/GraphSchematicsManager';


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

  render() {
    return (
      <div className="navbar">

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
            <a>Periódico</a>
            <a>Contador</a>
            <a>Duas classes de Comunicação</a>
            <a>Duas classes com Pulo</a>
          </div>
        </div>

        <div className="navbar--button-with-subnav">
          <div className="navbar--button">
            <div className="navbar--arrow-icon">▼</div> Layout / Organização do Grafo
          </div>
          <div className="subnav--content">
            <a>...</a>
            <a>...</a>
          </div>
        </div>

        <div className="navbar--button">
          Detalhes
        </div>
      </div>
    )
  }
}
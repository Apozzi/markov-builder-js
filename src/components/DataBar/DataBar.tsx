import React from 'react';
import './DataBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faTrash } from '@fortawesome/free-solid-svg-icons';
import GraphSchematicsManager from '../GraphSchematics/GraphSchematicsManager';

export default class DataBar extends React.Component<any> {

  state = {
    isPlaying: false,
    selectedVertex: {
      id: 0,
      label: '',
      visitCount: 0
    },
    edges: [],
    vertices: [],
    vertexVisitCount: 0,
    isNotVisible: true 
  };

  componentDidMount() {
      GraphSchematicsManager.onVertexSelected().subscribe((vertex:any) => {
        if (vertex) {
          this.setState({
            selectedVertex: vertex,
            edges: vertex.edges
          });
        } else {
          this.setState({
            isNotVisible: true
          });
        }
      });
      GraphSchematicsManager.onChangeVerticeArray().subscribe((vertices:any) => {
        if (!vertices && vertices.length > 1) return;
        const { selectedVertex } = this.state;
        const newSelectedVertex = vertices.find((vertex:any) => vertex.id === selectedVertex.id)
        this.setState({vertices, selectedVertex: newSelectedVertex ? newSelectedVertex : selectedVertex });
        this.forceUpdate();
      })
  }

  toggleVisibility = () => {
    this.setState((prevState: any) => ({
      isNotVisible: !prevState.isNotVisible
    }));
  };

  handleVertexChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ 
      selectedVertex: {
        ...this.state.selectedVertex,
        label: event.target.value
      }
    });
    GraphSchematicsManager.changeVertex({
        ...this.state.selectedVertex,
        label: event.target.value
    });
  };

  handleDeleteEdge = (edge: any) => {
    GraphSchematicsManager.deleteEdge(edge);
    this.setState({
      edges: this.state.edges.filter(e => this.getEdgeLabel(e) !== this.getEdgeLabel(edge))
    });
  };

  getEdgeLabel(edge:any) {
    return edge.source + '-' + edge.target;
  }

  render() {
    const { selectedVertex, edges, isNotVisible } = this.state;

    return (
      <div className={`databar ${isNotVisible ? '' : 'databar-show'}`}>
        <div className={`databar-topbar ${isNotVisible ? '' : 'databar-topbar-show'}`}>
          <FontAwesomeIcon 
            icon={isNotVisible ? faChevronLeft : faChevronRight} 
            size="lg" 
            className='databar-topbar--icon' 
            onClick={this.toggleVisibility} 
          />
        </div>
        <div className='databar-content'>
          <h3>Vértice</h3>
          <select className='databar--select' value={selectedVertex.label} onChange={this.handleVertexChange}>
            {Array.from({ length: 26 }, (_, i) => {
              let letter = String.fromCharCode(65 + i);
              if (this.state.vertices.find(
                (vertice:any) => vertice.label === letter && selectedVertex.label !== letter)
              ) return null;
              return (
                <option key={i} value={letter}>
                  {letter}
                </option>
              )
            })}
          </select>

          <h3>Arestas</h3>
          <ul>
            {edges.map((edge, index) => (
              <li key={index}>
                {this.getEdgeLabel(edge)}
                <button onClick={() => this.handleDeleteEdge(edge)} className='databar--button-delete-edge'>
                  <FontAwesomeIcon icon={faTrash} size="lg" className='graph-schematics--trash-icon'/>
                </button>
              </li>
            ))}
          </ul>

          <div className="vertex-info">
            <h4>Quant. de vezes que passou nesse vértice:</h4>
            <span className="vertex-count">{selectedVertex.visitCount}</span>
          </div>
        </div>
      </div>
    )
  }
}

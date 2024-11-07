import React from 'react';
import Modal from 'react-modal';
import { Subject } from 'rxjs';
import './DetailsViewModal.css';
import GraphSchematicsManager from '../GraphSchematics/GraphSchematicsManager';
import toast from 'react-hot-toast';
import { Vertex } from '../../interfaces/Vertex';
import { FormattedMessage } from 'react-intl';

interface EdgeWeights {
  [sourceId: number]: {
    [targetId: number]: number;
  };
}

export default class DetailsViewModal extends React.Component<any> {
  static openSubject = new Subject();

  customStyles = {
    content : {
      height: '80%',
      background: 'rgb(49,42,44)',
      border: 'none',
      padding: "0px"
    }
  };

  state = {
    showModal: false,
    verticesBck: [] as Vertex[],
    vertices: [] as Vertex[],
    edgeWeights: {} as EdgeWeights,
    edgeWeightsBck: {} as EdgeWeights,
  };

  static openModal(obj: any) {
    this.openSubject.next(obj);
  }

  componentDidMount() {
    Modal.setAppElement('#app');
    DetailsViewModal.openSubject.subscribe(() => {
      this.setState({ showModal: true, vertices: this.state.verticesBck, edgeWeights: this.state.edgeWeightsBck});
      GraphSchematicsManager.setPlayOrStop(false);
    });

    GraphSchematicsManager.onChangeVerticeArray().subscribe((vertices: any) => {
      this.setState({ vertices, verticesBck: vertices});
    });

    GraphSchematicsManager.onChangeGraphState().subscribe((state: any) => {
      if (state && state.edgeWeights) {
        this.setState({ edgeWeights: state.edgeWeights, edgeWeightsBck: state.edgeWeights });
      }
    });
    
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  handleInputChange = (sourceId: number, targetId: number, value: string) => {
    if (value === '' || /^\d*\.?\d*$|^\d+\.$/.test(value)) {
      const newEdgeWeights = { ...this.state.edgeWeights };
      
      if (!newEdgeWeights[sourceId]) {
        newEdgeWeights[sourceId] = {};
      }
      
      if (value === '') {
        delete newEdgeWeights[sourceId][targetId];
        if (Object.keys(newEdgeWeights[sourceId]).length === 0) {
          delete newEdgeWeights[sourceId];
        }
      } else {
        newEdgeWeights[sourceId][targetId] = parseFloat(value);
      }

      this.setState({ edgeWeights: newEdgeWeights });
    }
  }

  getEdgeWeight = (sourceId: number, targetId: number): string => {
    if (this.state.edgeWeights[sourceId]?.[targetId] !== undefined) {
      const weight = this.state.edgeWeights[sourceId]?.[targetId];
      return weight !== undefined ? (weight.toFixed(0) === weight.toString() ? weight+ '.0' : weight.toString() )  : '0.0'; 
    }
    return '';
  }

  getNextAvailableLabel = (): string => {
    const labels = this.state.vertices.map(v => v.label);
    for (let i = 65; i < 91; i++) {
      const letter = String.fromCharCode(i);
      if (!labels.includes(letter)) {
        return letter;
      }
    }
    return String.fromCharCode(65 + labels.length);
  }

  addVertex = () => {
    const newVertex: Vertex = {
      id: this.state.vertices.length + 1,
      label: this.getNextAvailableLabel(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      visitCount: 0
    };
    this.setState((prevState:any) => ({
      vertices: [...prevState.vertices, newVertex]
    }), () => {
      this.forceUpdate();
    });
  }

  deleteLastVertex = () => {
    const updatedVertices = this.state.vertices.slice(0, -1);
    this.setState({ vertices: updatedVertices }, () => {
      this.forceUpdate();
    });
  }

  applyChangesOnTheGraph = () => {
    let { vertices, edgeWeights } = this.state;
    const edges: any = [];
    Object.entries(edgeWeights).forEach(([sourceId, targets]) => {
      Object.entries(targets).forEach(([targetId, weight] : any[]) => {
        if (weight > 0) {
          edges.push({
            source: parseInt(sourceId),
            target: parseInt(targetId)
          });
        }
      });
    });
    GraphSchematicsManager.updateVerticesEdges(vertices, edges, edgeWeights);
    this.setState({ 
      verticesBck: [...vertices],
      edgeWeightsBck: {...edgeWeights}
    });
    this.handleCloseModal();
    toast("Aplicado com Sucesso.");
  }

  render() {
    return (
      <div>
        <Modal
           isOpen={this.state.showModal}
           contentLabel="Project"
           style={this.customStyles}
           onRequestClose={() => this.handleCloseModal()}
           overlayClassName="overlay"
        >
          <div className="modal-header">
            <div className="modal-title">
              <FormattedMessage id={"details"}/>
            </div>
            <div className="modal-close-icon" onClick={() => this.handleCloseModal()}>
              X
            </div>
          </div>

          <div className='modal-content-extra'> 
            <div>
              <h3> <FormattedMessage id={"transition_matrix"}/></h3>
              {this.state.vertices.length === 0 ? <h2>
                <FormattedMessage id={"no_vertices_added"}/>
                </h2>: <table className="transition-matrix">
                <thead>
                  <tr>
                    <th></th>
                    {this.state.vertices.map((vertex) => (
                      <th key={vertex.id}>{vertex.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {this.state.vertices.map((sourceVertex) => (
                    <tr key={sourceVertex.id}>
                      <td>{sourceVertex.label}</td>
                      {this.state.vertices.map((targetVertex) => (
                        <td key={`${sourceVertex.id}-${targetVertex.id}`}>
                          <input
                            type="number"
                            step="0.1"
                            className="matrix-input"
                            value={this.getEdgeWeight(sourceVertex.id, targetVertex.id)}
                            onChange={(e) => this.handleInputChange(sourceVertex.id, targetVertex.id, e.target.value)}
                            placeholder="0"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>}

              <div className='manipulation-buttons-transition-matrix'>
                <button className='next-button button' onClick={this.applyChangesOnTheGraph}><FormattedMessage id={"apply_to_graph"}/></button>
                <button className='confirmation-button button' onClick={this.addVertex}><FormattedMessage id={"add_vertex"}/></button>
                <button className='cancel-button button' onClick={this.deleteLastVertex}><FormattedMessage id={"delete_last_vertex"}/></button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

import React from 'react';
import Modal from 'react-modal';
import { Subject } from 'rxjs';
import './RadialLayoutConfigViewModal.css';
import GraphSchematicsManager from '../GraphSchematics/GraphSchematicsManager';
import { Vertex } from '../../interfaces/Vertex';

interface State {
  showModal: boolean;
  vertices: Vertex[]
  selectedVertice: Vertex | null
}

export default class RadialLayoutConfigViewModal extends React.Component<any, State> {
  static openSubject = new Subject();

  customStyles = {
    content: {
      height: '330px',
      background: 'rgb(49,42,44)',
      border: 'none',
      padding: "0px"
    }
  };

  state: State = {
    showModal: false,
    vertices: [],
    selectedVertice: null
  };

  static openModal(obj: any) {
    this.openSubject.next(obj);
  }

  componentDidMount() {
    Modal.setAppElement('#app');
    RadialLayoutConfigViewModal.openSubject.subscribe(() => {
      this.setState({ showModal: true });
      GraphSchematicsManager.setPlayOrStop(false);
    });
    
    GraphSchematicsManager.onChangeVerticeArray().subscribe((vertices: any) => {
      this.setState({ vertices });
    });
  }

  handleCloseModal = () => {
    this.setState({ showModal: false });
  }

  handleSelectVerticeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(event.target.value);
    const selectedVertice = this.state.vertices.find(v => v.id === selectedId) || null;
    this.setState({ selectedVertice });
  }

  applyChanges = () => {
    GraphSchematicsManager.applyRadialLayout(this.state.selectedVertice);
    this.handleCloseModal();
  }

  render() {
    return (
      <div>
        <Modal
          isOpen={this.state.showModal}
          contentLabel="Project"
          style={this.customStyles}
          onRequestClose={this.handleCloseModal}
          overlayClassName="overlay"
          className={'content-about'}
        >
          <div className="modal-header">
            <div className="modal-title">
              Configurações Layout de Árvore
            </div>
            <div className="modal-close-icon" onClick={this.handleCloseModal}>
              X
            </div>
          </div>

          <div className='modal-content-extra'> 
            <div className='pad-15'>
              <label className="vertex-select-label">
                Selecione o Vértice Raiz:
                <select 
                  value={this.state.selectedVertice?.id || ''} 
                  onChange={this.handleSelectVerticeChange}
                  className="vertex-select"
                >
                  <option value="">Selecione um vértice</option>
                  {this.state.vertices.map(vertex => (
                    <option key={vertex.id} value={vertex.id}>
                      {`${vertex.label} (ID: ${vertex.id})`}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className='pad-15'>
              <button 
                className="save-button" 
                onClick={() => this.applyChanges()}
              >
                Aplicar Layout Radial
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
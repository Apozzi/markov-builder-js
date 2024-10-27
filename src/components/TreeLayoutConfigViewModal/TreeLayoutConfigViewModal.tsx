import React from 'react';
import Modal from 'react-modal';
import { Subject } from 'rxjs';
import './TreeLayoutConfigViewModal.css';
import GraphSchematicsManager from '../GraphSchematics/GraphSchematicsManager';

interface State {
  showModal: boolean;
  invertAxis: boolean;
}

export default class TreeLayoutConfigViewModal extends React.Component<any, State> {
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
    invertAxis: false
  };

  static openModal(obj: any) {
    this.openSubject.next(obj);
  }

  componentDidMount() {
    Modal.setAppElement('#app');
    TreeLayoutConfigViewModal.openSubject.subscribe(() => {
      this.setState({ showModal: true });
      GraphSchematicsManager.setPlayOrStop(false);
    });
  }

  handleCloseModal = () => {
    this.setState({ showModal: false });
  }

  handleShowSoundInfoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ invertAxis: event.target.checked });
  }

  applyChanges = () => {
    GraphSchematicsManager.applyTreeLayout(this.state.invertAxis)
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

          <h4>Obs.: O layout pode ficar caótico caso ouver algum ciclo dentro do grafo.</h4>

            <div className='pad-15'>
              <label className="sound-info-label">
                <input 
                  type="checkbox" 
                  checked={this.state.invertAxis} 
                  onChange={this.handleShowSoundInfoChange}
                />
                <span className="switch"></span>
                <div className='switch-text'>Inverter Eixo</div>
              </label>
            </div>

            <div className='pad-15'>
              <button className="save-button" onClick={() => this.applyChanges()}>
                Aplicar Layout de Árvore
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
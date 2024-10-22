import React from 'react';
import Modal from 'react-modal';
import { Subject } from 'rxjs';
import './ConfigurationViewModal.css';
import GraphSchematicsManager from '../GraphSchematics/GraphSchematicsManager';
import toast from 'react-hot-toast';

interface State {
  showModal: boolean;
  speed: number;
  showSoundInfo: boolean;
}

export default class ConfigurationViewModal extends React.Component<any, State> {
  static openSubject = new Subject();

  customStyles = {
    content: {
      height: '60%',
      background: 'rgb(49,42,44)',
      border: 'none',
      padding: "0px"
    }
  };

  state: State = {
    showModal: false,
    speed: 1,
    showSoundInfo: false
  };

  static openModal(obj: any) {
    this.openSubject.next(obj);
  }

  componentDidMount() {
    Modal.setAppElement('#app');
    ConfigurationViewModal.openSubject.subscribe(() => {
      this.setState({ showModal: true });
      GraphSchematicsManager.setPlayOrStop(false);
    });
  }

  handleCloseModal = () => {
    this.setState({ showModal: false });
  }

  handleSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = parseFloat(event.target.value);
    this.setState({ speed: newSpeed });
  }

  handleShowSoundInfoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ showSoundInfo: event.target.checked });
  }

  applyChanges = () => {
    let { speed } = this.state;
    GraphSchematicsManager.toggleSongInfo(this.state.showSoundInfo);
    GraphSchematicsManager.setConfig({
      speed
    });
    toast('Salvo com Sucesso.');
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
              Configurações
            </div>
            <div className="modal-close-icon" onClick={this.handleCloseModal}>
              X
            </div>
          </div>

          <div className='modal-content-extra'> 
            {/* Controle de Velocidade */}
            <div className='pad-15'>
              <div className="speed-control">
                <label htmlFor="speed-range">Velocidade:</label>
                <input
                  type="range"
                  id="speed-range"
                  min="0.001"
                  max="100"
                  step="0.5"
                  value={this.state.speed}
                  onChange={this.handleSpeedChange}
                />
                <span>{this.state.speed}x</span>
              </div>
            </div>

            <div className='pad-15'>
              <label className="sound-info-label">
                <input 
                  type="checkbox" 
                  checked={this.state.showSoundInfo} 
                  onChange={this.handleShowSoundInfoChange}
                />
                <span className="switch"></span>
                <div className='switch-text'>Mostrar informações de Som (Na interface UI)</div>
              </label>
            </div>

            <div className='pad-15'>
              <button className="save-button" onClick={() => this.applyChanges()}>
                Aplicar Configurações
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
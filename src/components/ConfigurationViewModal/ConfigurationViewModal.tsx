import React from 'react';
import Modal from 'react-modal';
import { Subject } from 'rxjs';
import './ConfigurationViewModal.css';
import GraphSchematicsManager from '../GraphSchematics/GraphSchematicsManager';
import toast from 'react-hot-toast';
import { FormattedMessage } from 'react-intl';
import { LOCALES } from '../../i18n/locales';
import { MdFlag } from 'react-icons/md';
import { FaFlagUsa } from 'react-icons/fa';
import App from '../../App';
import { Locale } from '../../i18n/messages';

interface State {
  showModal: boolean;
  speed: number;
  showSoundInfo: boolean;
  language: string;
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
    showSoundInfo: false,
    language: LOCALES.PORTUGUESE
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

  handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = event.target.value;
    this.setState({ language: newLanguage });
    App.changeLanguage(newLanguage as Locale)
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
              <FormattedMessage id={"configurations_header"}/>
            </div>
            <div className="modal-close-icon" onClick={this.handleCloseModal}>
              X
            </div>
          </div>

          <div className='modal-content-extra'> 
            {/* Controle de Velocidade */}
            <div className='pad-15'>
              <div className="speed-control">
                <label htmlFor="speed-range"><FormattedMessage id={"speed"}/>:</label>
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
                <div className='switch-text'><FormattedMessage id={"show_sound_info"}/></div>
              </label>
            </div>

            {/* Seleção de Idioma */}
            <div className="pad-15">
              <label htmlFor="language-select" className="language-label">
                <FormattedMessage id="select_language" />
              </label>
              <div className="language-select-wrapper">
                <select
                  id="language-select"
                  value={this.state.language}
                  onChange={this.handleLanguageChange}
                  className="selector"
                >
                  <option value={LOCALES.PORTUGUESE}>
                    <MdFlag className="flag-icon" /> Português
                  </option>
                  <option value={LOCALES.ENGLISH}>
                    <FaFlagUsa className="flag-icon" /> English
                  </option>
                  {/* Adicione outros idiomas suportados com ícones apropriados */}
                </select>
              </div>
            </div>

            <div className='pad-15'>
              <button className="save-button" onClick={() => this.applyChanges()}>
                <FormattedMessage id={"apply_configurations"}/>
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
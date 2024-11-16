import React from 'react';
import Modal from 'react-modal';
import { Subject } from 'rxjs';
import './CustomVerticeSongViewModal.css';
import GraphSchematicsManager from '../GraphSchematics/GraphSchematicsManager';
import { NotaMusical } from '../../utils/NotasMusicaisEnum';
import toast from 'react-hot-toast';
import { Vertex } from '../../interfaces/Vertex';
import { FormattedMessage, injectIntl } from 'react-intl';

interface State {
  showModal: boolean;
  vertices: Vertex[];
  selectedType: { [key: number]: 'note' | 'custom' };
  customUrls: { [key: number]: string };
  selectedNotes: { [key: number]: NotaMusical };
  showSoundInfo: boolean; 
}

class CustomVerticeSongViewModal extends React.Component<any, State> {
  static openSubject = new Subject();

  customStyles = {
    content: {
      height: '80%',
      background: 'rgb(49,42,44)',
      border: 'none',
      padding: "0px"
    }
  };

  state: State = {
    showModal: false,
    vertices: [],
    selectedType: {},
    customUrls: {},
    selectedNotes: {},
    showSoundInfo: false
  };

  static openModal(obj: any) {
    this.openSubject.next(obj);
  }

  componentDidMount() {
    Modal.setAppElement('#app');

    GraphSchematicsManager.onChangeVerticeArray().subscribe((vertices: any) => {
      const selectedType: { [key: number]: 'note' | 'custom' } = {};
      const customUrls: { [key: number]: string } = {};
      const selectedNotes: { [key: number]: NotaMusical } = {};

      vertices.forEach((vertex : any) => {
        if (vertex.sound) {
          selectedType[vertex.id] = vertex.sound.type;
          if (vertex.sound.type === 'note') {
            selectedNotes[vertex.id] = vertex.sound.value as NotaMusical;
          } else {
            customUrls[vertex.id] = vertex.sound.value as string;
          }
        } else {
          selectedType[vertex.id] = 'note';
          selectedNotes[vertex.id] = NotaMusical.DO;
        }
      });

      this.setState({ vertices, selectedType, customUrls, selectedNotes });
    });

    CustomVerticeSongViewModal.openSubject.subscribe(() => {
      this.setState({ showModal: true });
      GraphSchematicsManager.setPlayOrStop(false);
    });
  }

  handleCloseModal = () => {
    this.setState({ showModal: false });
  }

  handleTypeChange = (vertexId: number, type: 'note' | 'custom') => {
    this.setState(prevState => ({
      selectedType: {
        ...prevState.selectedType,
        [vertexId]: type
      }
    }));
  }

  handleNoteChange = (vertexId: number, note: NotaMusical) => {
    this.setState(prevState => ({
      selectedNotes: {
        ...prevState.selectedNotes,
        [vertexId]: note
      }
    }));
  }

  handleUrlChange = (vertexId: number, url: string) => {
    this.setState(prevState => ({
      customUrls: {
        ...prevState.customUrls,
        [vertexId]: url
      }
    }));
  }

  handleSave = () => {
    const {intl} = this.props;
    const updatedVertices = this.state.vertices.map(vertex => ({
      ...vertex,
      sound: {
        type: this.state.selectedType[vertex.id],
        value: this.state.selectedType[vertex.id] === 'note' 
          ? this.state.selectedNotes[vertex.id]
          : this.state.customUrls[vertex.id]
      }
    }));

    GraphSchematicsManager.updateVertices(updatedVertices);
    this.handleCloseModal();
    toast(intl.formatMessage({ id: 'saved_successfully' }));
  }

  handleShowSoundInfoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ showSoundInfo: event.target.checked });
    GraphSchematicsManager.toggleSongInfo(event.target.checked);
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
        >
          <div className="modal-header">
            <div className="modal-title">
              <FormattedMessage id={"custom_sound_header"}/>
            </div>
            <div className="modal-close-icon" onClick={this.handleCloseModal}>
              X
            </div>
          </div>

          <div className='modal-content-extra'> 
            <div className="vertex-sound-config">
              {this.state.vertices.length === 0 ? (
                <h2><FormattedMessage id={"no_vertices_added"}/></h2>
              ) : (
                this.state.vertices.map(vertex => (
                  <div key={vertex.id} className="vertex-config-item">
                    <h3>Vértice {vertex.label}</h3>
                    <div className="sound-type-selector">
                      <label>
                        <input
                          type="radio"
                          value="note"
                          checked={this.state.selectedType[vertex.id] === 'note'}
                          onChange={() => this.handleTypeChange(vertex.id, 'note')}
                        />
                        <FormattedMessage id={"musical_note"}/>
                      </label>
                      <label>
                        <input
                          type="radio"
                          value="custom"
                          checked={this.state.selectedType[vertex.id] === 'custom'}
                          onChange={() => this.handleTypeChange(vertex.id, 'custom')}
                        />
                        <FormattedMessage id={"custom_sound"}/>
                      </label>
                    </div>

                    {this.state.selectedType[vertex.id] === 'note' ? (
                      <select
                        value={this.state.selectedNotes[vertex.id]}
                        onChange={(e) => this.handleNoteChange(vertex.id, e.target.value as NotaMusical)}
                        className="selector"
                      >
                        {Object.entries(NotaMusical).map(([key, value]) => (
                          <option key={key} value={value}>{value}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={this.state.customUrls[vertex.id] || ''}
                        onChange={(e) => this.handleUrlChange(vertex.id, e.target.value)}
                        placeholder="URL do arquivo de áudio (mp3)"
                        className="url-input"
                      />
                    )}
                  </div>
                ))
              )}
            </div>
            
            {this.state.vertices.length > 0 && (
              <div className="modal-actions">
                <label className="sound-info-label">
                  <input 
                    type="checkbox" 
                    checked={this.state.showSoundInfo} 
                    onChange={this.handleShowSoundInfoChange}
                  />
                  <span className="switch"></span>
                  <div className='switch-text'><FormattedMessage id={"show_sound_info"}/></div>
                </label>
                <button className="save-button" onClick={this.handleSave}>
                  <FormattedMessage id={"save_configurations"}/>
                </button>
              </div>
            )}
          </div>
        </Modal>
      </div>
    );
  }
}

export default injectIntl(CustomVerticeSongViewModal);
import React from 'react';
import Modal from 'react-modal';
import { Subject } from 'rxjs';
import './AboutViewModal.css';
import AdevLogo from '../../assets/adev.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { FormattedMessage } from 'react-intl';

export default class AboutViewModal extends React.Component<any> {
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
    label: '',
    value: 0,
    index: 0
  };

  static openModal(obj: any) {
    this.openSubject.next(obj);
  }


  componentDidMount() {
    Modal.setAppElement('#app');
    AboutViewModal.openSubject.subscribe(() => {
      this.setState({ showModal: true });
    });
  }

  handleCloseModal () {
    this.setState({ showModal: false });
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
           className='content-about'
        >
          <div className="modal-header">
            <div className="modal-title">
              <FormattedMessage id={"about"}/>
            </div>
            <div className="modal-close-icon" onClick={() => this.handleCloseModal()}>
              X
            </div>
          </div>
          <div className='develeped-by'>
            <FormattedMessage id={"developed_by"}/>
          </div>
          <img src={AdevLogo} className='logo'></img>
          <div className='name'>
            Anderson Rodrigo Pozzi
          </div>
          <pre className='about-desc'>
          2024 Anderson R. Pozzi.<br></br>
          <FormattedMessage id={"all_rights_reserved"}/><br></br><br></br>

           <FormattedMessage id={"Contato"}/>:<br></br>
              eanderea1@gmail.com<br></br>
              adeveloper.com.br
          </pre>

          <div className='icons-container'>
            <a href="https://www.linkedin.com/in/anderson-rodrigo-pozzi-a06246186/"><FontAwesomeIcon icon={faLinkedin} /></a>
            <a href="https://github.com/Apozzi"><FontAwesomeIcon icon={faGithub} /></a>
          </div>

        </Modal>
      </div>
    )
  }
}
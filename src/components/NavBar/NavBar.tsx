import React from 'react';
import './NavBar.css';


export default class NavBar extends React.Component<any> {


  render() {
    return (
      <div className="navbar">

        <div className="navbar--button">
          Limpar
        </div>
        <div className="navbar--button">
          Abrir
        </div>
        <div className="navbar--button">
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
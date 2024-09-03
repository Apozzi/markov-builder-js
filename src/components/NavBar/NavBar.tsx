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
      </div>
    )
  }
}
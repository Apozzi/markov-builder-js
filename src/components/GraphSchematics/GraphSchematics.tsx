import React from 'react';
import './GraphSchematics.css';

export default class GraphSchematics extends React.Component<{isPlaying : boolean}> {

  state = {
    isPlaying: false
  };

  componentDidMount() {

  }

  render() {
    return (
      <div id="GraphSchmatics" className="graph-schematics">

      </div>
    )
  }

}
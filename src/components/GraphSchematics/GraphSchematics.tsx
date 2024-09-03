import React from 'react';
import './GraphSchematics.css';
const offsetWidth = 180;

export default class GraphSchematics extends React.Component<{}, { offsetX: number; offsetY: number, width: number, height: number }> {

  constructor(props: any) {
    super(props);
    
    this.state = {
      offsetX: 0,
      offsetY: 0,
      width: window.innerWidth - offsetWidth,
      height: window.innerHeight,
    };
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.setState({
      width: window.innerWidth - offsetWidth,
      height: window.innerHeight
    });
  };

  handleMouseDown = (event: React.MouseEvent) => {
    this.isDragging = true;
    this.startX = event.clientX;
    this.startY = event.clientY;
  };

  handleMouseMove = (event: React.MouseEvent) => {
    if (!this.isDragging) return;

    const deltaX = event.clientX - this.startX;
    const deltaY = event.clientY - this.startY;

    this.setState(prevState => ({
      offsetX: prevState.offsetX + deltaX,
      offsetY: prevState.offsetY + deltaY,
    }));

    this.startX = event.clientX;
    this.startY = event.clientY;
  };

  handleMouseUp = () => {
    this.isDragging = false;
  };

  renderGrid() {
    const { offsetX, offsetY, width, height } = this.state;
    const gridSize = 50;
    const lines = [];
    const extraLines = 300;

    for (let x = offsetX % gridSize - gridSize * extraLines; x < width + gridSize * extraLines; x += gridSize) {
      lines.push(
        <line key={`v-${x}`} x1={x} y1={-gridSize * extraLines} x2={x} y2={height + gridSize * extraLines} stroke="#453138" strokeWidth="1" />
      );
    }
    for (let y = offsetY % gridSize - gridSize * extraLines; y < height + gridSize * extraLines; y += gridSize) {
      lines.push(
        <line key={`h-${y}`} x1={-gridSize * extraLines} y1={y} x2={width + gridSize * extraLines} y2={y} stroke="#453138" strokeWidth="1" />
      );
    }

    return lines;
  }

  render() {
    const { width, height } = this.state;

    return (
      <div id="GraphSchematics" className="graph-schematics"
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}
        onMouseLeave={this.handleMouseUp}
        style={{ cursor: this.isDragging ? 'grabbing' : 'grab' }}
      >
        <svg width={width} height={height}>
          <g transform={`translate(${this.state.offsetX},${this.state.offsetY})`}>
            {this.renderGrid()}
          </g>
        </svg>
      </div>
    )
  }

  private isDragging: boolean;
  private startX: number;
  private startY: number;
}
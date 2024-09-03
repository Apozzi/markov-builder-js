import React from 'react';
import './GraphSchematics.css';

const offsetWidth = 180;
const windowOffsetX = 170;
const windowOffsetY= 60;
const minZoom = 0.5;
const maxZoom = 2.5;

interface Vertex {
  x: number;
  y: number;
  label: string;
}

export default class GraphSchematics extends React.Component<{}, { offsetX: number; offsetY: number, width: number, height: number, scale: number, vertices: Vertex[] }> {

  constructor(props: any) {
    super(props);
    
    this.state = {
      offsetX: 0,
      offsetY: 0,
      width: window.innerWidth - offsetWidth,
      height: window.innerHeight,
      scale: 1,
      vertices: [],
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
    if (event.button === 2) { // Clique com o botão direito do mouse
      const x = event.clientX-windowOffsetX;
      const y = event.clientY-windowOffsetY;
      this.addVertex(x, y, 'A');
    } else {
      this.isDragging = true;
      this.startX = event.clientX;
      this.startY = event.clientY;
    }
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

  handleWheel = (event: React.WheelEvent) => {
    event.preventDefault();
    const scaleAmount = -event.deltaY * 0.001;
    this.setState(prevState => {
      const newScale = Math.min(maxZoom, Math.max(minZoom, prevState.scale + scaleAmount));
      return { scale: newScale };
    });
  };

  addVertex = (x: number, y: number, label: string) => {
    this.setState(prevState => ({
      vertices: [...prevState.vertices, {
        x: (x - prevState.offsetX) / (prevState.scale**2),
        y: (y - prevState.offsetY) / (prevState.scale**2),
        label
      }]
    }));
  };

  renderGrid() {
    const { width, height, scale } = this.state;
    const gridSize = 50;
    const lines = [];
    const extraLines = 300;
    const scaledGridSize = gridSize * scale;

    for (let x = - scaledGridSize * extraLines; x < width + scaledGridSize * extraLines; x += scaledGridSize) {
      lines.push(
        <line key={`v-${x}`} x1={x} y1={-scaledGridSize * extraLines} x2={x} y2={height + scaledGridSize * extraLines} stroke="#453138" strokeWidth="1" />
      );
    }
    for (let y = - scaledGridSize * extraLines; y < height + scaledGridSize * extraLines; y += scaledGridSize) {
      lines.push(
        <line key={`h-${y}`} x1={-scaledGridSize * extraLines} y1={y} x2={width + scaledGridSize * extraLines} y2={y} stroke="#453138" strokeWidth="1" />
      );
    }

    return lines;
  }

  renderVertices() {
    const { vertices, scale } = this.state;
    return vertices.map((vertex, index) => (
      <g key={index} transform={`translate(${vertex.x * scale},${vertex.y * scale})`}>
        <circle cx={0} cy={0} r={40} fill="#21171c" />
        <text x={0} y={9} textAnchor="middle" fill="white" fontSize={30}>{vertex.label}</text>
      </g>
    ));
  }

  render() {
    const { width, height } = this.state;

    return (
      <div id="GraphSchematics" className="graph-schematics"
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}
        onMouseLeave={this.handleMouseUp}
        onWheel={this.handleWheel}
        style={{ cursor: this.isDragging ? 'grabbing' : 'grab' }}
      >
        <svg width={width} height={height}>
          <g transform={`translate(${this.state.offsetX},${this.state.offsetY}) scale(${this.state.scale})`}>
            {this.renderGrid()}
            {this.renderVertices()}
          </g>
        </svg>
      </div>
    )
  }

  private isDragging: boolean;
  private startX: number;
  private startY: number;
}

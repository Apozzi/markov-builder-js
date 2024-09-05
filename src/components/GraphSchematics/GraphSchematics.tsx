import React from 'react';
import './GraphSchematics.css';
import GraphSchematicsManager from './GraphSchematicsManager';
import AlphabetIterator from '../../utils/AlphabetIterator';

const offsetWidth = 180;
const minZoom = 0.5;
const maxZoom = 2.5;
const vertexRadius = 40;
const selectionBorderSize = 20
const minDistance = vertexRadius * 2 + selectionBorderSize;

interface Vertex {
  x: number;
  y: number;
  label: string;
}

interface Edge {
  source: number;
  target: number;
}

let mounted = false;
export default class GraphSchematics extends React.Component<{}, { 
  offsetX: number; 
  offsetY: number, 
  width: number, 
  height: number, 
  scale: number, 
  vertices: Vertex[], 
  edges: Edge[],
  selectedVertex: number | null, 
  draggingVertex: boolean,
  edgeCreationMode: boolean,
  edgeStartVertex: number | null
}> {

  constructor(props: any) {
    super(props);
    
    this.state = {
      offsetX: 0,
      offsetY: 0,
      width: window.innerWidth - offsetWidth,
      height: window.innerHeight,
      scale: 1,
      vertices: [],
      edges: [],
      selectedVertex: null,
      draggingVertex: false,
      edgeCreationMode: false,
      edgeStartVertex: null
    };
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    if (!mounted) {
      GraphSchematicsManager.onAddVertex().subscribe((data:any) => this.addVertex(data.x, data.y, data.label));
      GraphSchematicsManager.edgeCreationMode().subscribe(() => this.toggleEdgeCreationMode());
    }
    mounted = true;
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

  handleVertexMouseDown = (event: React.MouseEvent, index: number) => {
    if (this.state.edgeCreationMode) {
      if (this.state.edgeStartVertex === null) {
        this.setState({ edgeStartVertex: index });
      } else {
        this.addEdge(this.state.edgeStartVertex, index);
        this.setState({ edgeCreationMode: false, edgeStartVertex: null });
        GraphSchematicsManager.exitEdgeCreationMode();
      }
    } else {
      this.setState({ draggingVertex: true, selectedVertex: index });
      this.startX = event.clientX;
      this.startY = event.clientY;
    }
  };

  handleMouseDown = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    const { selectedVertex } = this.state;
  
    // Verifica se o clique foi fora de um círculo ou retângulo
    if (selectedVertex !== null && target.tagName !== 'circle' && target.tagName !== 'rect') {
      this.setState({ selectedVertex: null });
    }
  
    if (!this.state.edgeCreationMode) {
      this.isDragging = true;
      this.startX = event.clientX;
      this.startY = event.clientY;
    }
  };

  handleMouseMove = (event: React.MouseEvent) => {
    if (!this.isDragging) return;

    const { draggingVertex, selectedVertex, vertices, scale } = this.state;

    if (draggingVertex && selectedVertex !== null) {
      const deltaX = (event.clientX - this.startX) / (scale**2);
      const deltaY = (event.clientY - this.startY) / (scale**2);

      const newX = vertices[selectedVertex].x + deltaX;
      const newY = vertices[selectedVertex].y + deltaY;

      const isColliding = vertices.some((vertex, index) => {
        if (index === selectedVertex) return false;
        const dx = vertex.x - newX;
        const dy = vertex.y - newY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < minDistance / scale;
      });

      if (!isColliding) {
        const updatedVertices = [...vertices];
        updatedVertices[selectedVertex] = {
          ...updatedVertices[selectedVertex],
          x: newX,
          y: newY,
        };

        this.setState({ vertices: updatedVertices });

        this.startX = event.clientX;
        this.startY = event.clientY;
      }
    } else {
      const deltaX = event.clientX - this.startX;
      const deltaY = event.clientY - this.startY;

      this.setState(prevState => ({
        offsetX: prevState.offsetX + deltaX,
        offsetY: prevState.offsetY + deltaY,
      }));

      this.startX = event.clientX;
      this.startY = event.clientY;
    }
  };

  handleMouseUp = () => {
    this.setState({ draggingVertex: false });
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
    const { offsetX, offsetY, scale, vertices } = this.state;
    const newX = (x - offsetX) / (scale**2);
    const newY = (y - offsetY) / (scale**2);

    const isOverlapping = vertices.some(vertex => {
      const dx = vertex.x - newX;
      const dy = vertex.y - newY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < minDistance / scale;
    });

    if (!isOverlapping) {
      this.setState(prevState => ({
        vertices: [...prevState.vertices, { x: newX, y: newY, label }]
      }));
    } else {
      AlphabetIterator.subIndex();
      console.log("Cannot add vertex: Overlapping with an existing vertex");
    }
  };

  addEdge = (source: number, target: number) => {
    this.setState(prevState => ({
      edges: [...prevState.edges, { source, target }]
    }));
  };

  toggleEdgeCreationMode = () => {
    this.setState(prevState => ({
      edgeCreationMode: !prevState.edgeCreationMode,
      edgeStartVertex: null
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
    const { vertices, scale, selectedVertex } = this.state;
    return vertices.map((vertex, index) => (
      <g key={index} transform={`translate(${vertex.x * scale},${vertex.y * scale})`} onMouseDown={(event) => this.handleVertexMouseDown(event, index)}>
        {selectedVertex === index && (
          <rect transform={`scale(${1/this.state.scale})`}
            x={(-vertexRadius - selectionBorderSize) * scale}
            y={(-vertexRadius - selectionBorderSize) * scale}
            width={(vertexRadius + selectionBorderSize) * 2 * scale}
            height={(vertexRadius + selectionBorderSize) * 2 * scale}
            fill="rgba(255, 255, 255, 0.3)"
            rx="15"
            ry="15"
          />
        )}
        <circle cx={0} cy={0} r={40} fill="#21171c" />
        <text x={0} y={9} textAnchor="middle" fill="white" fontSize={30}>{vertex.label}</text>
      </g>
    ));
  }

  renderEdges() {
    const { vertices, edges, scale } = this.state;
    return edges.map((edge, index) => {
      const source = vertices[edge.source];
      const target = vertices[edge.target];

      if (edge.source === edge.target) {
        // Render self-loop
        return this.renderSelfLoop(source, index, scale);
      } else {
        // Render normal edge
        return this.renderNormalEdge(source, target, index, scale);
      }
    });
  }

  renderNormalEdge(source: Vertex, target: Vertex, index: number, scale: number) {
      const dx = target.x - source.x;
      const dy = target.y - source.y;

      const angleAdjustment = 0.3; 
      
      const startAngle = Math.atan2(dy, dx) + angleAdjustment;
      const endAngle = Math.atan2(dy, dx) - angleAdjustment;
      
      const sourceX = source.x + vertexRadius * Math.cos(startAngle);
      const sourceY = source.y + vertexRadius * Math.sin(startAngle);
      const targetX = target.x - vertexRadius*1.4 * Math.cos(endAngle);
      const targetY = target.y - vertexRadius*1.4 * Math.sin(endAngle);
      
      const midX = (sourceX + targetX) / 2;
      const midY = (sourceY + targetY) / 2;
      
      const curvature = 0.1;
      const controlX = midX - (targetY - sourceY) * curvature;
      const controlY = midY + (targetX - sourceX) * curvature;

      const path = `M ${sourceX * scale} ${sourceY * scale} Q ${controlX * scale} ${controlY * scale} ${targetX * scale} ${targetY * scale}`;

    return (
      <g key={index}>
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="0"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#ffffff" />
          </marker>
        </defs>
        <path
          d={path}
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
        />
      </g>
    );
  }

  renderSelfLoop(vertex: Vertex, index: number, scale: number) {
    const loopRadius = vertexRadius * 0.8;
    const startAngle = -Math.PI / 4;
    const endAngle = Math.PI + Math.PI / 4;

    const offsetEnd = 1;
    const offsetStart = 5;

    const startX = vertex.x + (vertexRadius + offsetStart) * Math.cos(startAngle);
    const startY = vertex.y + (vertexRadius + offsetStart) * Math.sin(startAngle);
    const endX = vertex.x + (vertexRadius + offsetEnd) * Math.cos(endAngle);
    const endY = vertex.y + (vertexRadius + offsetEnd) * Math.sin(endAngle);

    const path = `
      M ${endX * scale} ${endY * scale}
      A ${loopRadius * scale} ${loopRadius * scale} 0 1 1 ${startX * scale} ${startY * scale}
    `;

    return (
      <g key={index}>
        <defs>
          <marker
            id="self-loop-arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="8"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#ffffff" />
          </marker>
        </defs>
        <path
          d={path}
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          markerEnd="url(#self-loop-arrowhead)"
        />
      </g>
    );
  }


  render() {
    const { width, height, edgeCreationMode } = this.state;

    return (
      <div id="GraphSchematics" className="graph-schematics"
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}
        onMouseLeave={this.handleMouseUp}
        onWheel={this.handleWheel}
        style={{ cursor: this.isDragging ? 'grabbing' : edgeCreationMode ? 'crosshair' : 'grab' }}
      >
        <svg width={width} height={height}>
          <g transform={`translate(${this.state.offsetX},${this.state.offsetY}) scale(${this.state.scale})`}>
            {this.renderGrid()}
            {this.renderEdges()}
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
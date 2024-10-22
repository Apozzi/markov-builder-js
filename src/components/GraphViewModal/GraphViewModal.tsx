import React from 'react';
import Modal from 'react-modal';
import { Subject } from 'rxjs';
import './GraphViewModal.css';
// @ts-ignore
import CanvasJSReact from '@canvasjs/react-charts';
import GraphSchematicsManager from '../GraphSchematics/GraphSchematicsManager';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default class GraphViewModal extends React.Component<any> {
  static openSubject = new Subject();

  customStyles = {
    content: {
      height: '466px',
      background: 'rgb(49,42,44)',
      border: 'none',
      padding: '0px',
    },
  };

  state = {
    showModal: false,
    vertices: [],
    vertexHistory: [],
    columnDataPoints: [],
    pieDataPoints: [],
    lineDataSeries: [],
  };

  static openModal(obj: any) {
    this.openSubject.next(obj);
  }

  componentDidMount() {
    Modal.setAppElement('#app');
    GraphViewModal.openSubject.subscribe(() => {
      this.setState({ showModal: true });
      this.updateChartData();
    });

    GraphSchematicsManager.onChangeVerticeArray().subscribe(() => {
      this.updateChartData();
    });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  updateChartData() {
    const state : any = GraphSchematicsManager.getGraphState();
    const { vertices, vertexHistory } = state;

    const columnDataPoints = vertices.map((vertex: any) => ({
      label: vertex.label,
      y: vertex.visitCount,
    }));

    const pieDataPoints = vertices.map((vertex: any) => ({
      label: vertex.label,
      y: vertex.visitCount,
    }));


    const visitCountAtEachMoment = vertices.map((vertex: any) => {
      let visitCount = 0; 
      return {
        type: 'line',
        name: vertex.label,
        showInLegend: true,
        dataPoints: vertexHistory.map((vertexId: number, index: number) => {
          if (vertexId === vertex.id) {
            visitCount += 1;
          }
          return { x: index + 1, y: visitCount }; 
        }),
      };
    });

    this.setState({
      vertices,
      vertexHistory,
      columnDataPoints,
      pieDataPoints,
      lineDataSeries: visitCountAtEachMoment,
    });
  }

  render() {
    const optionsColumn = {
      theme: 'dark1',
      backgroundColor: 'rgba(0, 0, 0, 0)',
      data: [
        {
          type: 'column',
          dataPoints: this.state.columnDataPoints,
        },
      ],
    };

    const optionsPie = {
      theme: 'dark1',
      backgroundColor: 'rgba(0, 0, 0, 0)',
      data: [
        {
          type: 'pie',
          dataPoints: this.state.pieDataPoints,
        },
      ],
    };

    const optionsLineChart = {
      theme: 'dark1',
      backgroundColor: 'rgba(0, 0, 0, 0)',
      data: this.state.lineDataSeries,
    };

    return (
      <div>
        <Modal
          isOpen={this.state.showModal}
          contentLabel="Project"
          className="content"
          style={this.customStyles}
          overlayClassName="overlay-graph"
        >
          <div className="modal-header">
            <div className="modal-close-icon" onClick={() => this.handleCloseModal()}>
              X
            </div>
          </div>

          <div className="chart">
            <CanvasJSChart options={optionsColumn} />
          </div>

          <div className="chart">
            <CanvasJSChart options={optionsPie} />
          </div>

          <div className="chart">
            <CanvasJSChart options={optionsLineChart} />
          </div>
        </Modal>
      </div>
    );
  }
}

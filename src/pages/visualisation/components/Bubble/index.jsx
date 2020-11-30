import React, { Component } from 'react'
import Chart from "chart.js";
// import classes from "./LineGraph.module.css";

class BubbleGraph extends Component {
    chartRef = React.createRef();

    built = false;
    last_clicked = -1;

    base_color = "#FF6384";
    selected_color = "#263DED";

    componentDidMount() {
        this.buildChart();
    }

    componentDidUpdate() {
        this.buildChart();
    }

    buildChart = () => {
        const myChartRef = this.chartRef.current.getContext("2d");

        if (!this.built && this.props.data.length) {
            this.built = true;
            this.props.data.forEach((p, i) => {return {x: p.x, y: p.y, r: p.r} })

            const data = {
                datasets: [{
                    label: 'Clusters',
                    data: this.props.data,
                    backgroundColor: this.base_color,
                    hoverBackgroundColor: this.selected_color,
                }]
            }

            const activation_callback = this.props.onClick
            
            this.myChart = new Chart(myChartRef, {
                data: data,
                type: "bubble",
                options: {
                    hoverRadius: 0,
                    hitRadius: 10,
                    hihoverBackgroundColor: 'blue',
                    legend: {
                        display: false
                    },
                    tooltips: {
                        displayColors: false,
                        titleFontSize: 16,
                        bodyFontSize: 14,
                        xPadding: 10,
                        yPadding: 10,
                        callbacks: {
                            label: (tooltipItem, d) => {
                                return `Cluster ${tooltipItem.index}`
                            }
                        }
                    },
                    onClick: function(e) {
                        var element = this.getElementAtEvent(e);
                        // If you click on at least 1 element ...
                        if (element.length > 0 && element[0]._index != this.last_clicked?._index) {
                                // Logs it
                            if (this.last_clicked) {
                                this.last_clicked._view.backgroundColor = undefined;
                                this.last_clicked._view.radius /= 2;
                            }
                            element[0]._view.backgroundColor = "#263DED";
                            element[0]._view.radius *= 2;

                            this.last_clicked = element[0];
                            activation_callback(element[0]._index);
                        }
                    }
                }
            });
        }

        if (this.props.selected_cluster && this.props.selected_cluster >= 0) {
            console.log("selected cluster " + this.props.selected_cluster)
            var bubble = this.myChart.getDatasetMeta(0).data[this.props.selected_cluster];
            this.myChart.tooltip._active = [bubble];
            this.myChart.tooltip.update();
            this.myChart.draw();
        }
    }
    render() {
        return (
            <div>
                <canvas
                    id="myChart"
                    ref={this.chartRef}
                />
            </div>
        )
    }
}

export default React.memo(BubbleGraph, (p, n) => {
  return JSON.stringify(p) === JSON.stringify(n)
});

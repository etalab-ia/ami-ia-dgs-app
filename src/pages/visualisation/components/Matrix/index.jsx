import React, { useState, Component } from 'react'
import { Scatter } from 'react-chartjs-2';
import { Timeline, Row, Col } from 'antd';
import * as d3 from "d3";


export default class Matrix extends Component {
    chartRef = React.createRef();
    built = false;

    componentDidMount() {
        this.buildChart();
    }

    componentDidUpdate() {
        this.buildChart();
    }

    buildChart = () => {        

        if (!this.built && this.props.data && this.props.data.length) {
            this.built = true;

            let start_ind = 0;
            if (this.props.start_ind) {
                start_ind = this.props.start_ind
            }

            let max_x = 0, max_y = 0, data_instance = null
            if (Array.isArray(this.props.data[0])) {
                max_x = this.props.data.length
                max_y = this.props.data[0].length
                // draw data
                function flatten(arr) {
                    for (var i = arr.length - 1; i >= 0; i--) {
                        if (arr[i].constructor === Array) {
                            flatten(arr[i]);
                            Array.prototype.splice.apply(arr, [i, 1].concat(arr[i]));
                        }
                    }
                }
                // reversing x axis to get 0 at bottom
                flatten(this.props.data.reverse());
            } else {
                max_x = Math.round(Math.sqrt(this.props.data.length))
                max_y = Math.round(Math.sqrt(this.props.data.length))
            }
            data_instance = this.props.data
            

            let top_margin = 20;
            let left_margin = 100;
                
            const width = 800,
                height = 800,
                margins = {top:top_margin, right: 50, bottom: 100, left: left_margin};
                
            const barWidth = width / max_x,
                barHeight = height / max_y;

                //Setting chart width and adjusting for margins
            const chart = d3.select('.matrix_chart')
                .attr('width', width + margins.right + margins.left)
                .attr('height', height + margins.top + margins.bottom)
            chart.append('g')
                .attr('transform','translate(' + margins.left + ',' + margins.top + ')');
                
            const tooltip = d3.select('.matrix_container').append('div')
                .attr('class','matrix_tooltip')
                .html('Tooltip')

            chart.on('mousemove', event => {
                let local_position = d3.pointer(event);
                let x = Math.floor((local_position[0] - left_margin) / barWidth); 
                let y = Math.floor((height + top_margin - local_position[1]) / barHeight); 
                // reversing x axis to get 0 at bottom
                if (0 <= x & x < max_x & 0 <= y & y < max_y) {
                    let v = this.props.data[x * max_y + (max_y - 1 -y)]
                    tooltip.html('(' + (x + start_ind) + ',' + (y + start_ind) + ')<br/>' + 
                            d3.format('.4r')(v))
                        .style('left', local_position[0] - 35 + 'px')
                        .style('top', local_position[1] - 73 + 'px')
                        .style('opacity', .9);
                }
            }).on('mouseout', () => {
                tooltip.style('opacity', 0)
                    .style('left', '0px');
            });

            //Return dynamic color based on intervals in legendData
            function varyColor(value){
                var h = (1.0 - value) * 240
                return "hsl(" + h + ", 100%, 50%)";
              }

                
            var context = chart.node().getContext("2d")
            context.translate(left_margin, top_margin);
            this.props.data.forEach(function(d, i) {
                let x = Math.floor(i/max_y);
                let y = i % max_y;
                context.beginPath();
                context.rect(x * barWidth, y * barHeight, barWidth, barHeight);
                context.fillStyle= varyColor(d);
                context.fill();
                context.closePath();
              });
                
                //Append x axis
            const xScale = d3.scaleLinear()
                .range([0,width])
                .domain([0+start_ind,max_x+start_ind]);

            let xTickCount = 10,
                xTicks = xScale.ticks(xTickCount),
                xTickFormat = xScale.tickFormat(xTickCount);

            context.beginPath();
            xTicks.forEach((d) => {
                context.moveTo(xScale(d) + 0.5, height);
                context.lineTo(xScale(d) + 0.5, height+6);
            });
            context.strokeStyle = "black";
            context.stroke();
        
            context.fillStyle = "black";
            context.textAlign = "center";
            context.textBaseline = "top";
            xTicks.forEach((d) => {
                context.fillText(xTickFormat(d), xScale(d), height+9);
            });
                
            //Append y axis and labels
            const yScale = d3.scaleLinear()
                .range([height, 0])
                .domain([0+start_ind, max_y+start_ind]);

            let yTickCount = 10,
                yTicks = yScale.ticks(yTickCount).reverse(),
                yTickFormat = yScale.tickFormat(yTickCount);

            context.beginPath();
            yTicks.forEach((d) => {
                context.moveTo(0, yScale(d) + 0.5);
                context.lineTo(-6, yScale(d) + 0.5);
            });
            context.strokeStyle = "black";
            context.stroke();
        
            context.fillStyle = "black";
            context.textAlign = "right";
            context.textBaseline = "middle";
            yTicks.forEach((d) => {
                context.fillText(yTickFormat(d), -9, yScale(d));
            });

            //Append color legend using legendData
            const legendData = [
                {'interval': 0, 'color': varyColor(0)},
                {'interval': 0.2,'color': varyColor(0.2)},
                {'interval': 0.4,'color': varyColor(0.4)},
                {'interval': 0.6,'color': varyColor(0.6)},
                {'interval': 0.8,'color': varyColor(0.8)},
                {'interval': 1,'color': varyColor(1)}
              ];

            legendData.forEach(function (d, i) {
                context.beginPath();
                context.rect(i * 30 + width * .7, height + margins.top, 30, 20);
                context.fillStyle=d.color;
                context.fill();
                context.closePath();
            });
            context.fillStyle = "black";
            context.textAlign = "center";
            context.textBaseline = "top";
            legendData.forEach((d, i) => {
                context.fillText(d.interval, i * 30 + width * .7 + 15, height + margins.top + 25);
            });
        }
    }
    
    render() {
        return(
            <div className='matrix_container' style={{position: "relative"}}>
                <canvas className='matrix_chart' ref={this.chartRef}></canvas>
            </div>
        );
    }
}

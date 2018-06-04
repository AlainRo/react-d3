import React, {Component} from 'react';
//import './App.css';
import {scaleLinear} from 'd3-scale';
import {max} from 'd3-array';
import {select} from 'd3-selection';
import windowSize from 'react-window-size-listener';

class BarChart extends Component {
   constructor(props){
      super(props);
      this.margin = {top: 50, left: 50, bottom: 50, right: 50};
      this.createBarChart = this.createBarChart.bind(this);
   }
   componentDidMount() {
      this.createBarChart();
   }
   componentDidUpdate() {
      this.createBarChart();
   }
   shouldComponentUpdate() {
        // Prevents component re-rendering or not
        return true; //false;
   }
   createBarChart() {
      const {node, margin} = this;
      const {data, size} = this.props;
      const h = size[1] - margin.top - margin.bottom;
      const w = size[0] - margin.left - margin.right;      
      const dataMax = max(data);

      const yScale = scaleLinear()
         .domain([0, dataMax]).range([0, h]);
      const xScale = scaleLinear()
         .domain([0, data.length]).range([0, w]);

      select(node).selectAll('g').remove(); // Pour l'instant reconstruit à zéro

      const g = select(node)
         .append('g')
         .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
         .selectAll('rect')
         .data(data);

      g.exit().remove();
      
      const ggEnter = g
         .enter()
         .append('rect');
         
      g
         .merge(ggEnter)
         .style('fill', 'SteelBlue')
         .style('stroke', 'white')
         .style('stroke-width', 3)
         .attr('x', (d,i) => xScale(i))
         .attr('y', d => (h - yScale(d)))
         .attr('height', d => yScale(d))
         .attr('width', xScale(1));
   }

   render() {
         const {data, size} = this.props;
         return <svg ref={node => this.node = node}
         width={size[0]} height={size[1]}>
         </svg>
   }
}
export default BarChart
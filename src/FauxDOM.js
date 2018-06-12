import React from 'react'
import {withFauxDOM} from 'react-faux-dom'
import * as d3 from 'd3'
//import './style.css'

class Chart extends React.Component {
  constructor (props) {
    super(props)
    this.toggle = this.toggle.bind(this)
    this.state = { look: 'stacked' }
  }

  initialize () {
    debugger;
  }

  render () {
    return (
      <div>
        <button onClick={this.toggle}>Toggle</button>
        {this.props.chart}
      </div>
    )
  }

  toggle () {
    if (this.state.look === 'stacked') {
      this.setState({ look: 'grouped' })
      this.transitionGrouped()
    } else {
      this.setState({ look: 'stacked' })
      this.transitionStacked()
    }
  }

  componentDidMount () {
    // This will create a faux div and store its virtual DOM
    // in state.chart
    const faux = this.props.connectFauxDOM('div', 'chart')

    const component = this

    /*
       D3 code below by Mike Bostock, https://bl.ocks.org/mbostock/3943967
       The only changes made for this example are...
       1) feeding D3 the faux node created above
       2) calling this.animateFauxDOM(duration) after each animation kickoff
       3) attaching the radio button callbacks to the component
       4) deleting the radio button (as we do the toggling through the react button)
    */

    const n = 4 // number of layers
    const m = 30 // number of samples per layer
    const layers = d3.stack().keys(d3.range(n))(d3.transpose(d3.range(n).map(() => bumpLayer(m, 0.1))));
    const yGroupMax = d3.max(layers, layer => d3.max(layer, d => d[1]-d[0]));
    const yStackMax = d3.max(layers, layer => d3.max(layer, d => d[1]));

    const margin = {top: 10, right: 10, bottom: 20, left: 10}
    const width = 600 - margin.left - margin.right
    const height = 400 - margin.top - margin.bottom
   
    const x = d3.scaleBand()
        .domain(d3.range(m))
        .rangeRound([0, width])
        .padding(0.08)

    const y = d3.scaleLinear()
        .domain([yStackMax, 0])
        .range([height, 0])
    

    const xAxis = d3.axisBottom(x)
        .tickSize(0)
        .tickPadding(6)

    const svg = d3.select(faux).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    const layer = svg.selectAll('.layer')
        .data(layers)
      .enter().append('g')
        .attr('class', 'layer')
        .style('fill', (d, i) => d3.schemeCategory10[i])

    const rect = layer.selectAll('rect')
        .data(d => d)
      .enter().append('rect')
        .attr('x', (d, i) => x(i))
        .attr('y', height)
        .attr('width', x.bandwidth())
        .attr('height', 0)

    rect.transition()
        .delay((d, i) => i * 10)
        .attr('y', d => height - y(d[1]))
        .attr('height', d => y((d[1] - d[0])))

    this.props.animateFauxDOM(800);

    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

    this.transitionGrouped = () => {
      y.domain([0, yGroupMax])

      rect.transition()
          .duration(500)
          .delay((d, i) => i * 10)
          .attr('x', function (d, i) { 
             return x(i) + x.bandwidth() / n * this.parentNode.__data__.key; }) // 'this' is important
          .attr('width', x.bandwidth() / n)
        .transition()
          .attr('y', d => y(d[1] - d[0]))
          .attr('height', d => height - y(d[1] - d[0]))

      component.props.animateFauxDOM(2000)
    };

    this.transitionStacked = function () {
      y.domain([yStackMax, 0])

      rect.transition()
          .duration(500)
          .delay((d, i) => i * 10)
          .attr('y', d => height - y(d[1]))
          .attr('height', d => y(d[1] - d[0]))
        .transition()
          .attr('x', (d, i) => x(i))
          .attr('width', x.bandwidth());

      component.props.animateFauxDOM(2000);
    }

    // Inspired by Lee Byron's test data generator.
    function bumpLayer (n, o) {
      function bump (a) {
        const x = 1 / (0.1 + Math.random())
        const y = 2 * Math.random() - 0.5
        const z = 10 / (0.1 + Math.random())
        for (let i = 0; i < n; i++) {
          let w = (i / n - y) * z
          a[i] += x * Math.exp(-w * w)
        }
      }

      const a = []
      let i
      for (i = 0; i < n; ++i) a[i] = o + o * Math.random()
      for (i = 0; i < 5; ++i) bump(a)
      return a.map(d => Math.max(0, d))
    }
  }
}

Chart.defaultProps = {
  chart: 'loading'
}

const FauxChart = withFauxDOM(Chart)

export default FauxChart
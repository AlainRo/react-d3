//import './App.css';
//import windowSize from 'react-window-size-listener';
import {forceCluster} from  'd3-force-cluster';
import {forceAttract} from  'd3-force-attract';

const D3Component = require('./D3Component.js');
const d3 = require('d3');


class Cluster extends D3Component {

  initialize(nodeR, props) {
    const {size, padding, clusterPadding, maxRadius} = this.props;
    const width = size[0], height = size[1];
    const svg = d3.select(nodeR).append('svg');

    svg.attr('width', width);
    svg.attr('height', height);
  
    const n = 200, // total number of nodes
        m = 10; // number of distinct clusters

    const color = d3.scaleSequential(d3.interpolateRainbow)
        .domain(d3.range(m));

    // The largest node for each cluster.
    const clusters = new Array(m);

    const nodes = d3.range(n).map(function () {
      const i = Math.floor(Math.random() * m),
          r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius,
          d = {
            cluster: i,
            radius: r,
            x: Math.cos(i / m * 2 * Math.PI) * 200 + width / 2 + Math.random(),
            y: Math.sin(i / m * 2 * Math.PI) * 200 + height / 2 + Math.random()
          };
      if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
      return d;
    });

    const simulation = d3.forceSimulation()
      // keep entire simulation balanced around screen center
      .force('center', d3.forceCenter(width/2, height/2))
      
      // pull toward center
      .force('attract', forceAttract()
        .target([width/2, height/2])
        .strength(0.01))

      // cluster by section
      .force('cluster', forceCluster()
        .centers(d => clusters[d.cluster])
        .strength(0.5)
        .centerInertia(0.1))

      // apply collision with padding
      .force('collide', d3.forceCollide(d => d.radius + padding)
        .strength(0))

      .on('tick', layoutTick)
      .nodes(nodes);

    const node = svg.selectAll('circle')
      .data(nodes)
      .enter().append('circle')
        .style('fill', d => color(d.cluster/10))
        .call(d3.drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended)
        );

    function dragstarted (d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged (d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended (d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // ramp up collision strength to provide smooth transition
    const transitionTime = 3000;
    const t = d3.timer(function (elapsed) {
      const dt = elapsed / transitionTime;
      simulation.force('collide').strength(Math.pow(dt, 2) * 0.7);
      if (dt >= 1.0) t.stop();
    });
      
    function layoutTick (e) {
      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', d => d.radius);
    }

  };
  update(props) {
    console.log('update', this.props, props);

  }

};

export default Cluster;
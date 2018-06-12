const D3Component = require('./D3Component.js');
const d3 = require('d3');

let radius = 200;

class CircleWave extends D3Component {

  initialize(node, props) {
    const {size} = this.props;
    const svg = d3.select(node).append('svg');

    svg.attr('width', size[0]);
    svg.attr('height', size[1]);

    const angles = d3.range(0, 2 * Math.PI, Math.PI / 200);

    radius = size[0]/4;

    const path = svg.append("g")
        .attr("transform", "translate(" + size[0] / 2 + "," + size[1] / 2 + ")")
        .attr("fill", "none")
        .attr("stroke-width", 10)
        //.attr("stroke-linejoin", "round")
      .selectAll("path")
      .data(["cyan", "magenta", "yellow"])
      .enter().append("path")
        .attr("stroke", d => d)
        .style("mix-blend-mode", "darken")
        .datum((d, i) => 
          d3.radialLine()
              .curve(d3.curveLinearClosed)
              .angle(a => a)
              .radius(a => {
          			const freq = 1000;
                const t = d3.now() / freq;
                return radius + Math.cos(a * 8 - i * 2 * Math.PI / 3 + t) * Math.pow((1 + Math.cos(a - t)) / 2, 3) * 32})
    )

    d3.timer(() => path.attr("d", d => d(angles)));
  };
  update(props) {
    radius = props.size[0]/4;
  }

};

export default CircleWave;

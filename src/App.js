import React, { Component } from 'react';
import './App.css';
import { withWindowSizeListener } from 'react-window-size-listener';
import BarChart from './BarChart';
import CircleWave from './Circles';
import Cluster from './Cluster';
import FauxDOM from './FauxDOM';
//import {Runtime, Inspector} from "@observablehq/notebook-runtime";
//mport notebook from "how-to-embed-a-notebook-in-a-react-app";

class App extends Component {
   //animationRef = React.createRef();

   componentDidMount() {
    /*
     Runtime.load(notebook, (cell) => {
      if (cell.name === "animation") {
        return new Inspector(this.animationRef.current);
      }
    });
    */
   }

   render() {
     const data = [5, 8, 1, 3, 1, 6, 5, 4, 3, 4];
     const {windowWidth, windowHeight} = this.props.windowSize;
     const size = [windowWidth || window.innerWidth,windowHeight || window.innerHeight];
     const halfsize = [Math.min(size[0]/4, size[1]), Math.min(size[0]/4, size[1])];

     return (
        <div className='App'>
          <div className="row">
            <div className="col s6 chart">

              <BarChart data={data} size={halfsize} />

              <h5>Un triste barChart react</h5>
            </div>
            <div className="chart s6 chart">
              <CircleWave size={halfsize} />
              <h5>Un cercle d3.js libre</h5>
            </div>
          </div>
          <div className="row">
            <div className="col s6 chart">
              <Cluster 
                  clusterPadding={6}
                  container={"#svgC"}
                  size={halfsize}
                  m={5}
                  maxRadius={10}
                  n={100}
                  padding={1.5}
                />
              <h5>Un bain de bulles colorées</h5>
            </div>        
            <div className="col s6 chart">

               <FauxDOM />
               <h5>Un 'FauxDom' très fonctionnel</h5>
            </div>
          </div>

        </div>
     )
   }
};
export default withWindowSizeListener(App);

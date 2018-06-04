import React, { Component } from 'react';
//import './App.css';
import { Button, Card, Row, Col } from 'react-materialize';
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
     const halfsize = [Math.min(size[0]/2, size[1]), Math.min(size[0]/2, size[1])];

     return (
        <div className='App'>
        <Row>
          <Row>
            <Col s={6}>
              <BarChart data={data} size={[300,300]} /> {/*//{halfsize} />*/}
            </Col>
              <CircleWave size={[300,300]} /> {/*//{halfsize} />*/}
          </Row>
          <Row>
            <Col s={6}>
              <Cluster 
                  clusterPadding={6}
                  container={"#svgC"}
                  height={500}
                  m={5}
                  maxRadius={10}
                  n={100}
                  padding={1.5}
                  width={960}
                />
            </Col>        
            <Col s={6}>
               <FauxDOM />
            </Col>
          </Row>
        </Row>
        </div>
     )
   }
};
export default withWindowSizeListener(App);

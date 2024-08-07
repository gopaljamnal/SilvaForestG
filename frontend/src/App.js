// src/App.js
import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import IciclePlot from './IciclePlot';
import BarChart from './BarChart';
import LineChart from './LineChart';
import './index.css';
// import app from "react-scripts/template-typescript/src/App"; // Ensure CSS for layout

const App = () => {
  // const cors = require('cors')
  // app.use(cors())
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState('icicle');
  // const [plots, setPlots] = useState([]);

  // useEffect(() => {
  //   axios.get('http://127.0.0.1:5000/readjson')
  //     .then(response => {
  //         setData(response.data[0].forestTrees);
  //         // console.log(response.data[0].forestTrees)
  //     })
  //     .catch(error => {
  //       console.error('Error fetching data:', error);
  //     });
  // }, []);

      useEffect(() => {
        fetch('http://127.0.0.1:5000/readjson')
          .then(response => response.json())
          .then(data => setData(data[0].forestTrees))
          .catch(error => console.error('Error fetching data:', error));
      }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'icicle':
        if (data.length===0) return <p>Loading data form backend...</p>;
      console.log(data)
        return (
          <div className="icicle-plots-container">
            {data.map((plotData, index) => (
              <div key={index} className="icicle-plot-container">
                <IciclePlot data={plotData.attributes} decisionRoute={plotData.deci_rou} targetDecode={plotData.deci_rou.target_decode}/>
              </div>

            ))}
          </div>
        );
      case 'bar':
        return <BarChart />;
      case 'line':
        return <LineChart />;
      default:
        return <p>Select a tab</p>;
    }
  };

  return (
    <div>
      <h1>Forest(G): Explianable AI/ML System</h1>
      <div className="tabs">
        <button onClick={() => setActiveTab('icicle')}>Icicle Plots</button>
        <button onClick={() => setActiveTab('bar')}>Bar Chart</button>
        <button onClick={() => setActiveTab('line')}>Line Chart</button>
      </div>
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default App;

import React from 'react';
import './App.css';
import 'chartjs-plugin-colorschemes';
import {LatestDurationRatio} from "./components/latestDurationRatio";
import {CountTimeLine} from "./components/countTimeLine";

function App() {

  const divStyle = {
    display: 'flex'
  }

  const sectionStyle = {
    width: '50%'
  }

  return (
    <main>
      <div style={divStyle}>
        <section style={sectionStyle}>
          <LatestDurationRatio />
        </section>
        <section style={sectionStyle}>
          <CountTimeLine />
        </section>
      </div>
      <div style={divStyle}>
        <section style={sectionStyle}>
          <LatestDurationRatio />
        </section>
      </div>
    </main>
  );
}

export default App;

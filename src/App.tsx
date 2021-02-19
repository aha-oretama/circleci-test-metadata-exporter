import React from 'react';
import './App.css';
import 'chartjs-plugin-colorschemes';
import {LatestExecutionTimeRatio} from "./components/latestExecutionTimeRatio";
import {CountTimeLine} from "./components/countTimeLine";
import {ExecutionTimeTimeLine} from "./components/executionTimeTimeLine";
import useSWR from "swr";
import {fetcher} from "./api/fetcher";


const divStyle = {
  display: 'flex'
}

const sectionStyle = {
  width: '50%'
}

export type TimeLineReturnType = {
  build_num: number;
  subject: string,
  status: "success" | "fail",
  build_time_millis: number,
  queued_at: string
  start_time: string,
  stop_time: string,
  parallel: number,
  build_url: number,
  total_test_count: number;
  total_tests_run_time: number;
}[];

function App() {

  const {data: timeline, error} = useSWR<TimeLineReturnType>('/api/timeline', fetcher)

  return (
    <main>
      <div style={divStyle}>
        <section style={sectionStyle}>
          <LatestExecutionTimeRatio />
        </section>
        <section style={sectionStyle}>
          <CountTimeLine timeline={timeline} error={error} />
        </section>
      </div>
      <div style={divStyle}>
        <section style={sectionStyle}>
          <ExecutionTimeTimeLine timeline={timeline} error={error} />
        </section>
      </div>
    </main>
  );
}

export default App;

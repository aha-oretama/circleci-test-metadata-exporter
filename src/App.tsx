import React from 'react';
import './App.css';
import 'chartjs-plugin-colorschemes';
import {LatestExecutionTimeRatio} from "./components/latestExecutionTimeRatio";
import {CountTimeLine} from "./components/countTimeLine";
import {ExecutionTimeTimeLine} from "./components/executionTimeTimeLine";
import useSWR from "swr";
import {fetcher} from "./api/fetcher";
import {SuccessRatioTimeLine} from "./components/successRatioTimeLine";
import {FailureTestList} from "./components/failureTestList";


const divFlexStyle = {
  display: 'flex'
}

const divStyle = {
  width: '50%'
}

export type TimeLineReturnType = {
  build_num: number;
  subject: string,
  status: "success" | "failed",
  build_time_millis: number,
  queued_at: string
  start_time: string,
  stop_time: string,
  parallel: number,
  build_url: number,
  total_test_count: number;
  total_tests_run_time: number;
  total_success_count: number;
  total_skipped_count: number;
  total_failure_count: number;
}[];

function App() {

  const {data: timeline, error} = useSWR<TimeLineReturnType>('/api/timeline', fetcher)

  return (
    <main>
      <div style={divFlexStyle}>
        <div style={divStyle}>
          <LatestExecutionTimeRatio />
        </div>
        <div style={divStyle}>
          <CountTimeLine timeline={timeline} error={error} />
        </div>
      </div>
      <div style={divFlexStyle}>
        <div style={divStyle}>
          <ExecutionTimeTimeLine timeline={timeline} error={error} />
        </div>
        <div style={divStyle}>
          <SuccessRatioTimeLine timeline={timeline} error={error} />
        </div>
      </div>
      <div style={divFlexStyle}>
        <div style={divStyle}>
          <FailureTestList />
        </div>
        <div style={divStyle}>
          <SuccessRatioTimeLine timeline={timeline} error={error} />
        </div>
      </div>
    </main>
  );
}

export default App;

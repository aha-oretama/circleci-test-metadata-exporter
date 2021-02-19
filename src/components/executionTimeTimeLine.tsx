import React from "react";
import {Line} from "react-chartjs-2";
import {TimeLineReturnType} from "../App";

type Props = {
  timeline?: TimeLineReturnType;
  error: any;
};

export const ExecutionTimeTimeLine: React.FunctionComponent<Props> = ({timeline, error}) => {

  if (error) return <div>failed to load</div>
  if (!timeline) return <div>loading...</div>

  const data = timeline?.map(c => ({x: Date.parse(c.start_time), y: c.build_time_millis * 0.001}));

  return (
    <>
      <h1>Timeline of execution time</h1>
      <Line
        data={{
          datasets: [{
            data: data,
            label: "Execution time",
            lineTension: 0,
            pointStyle: "line",
            pointRadius: 0,
          }],
        }}
        options={{
          scales: {
            xAxes: [{
              type: "time",
              time: {
                unit: "day"
              }
            }],
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: "Second"
              }
            }]
          }
        }}
        plugins={
          [
            {
              colorschemes: {
                // FIXME: seem that this color doesn't work
                scheme: 'brewer.Accent3'
              }
            }
          ]
        }
      />
    </>
  )
}
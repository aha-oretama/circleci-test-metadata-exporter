import React from "react";
import {Line} from "react-chartjs-2";
import {TimelineProps} from "./props";

export const ExecutionTimeTimeLine: React.FunctionComponent<TimelineProps> = ({timeline, error}) => {

  if (error) return <div>failed to load</div>
  if (!timeline) return <div>loading...</div>

  const buildData = timeline?.map(c => ({x: Date.parse(c.start_time), y: c.build_time_millis * 0.001}));
  const totalTestTimeData = timeline?.map(c => ({x: Date.parse(c.start_time), y: c.total_tests_run_time}));

  return (
    <>
      <h1>Timeline of execution time</h1>
      <Line
        data={{
          datasets: [
            {
              data: totalTestTimeData,
              label: "Total tests time",
              lineTension: 0,
              pointStyle: "line",
              pointRadius: 0,
            },
            {
              data: buildData,
              label: "Build time",
              lineTension: 0,
              pointStyle: "line",
              pointRadius: 0,
            },
          ],
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
          },
          plugins: {
            colorschemes: {
              // FIXME: seem that this color doesn't work
              scheme: 'office.Circuit6'
            }
          }
        }}
      />
    </>
  )
}

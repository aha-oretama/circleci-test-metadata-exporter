import React from "react";
import {Line} from "react-chartjs-2";
import {TimelineProps} from "./props";

export const SuccessRatioTimeLine: React.FunctionComponent<TimelineProps> = ({timeline, error}) => {

  if (error) return <div>failed to load</div>
  if (!timeline) return <div>loading...</div>

  const data = timeline?.map(c => ({
    x: Date.parse(c.start_time),
    y: 100 * (c.total_success_count) / (c.total_success_count + c.total_failure_count)
  }));

  return (
    <>
      <h1>Timeline of success ratio</h1>
      <Line
        data={{
          datasets: [{
            data: data,
            label: "Success ratio",
            lineTension: 0,
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
              ticks: {
                min: 0,
                max: 100,
                callback: function(value) {
                  return value + "%"
                }
              },
              scaleLabel: {
                display: true,
                labelString: "Percentage"
              }
            }]
          },
          plugins: {
            colorschemes: {
              // FIXME: seem that this color doesn't work
              scheme: 'brewer.Accent3'
            }
          }
        }}
      />
    </>
  );
};

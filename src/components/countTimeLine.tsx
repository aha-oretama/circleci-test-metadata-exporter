import React from "react";
import {Line} from "react-chartjs-2";
import {TimeLineReturnType} from "../App";

type Props = {
  timeline?: TimeLineReturnType;
  error: any;
};


export const CountTimeLine: React.FunctionComponent<Props> = ({timeline, error}) => {

  if (error) return <div>failed to load</div>
  if (!timeline) return <div>loading...</div>

  const data = timeline?.map(c => ({x: Date.parse(c.start_time), y: c.total_test_count}));

  return (
    <>
      <h1>Timeline of test count</h1>
      <Line
        data={{
          datasets: [{
            data: data,
            label: "Test count",
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
            }]
          }
        }}
        plugins={[{
          colorschemes: {
            // FIXME: seem that this color doesn't work
            scheme: 'brewer.Accent3'
          }
        }]}
      />
    </>
  );
};

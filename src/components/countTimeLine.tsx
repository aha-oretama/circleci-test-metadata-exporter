import React from "react";
import {Line} from "react-chartjs-2";
import useSWR from "swr";
import {fetcher} from "../api/fetcher";

type CountTimeLineReturnType = {
  build_num: number;
  start_time: string;
  count: number;
}[];

export const CountTimeLine: React.FunctionComponent = () => {
  const {data: countTimelines, error} = useSWR<CountTimeLineReturnType>('/api/count-timeline', fetcher)

  const data = countTimelines?.map(c => ({x: Date.parse(c.start_time), y: c.count}));

  return (
    <>
      <h1>Test count time line</h1>
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

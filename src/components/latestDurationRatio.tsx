import React from "react";
import useSWR from "swr";
import {fetcher} from "../api/fetcher";
import {Doughnut} from "react-chartjs-2";

type RecentDurationReturnType = {
  name: string
  run_time: number
}[];

export const LatestDurationRatio: React.FunctionComponent = () => {
  const {data: durations, error} = useSWR<RecentDurationReturnType>('/api/latest', fetcher)

  if (error) return <div>failed to load</div>
  if (!durations) return <div>loading...</div>

  const sorted = durations.sort((a, b) => (b.run_time - a.run_time))
  const labels = sorted.map(duration => duration.name);
  const data = sorted.map(duration => duration.run_time);

  return (
    <>
      <h1>The duration ratio of the latest test</h1>
      <Doughnut
        data={{
          datasets: [{data: data}],
          labels: labels
        }}
        legend={{display: false}}
        plugins={[{
          colorschemes: {
            scheme: 'brewer.Spectral4'
          }
        }]}
      />
    </>
  )
}

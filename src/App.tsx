import React from 'react';
import './App.css';
import useSWR from 'swr';
import {fetcher} from "./api/fetcher";
import {Doughnut, Pie} from "react-chartjs-2";
import 'chartjs-plugin-colorschemes';
type RecentDurationReturnType = {
  name: string
  run_time: number
}[];

function App() {

  const { data: durations, error } = useSWR<RecentDurationReturnType>('/api/recent-duration', fetcher)

  if (error) return <div>failed to load</div>
  if (!durations) return <div>loading...</div>

  const sorted = durations.sort((a, b) => (b.run_time - a.run_time) )
  const labels = sorted.map(duration => duration.name);
  const data = sorted.map(duration => duration.run_time);

  return (
    <main>
      <section>
        <h1>The duration ratio of the latest test</h1>
        <Doughnut
          data={{
            datasets: [{data: data}],
            labels: labels
          }}
          legend={{display: false}}
          plugins={[{
            colorschemes: {
              scheme: 'brewer.Paired12'
            }
          }]}
        />
      </section>
    </main>
  );
}

export default App;

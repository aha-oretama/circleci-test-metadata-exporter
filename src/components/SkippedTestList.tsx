import React from "react";
import useSWR from "swr";
import {fetcher} from "../api/fetcher";

type SkippedTestsReturnType = {
  name: string;
  first_skipped_at: string;
  last_skipped_at: string;
}[];

export const SkippedTestList: React.FunctionComponent = () => {
  const {data, error} = useSWR<SkippedTestsReturnType>('/api/skipped-tests', fetcher)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  const sortedData = data.sort((a, b) => Date.parse(a.first_skipped_at) - Date.parse(b.first_skipped_at))

  return (
    <>
      <h1>Longest skipped tests</h1>
      {sortedData.length === 0 ?
        <p>There are no skipped test in the last build</p>
      : <table>
          <tr>
            <th>Test name</th>
            <th>Skipped duration</th>
          </tr>
          {sortedData.map(d => (
            <tr>
              <td>{d.name}</td>
              <td>{Math.floor((Date.parse(d.last_skipped_at) - Date.parse(d.first_skipped_at)) / 86400000)} days</td>
            </tr>
          ))}
        </table>
      }
    </>
  )
}

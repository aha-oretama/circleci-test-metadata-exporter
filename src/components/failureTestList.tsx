import React from "react";
import useSWR from "swr";
import {fetcher} from "../api/fetcher";

type FailureTestsReturnType = {
  name: string;
  classname: string;
  total_test_count: number;
  total_failure_count: number;
}[];

export const FailureTestList: React.FunctionComponent = () => {
  const {data, error} = useSWR<FailureTestsReturnType>('/api/failure-tests', fetcher)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  const sortedData = data.sort((a, b) => b.total_failure_count / b.total_test_count - a.total_failure_count / a.total_test_count)

  return (
    <>
      <h1>Top 10 frequently failed tests in the last 30 days</h1>
      {sortedData.length === 0 ?
        <p>There are no failed test in the last 30 days</p>
      : <table>
          <tr>
            <th>Test name</th>
            <th>Failure ratio</th>
            <th>Failure count</th>
            <th>Execution count</th>
          </tr>
          {sortedData.map(d => (
            <tr>
              <td>{d.name || d.classname}</td>
              {/* Round off the number to 2 decimal places */}
              <td>{Math.round(d.total_failure_count / d.total_test_count * 100 * 100) / 100}%</td>
              <td>{d.total_failure_count}</td>
              <td>{d.total_test_count}</td>
            </tr>
          ))}
        </table>
      }
    </>
  )
}

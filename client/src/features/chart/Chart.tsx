import React from "react";
import "./Chart.css";
import ChartBar from "./ChartBar";

const Chart = (props: any) => {
  const dataPointValues = props.dataPoints.map((dt: { value: any; }) => dt.value);
  const totalMaximum = Math.max(...dataPointValues);

  return (
    <div className="chart">
      {props.dataPoints.map((dataPoint: { id: number; value: any; label: any; }) => (
       <ChartBar
          // @ts-ignore
          id={dataPoint.id}
          value={dataPoint.value}
          maxValue={totalMaximum}
          label={dataPoint.label}
        />
      ))}
    </div>
  );
};

export default Chart;

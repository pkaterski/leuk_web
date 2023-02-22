import React from "react";
import Plot from "react-plotly.js";

type BloodValuePlotProps = {
  xs: number[];
  ys: number[];
  title: string;
};

const PlotComponent: React.FC<BloodValuePlotProps> = (
  props: BloodValuePlotProps
) => {
  const layout = { width: 320, height: 240, title: props.title };

  return (
    <div>
      <Plot
        config={{ displayModeBar: false }}
        data={[
          {
            x: props.xs,
            y: props.ys,
            mode: "lines",
          },
        ]}
        layout={layout}
      />
    </div>
  );
};

export default PlotComponent;

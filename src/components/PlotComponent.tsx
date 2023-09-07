import React from "react";
import Plot from "react-plotly.js";

type BloodValuePlotProps = {
  xs: number[];
  ys: number[];
  title: string;
  widthFactor?: number;
  heightFactor?: number;
};

const PlotComponent: React.FC<BloodValuePlotProps> = (
  props: BloodValuePlotProps
) => {
  const [widthFactor, heightFactor] = [props.widthFactor || 1, props.heightFactor || 1]
  const layout = { width: 320 * widthFactor, height: 240 * heightFactor, title: props.title };

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

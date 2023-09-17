import React from "react";
import Plot from "react-plotly.js";
import { Shape } from "plotly.js-basic-dist";

type BloodValuePlotProps = {
  xs: number[];
  ys: number[];
  title: string;
  widthFactor?: number;
  heightFactor?: number;
  highLowRefs?: { high: number, low: number };
};

const PlotComponent: React.FC<BloodValuePlotProps> = (
  props: BloodValuePlotProps
) => {
  const [widthFactor, heightFactor] = [props.widthFactor || 1, props.heightFactor || 1]

  const shapes: Partial<Shape>[] = (() => {
    if (props.highLowRefs !== undefined) {
      const refUpShape: Partial<Shape> = {
        type: 'line',
        xref: 'paper',
        x0: 0,
        y0: props.highLowRefs.high,
        x1: 1,
        y1: props.highLowRefs.high,
        line:{
            color: 'rgb(255, 0, 0)',
            width: 1.5,
            dash:'dot'
        }
      };
      const refDownShape: Partial<Shape> = {
        type: 'line',
        xref: 'paper',
        x0: 0,
        y0: props.highLowRefs.low,
        x1: 1,
        y1: props.highLowRefs.low,
        line:{
            color: 'rgb(255, 0, 0)',
            width: 1.5,
            dash:'dot'
        }
      };
      return [refUpShape, refDownShape];
    }
    return [];
  })();

  const layout = { width: 320 * widthFactor, height: 240 * heightFactor, title: props.title, shapes: shapes };


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

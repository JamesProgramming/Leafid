"use client";
import { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import { ChartType } from "chart.js";

interface Datasets {
  label: string;
  data: any[];
}

interface Props {
  type: ChartType;
  x?: string;
  y?: string;
  labels: any[];
  datasets: Datasets[];
  options?: object;
  children?: JSX.Element;
}

// Parameters type enforement is done by typescript
/**
 * Creates a chart using Chart.js.
 * @param {*} props Given by react.
 * @param {*} props.type The type of chart ('bar' or 'line' or ...).
 * @param {*} props.x X axis label.
 * @param {*} props.y Y axis label.
 * @param {*} props.labels Labals for the index axis (default x axis).
 * @param {*} props.datasets A list of data points and the dataset name.
 * @param {*} props.options Any option ChartJS supports see {@link https://chartjs.org}.
 */
function CustomChart({
  type,
  x,
  y,
  labels,
  datasets,
  options,
  children,
}: Props) {
  const [idCon, setIdCon] = useState("");
  const [idCav, setIdCav] = useState("");

  useEffect(() => {
    // Create container with unique id.
    const idContainer =
      Math.floor(Math.random() * 1000000000) +
      "" +
      Date.now() +
      "chartConatiner";
    const idCanvas =
      Math.floor(Math.random() * 1000000000) + "" + Date.now() + "chartCanvas";

    setIdCav(idCanvas);
    setIdCon(idContainer);
  }, []);

  useEffect(() => {
    // Create chart after id has been generated.
    if (idCav) {
      Chart.defaults.borderColor = "#00000033";

      // Decrease the font size for small screens.
      if (window.innerWidth < 700) {
        Chart.defaults.font.size = 7;
      } else {
        Chart.defaults.font.size = 12;
      }

      // Axis labels.
      let scales: object;
      if (x) {
        scales = {
          x: {
            title: {
              display: true,
              text: x,
            },
          },
          y: {
            title: {
              display: true,
              text: y,
            },
          },
        };
      } else {
        scales = {};
      }

      new Chart(idCav, {
        type: type,
        data: {
          labels: labels,
          datasets: datasets,
        },
        options: {
          responsive: true,
          ...options,
          plugins: {
            legend: {
              labels: {
                font: {
                  family: "__Josefin_Sans_4fe354",
                  size: 13,
                },
              },
            },
          },
          scales,
        },
      });
    }
  }, [idCav]);

  useEffect(() => {
    // Make charts responsive.
    const containerListener = function () {
      const chartContainer = document.getElementById(idCon);
      const parentStyles = getComputedStyle(
        chartContainer?.parentElement.parentElement.parentElement
      );

      chartContainer.style.width =
        parseFloat(parentStyles.width.slice(0, -2)) -
        parseFloat(parentStyles.paddingLeft.slice(0, -2)) * 2 +
        "px";
    };

    window.addEventListener("resize", containerListener);

    return () => {
      window.removeEventListener("resize", containerListener);
    };
  }, [idCon]);

  return (
    <>
      {children}
      <div id={idCon}>
        <canvas id={idCav}></canvas>
      </div>
    </>
  );
}

export default CustomChart;

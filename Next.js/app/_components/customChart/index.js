"use client";
import { useEffect, useState } from "react";
import Chart from "chart.js/auto";

function CustomChart({ type, x, y, labels, datasets, options, children }) {
  const [idCon, setIdCon] = useState("");
  const [idCav, setIdCav] = useState("");

  useEffect(() => {
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
    if (idCav) {
      Chart.defaults.borderColor = "#00000033";

      if (window.innerWidth < 700) {
        Chart.defaults.font.size = 7;
      } else {
        Chart.defaults.font.size = 12;
      }

      let scales;
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

      <div id={idCon} className="posr">
        <canvas id={idCav}></canvas>
      </div>
    </>
  );
}

export default CustomChart;

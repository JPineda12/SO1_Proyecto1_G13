import React, { useEffect, useState } from "react";
import { Line, defaults } from "react-chartjs-2";
import io from 'socket.io-client';

import { Rectangulo, Rectangulo2, Contenedor } from "./NavBarElements";
//import { Line, defaults } from 'react-chartjs-2'

defaults.global.tooltips.enabled = false;
defaults.global.legend.position = "bottom";
const baseUrl = "http://localhost:5000";

const Ram = () => {
  const socket = io.connect(baseUrl);
  //-------------------
//  const [operacion, setOperations] = useState([]);
  useEffect(() => {
    //socket
    socket.emit("ram", "asd-prueba");
    socket.on("ram", async (mensaje) => {
      console.log("MENSAJE: ", mensaje);
    })
  }, []);

  const tempInt = []
  console.log(tempInt);

  //------------------

  return (
    <div>
      <div>RAM</div>
      <Rectangulo>
        <h3>VM1</h3>
        <div className="rectangle2">
          [Total RAM]
          {tempInt[0]}
        </div>
        <div className="rectangle2">RAM en uso</div>
        <div className="rectangle2">RAM en uso %</div>
        <div className="rectangle2">RAM libre</div>
      </Rectangulo>
      <Rectangulo2>
        <h3>VM2</h3>
        <div className="rectangle2">Total RAM</div>
        <div className="rectangle2">RAM en uso</div>
        <div className="rectangle2">RAM en uso %</div>
        <div className="rectangle2">RAM libre</div>
      </Rectangulo2>

      <Contenedor>
        <Line
          data={{
            labels: [1, 2, 3, 4],
            datasets: [
              {
                label: "VM1",
                data: tempInt,
                borderColor: "orange",
                borderWidth: 1,
              },
              {
                label: "VM2",
                data: tempInt,
                borderColor: "red",
              },
            ],
          }}
          height={400}
          width={600}
          options={{
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
            legend: {
              labels: {
                fontSize: 25,
              },
            },
          }}
        />
      </Contenedor>
    </div>
  );
};

export default Ram;

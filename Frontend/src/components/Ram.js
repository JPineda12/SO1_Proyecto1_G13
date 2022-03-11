import React, { useEffect, useState } from "react";
import { Line, defaults } from "react-chartjs-2";
import io from 'socket.io-client';

import { Rectangulo, Rectangulo2, Contenedor } from "./NavBarElements";
//import { Line, defaults } from 'react-chartjs-2'

defaults.global.tooltips.enabled = false;
defaults.global.legend.position = "bottom";
const baseUrl = "http://localhost:5000";
const baseUrl2 = "http://34.107.243.225";

function Ram () {
  //-----------DATA VM1---------
  const [operaciones,setOperations] = useState([])
 
  const [datos, setDatos] = useState([])
  const [total, setTotal] = useState([])
  const [consumida, setConsumida] = useState([])
  const [porcentaje, setPorcentaje] = useState([])
  const [libre, setLibre] = useState([])
 // const [porcgraph1, setPorcgraph1] = useState([])
//------------DATA VM2---------
  const [total2, setTotal2] = useState([])
  const [consumida2, setConsumida2] = useState([])
  const [porcentaje2, setPorcentaje2] = useState([])
  const [libre2, setLibre2] = useState([])
  let interval

  function actualizar(data){
    setDatos(datos=> data[data.length-1])
    //setTotal(totalRam=>datos.data.total)
  }

  function totalRams(data){
    console.log(data[data.length-1].vm)
    
    if (data[data.length-1].vm==="Virtual Machine 2"){
      console.log("MAQUINA 2 ADENTRO")
      setTotal2(tot=> data[data.length-1].data.total)
      setConsumida2(tot=> data[data.length-1].data.consumida)
      setPorcentaje2(tot=> data[data.length-1].data.porcentaje)
      setLibre2(tot=> data[data.length-1].data.libre)
    }else{
      setTotal(tot=> data[data.length-1].data.total)
      setConsumida(tot=> data[data.length-1].data.consumida)
      setPorcentaje(tot=> data[data.length-1].data.porcentaje)
      setLibre(tot=> data[data.length-1].data.libre)
      //setPorcgraph1(oldArray => [...oldArray, data[data.length-1].data.porcentaje]);
     // console.log(porcgraph1)
    }

  }

  //-----------SOCKET CONNECTION
  const socket = io.connect(baseUrl);
 
  //-------------------
  useEffect(() => {
    const interval = setInterval(() => {
      getInfo()
    }, 5000);
    
    socket.emit("ram", "asd-prueba");    
    socket.on("ram", async (mensaje) => {
    console.log("MENSAJE: ", mensaje);
    totalRams(mensaje)
    })

    return () => clearInterval(interval);
  }, [socket]);
  const tempInt = []
  console.log(tempInt);
  console.log("sali")




  const getInfo = async() => {
    await fetch(`${baseUrl2}/RAM`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        
        }
    })
    .then(resp => resp.json())
    .then(data => {
      setOperations(data)  
    }).catch(console.error)
  }

  //-----DESIGN----
  return (
    <div>
      <div>RAM</div>
      <Rectangulo>
        <h3>VM1</h3>
        <div className="rectangle2">
          Total
          <br/>
          <b>{total/(1024)}MB</b>
        </div>
        <div className="rectangle2">
          en uso:
          <br/>
          <b>{consumida/1024}MB</b>
        </div>
        <div className="rectangle2">en uso %
        <br/>
          <b>{porcentaje}%</b>
        </div>
        <div className="rectangle2">RAM libre
        <br/>
          <b>{libre/1024}MB</b>
        </div>
      </Rectangulo>
      <Rectangulo2>
        <h3>VM2</h3>
        <div className="rectangle2">Total
        <br/>
          <b>{total2/(1024)}MB</b>
        </div>
        <div className="rectangle2">en uso
        <br/>
          <b>{consumida2/1024}MB</b>
        </div>
        <div className="rectangle2">en uso %
        <br/>
          <b>{porcentaje2}%</b>
        </div>
        <div className="rectangle2">RAM libre
        <br/>
          <b>{libre2/1024}MB</b>
        </div>
      </Rectangulo2>

      <Contenedor>
        <Line
          data={{
            labels: [1,2,3,4,5,6],
            datasets: [
              {
                label: "VM1",
                data: [1,2],
                borderColor: "orange",
                borderWidth: 1,
              },
              {
                label: "VM2",
                data: [porcentaje2],
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
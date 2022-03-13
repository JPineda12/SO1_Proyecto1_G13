import React, { useEffect, useState } from "react";
import { Line, defaults } from "react-chartjs-2";
import io from 'socket.io-client';

import { Rectangulo, Rectangulo2, Contenedor, Cartel } from "./NavBarElements";
//import { Line, defaults } from 'react-chartjs-2'

defaults.global.tooltips.enabled = false;
defaults.global.legend.position = "bottom";
const baseUrl = "https://loyal-operation-341718.uc.r.appspot.com";
const baseUrl2 = "https://34.149.160.8/RAM";
const counter=1

function Ram () {
  //-----------DATA VM1---------
  const [operaciones,setOperations] = useState([])
 
  const [datos, setDatos] = useState([])
  const [total, setTotal] = useState([])
  const [consumida, setConsumida] = useState([])
  const [porcentaje, setPorcentaje] = useState([])
  const [libre, setLibre] = useState([])
  const [porcgraph1, setPorcgraph1] = useState([])
  const [porcgraph2, setPorcgraph2] = useState([])
  const [axis, setAxis] = useState([0])
//------------DATA VM2---------
  const [total2, setTotal2] = useState([])

  const [consumida2, setConsumida2] = useState([])
  const [porcentaje2, setPorcentaje2] = useState([])
  const [libre2, setLibre2] = useState([])



  function totalRams(data){
    console.log(data[data.length-1].vm)

    if (data[data.length-1].vm==="Virtual Machine 2"){
      console.log("MAQUINA 2 ADENTRO")
      setTotal2(tot=> data[data.length-1].total)
      setConsumida2(tot=> data[data.length-1].consumida)
      setPorcentaje2(tot=> data[data.length-1].porcentaje)
      setLibre2(tot=> data[data.length-1].libre)
    }else{
      setTotal(tot=> data[data.length-1].total)
      setConsumida(tot=> data[data.length-1].consumida)
      setPorcentaje(tot=> data[data.length-1].porcentaje)
      setLibre(tot=> data[data.length-1].libre)

    }

  }


  //sssssss

  //-----------SOCKET CONNECTION
  const socket = io.connect(baseUrl);
 
  //-------------------
  useEffect(() => {
    const interval = setInterval(() => {
      getInfo()
      setPorcgraph1(datos=>[...datos,porcentaje])
      setPorcgraph2(datos=>[...datos,porcentaje2])
      setAxis(datos=>[...datos,datos[datos.length-1]+1])
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
    await fetch(`${baseUrl2}`, {
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
            labels: axis,
            datasets: [
              {
                label: "VM1 %",
                data: porcgraph1,
                borderColor: "orange",
                borderWidth: 1,
              },
              {
                label: "VM2%",
                data: porcgraph2,
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
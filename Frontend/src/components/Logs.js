import React, { useEffect, useState } from "react";
import { Table } from 'reactstrap';
import io from 'socket.io-client';
import { JsonView, darkStyles, defaultStyles } from 'react-json-view-lite';

const baseUrl = "https://loyal-operation-341718.uc.r.appspot.com";


const socket = io.connect(baseUrl);

function Logs() {
  const [logs,setLogs] = useState([])
  const [operaciones,setOperations] = useState([])

  async function llenar(data){
    console.log("Wenassssss")
    console.log(data)
    setLogs(tot=> data)
  }

  function verificar(data){
      if(data.hasOwnProperty('consumida')){
        return JSON.stringify(data)
      }else{
        return JSON.stringify(data)
      }
  }

  useEffect(() => {

    socket.emit("log", "asd-prueba");    
    socket.on("log", async (mensaje) => {
    console.log("MENSAJE: ", mensaje);
    llenar(mensaje)
    //totalRams(mensaje)
    })

  }, [socket]);




  return (
    <table className="table" border='1'>
    <thead>
      <tr>
      <th>
          No
        </th>
        <th>
          VM
        </th>
        <th>
          Endpoint
        </th>
        <th>
          Data
        </th>
        <th>
          Date
        </th>
      </tr>
    </thead>
    <tbody>

    {logs.map(( {vm,endpoint,data,date}, index ) => {
          return (
            <tr>
              <td><b>{index}</b></td>
              <td>{vm}</td>
              <td>{endpoint}</td>
              <td>{<td>{<JsonView data={data} shouldInitiallyExpand={(level) => false} style={darkStyles} />}</td>}</td>
              <td>{date}</td>
              <td></td>
            </tr>
          );
        })}

    </tbody>
  </table>
  )
}

export default Logs
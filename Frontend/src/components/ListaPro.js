import React, { useEffect, useState } from "react";
import { Table } from 'reactstrap';
import io from 'socket.io-client';
import './Tabla.css';
import { Rectangulo, Rectangulo2, Contenedor } from "./NavBarElements";
import { JsonView, darkStyles, defaultStyles } from 'react-json-view-lite';

const baseUrl = "https://loyal-operation-341718.uc.r.appspot.com";
const baseUrl2 = "https://34.149.160.8/CPU";

const socket = io.connect(baseUrl);
let datoss
function ListaPro() {
  const [procesos,setProcesos] = useState([])
  const [operaciones,setOperations] = useState([])
  const [lista,setLista] = useState([])
  const [currentp,setCurrentp] = useState([])

  
  

 async function llenar(data){
    console.log("Wenassssss")
    console.log(data)
    //console.log(data[0].vm)
    setProcesos(tot=> data[data.length-1].process_list)
    setCurrentp(tot=> data[data.length-1].vm)
   // setLista(oldArray => [...oldArray, data[data.length-1].process_list[data[data.length-1].process_list.length-1]])
  }

  function definirState(data){
    if(data=="0"){
      return "Corriendo"
    }else if( data=="1"){
      return "Interrumpible"
    }else if(data=="2"){
      return "Ininterrumpible"
    }else if(data=="4"){
      return "Detenida"
    }else if(data=="8"){
      return "Recorrida"
    }else if(data=="16"){
      return "EXIT_DEAD"
    }else if(data=="32"){
      return "EXIT_Zombie"
    }else if(data=="64"){
      return "TASK_DEAD"
    }else if(data=="128"){
      return "TASK_WAKEKILL"
    }else if(data=="256"){
      return "TASK_WAKING"
    }else if(data=="512"){
      return "TASK_PARKED"
    }else if(data=="1024"){
      return "TASK_NOLOAD"
    }else if(data=="2048"){
      return "TASK_STATE_MAX"
    }else if(data=="1026"){
      return "SLEEPING"
    }

  }

  useEffect(() => {
    socket.connect()
    const interval = setInterval(() => {
      getInfo()
    }, 5000);
    socket.emit("cpu", "asd-prueba");    
    socket.on("cpu", async (mensaje) => {
    console.log("MENSAJE: ", mensaje);
    llenar(mensaje)
    socket.disconnect()
    //totalRams(mensaje)
    })

    return () => clearInterval(interval);
  }, [socket]);

  const tempInt = []
  console.log(tempInt);
  console.log("sali")


  const getInfo = async() => {
    await fetch(`${baseUrl2}`, {
        method: 'GET',
    })
  }

  console.log(lista)


  return (
<div>

 
  <table className="table" border='1'>
    <thead>
      <tr>
        <th>
          VM2
        </th>
        <th>
          Nombre del proceso 
        </th>
        <th>
          PID
        </th>
        <th>
          PID del padre
        </th>
        <th>
          Estado
        </th>
        <th>
          Hijos
        </th>
      </tr>
    </thead>
    <tbody>

    {procesos.map(( {name,pid,parent_pid,state,sons_list}, index ) => {
          return (
            <tr>
              <td>{currentp}</td>
              <td>{name}</td>
              <td>{pid}</td>
              <td>{parent_pid}</td>
              <td>{definirState(state)}</td>
              <td>{<JsonView data={sons_list} shouldInitiallyExpand={(level) => false} style={darkStyles} />}</td>
              
            </tr>
          );
        })}


  
           
    </tbody>
  </table>

 
  </div>

  
  
  )
}

export default ListaPro;
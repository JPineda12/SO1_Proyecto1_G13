# Arquitectura Implementada

<p align="center"> 
  <img align="center" width="640px" height="500px" src="imgs/Arq.png" />
</p>

La aplicacion se construyo con una arquitectura basada en la nube (GCP), Haciendo uso de distintos servicios como Load Balancing, AppEngine, CloudRun, VMs y Cloud Functions se implemento
cada parte del proyecto. A continuacion se describe cada parte de la arquitectura:
# Frontend - Cloud Run
<p align="center"> 
  <img align="center" width="240px" src="imgs/CloudRun.png" />
</p>


# API Reportes - App Engine
<p align="center"> 
  <img align="center" width="240px" src="imgs/AppEngine.png" />
</p>


# APIs Modulos - VM 
<p align="center"> 
  <img align="center" width="240px" src="imgs/VMModulos.png" />
</p>
Utilizacion el servicio de Compute Engine se crearon 2 maquinas virtuales (VM) las cada una contiene una copia de: 

- ### Modulos de Kernel RAM Y CPU (C)
>> RAM: Este es un modulo que al ser insertado permite ver la informacion actual del sistema respecto al consumo de memoria RAM

>> CPU: Este es un modulo que al ser insertado permite ver la informacion actual del sistema respecto a los procesos actuales.


- ### API Modulos (GO)
Esta API fue escrita en GO y dockerizada. Permite la comunicacion entre el sistema operativo de la virtual machine y la insercion de datos en la base de datos. <br>
Lee la informacion del modulo kernel solicitado con su respectivo endpoint (RAM o CPU) y envia una solicitud POST a la [CloudFunction](#guardado-de-Logs---cloud-functions) para guardar en la base de datos.


# Base de Datos - VM
<p align="center"> 
  <img align="center" width="240px" src="imgs/VMMongo.png" />
</p>
En una tercera maquina virtual se instalo Docker y se levanto un contenedor de MongoDB la cual es la encargada de guardar los diferentes registros del proyecto. Logs, CPU y RAM

Este se comunica solamente con la [CloudFunction](#guardado-de-Logs---cloud-functions) para guardar datos y con la [Api Reportes](#API-Reportes---App-Engine)


# Guardado de Logs - Cloud Functions
<p align="center"> 
  <img align="center" width="240px" src="imgs/CloudFunctions.png" />
</p>


# Load Balancing 
<p align="center"> 
  <img align="center" width="240px" src="imgs/Balancer.png" />
</p>




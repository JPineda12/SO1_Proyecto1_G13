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

Este servicio nos permite hacer despliegues de aplicaciones en la nube haciendo uso de docker. En este caso se hizo una aplicacion web en react, la cual fue dockerizada y posteriormente se hace el despliegue en el servicio.

>> En esta aplicación se muestra en tiempo real la informacion de cada proceso y el uso de la memoria en cada una de las maquinas virtuales, detallando el trafico del balanceador de carga.

# API Reportes - App Engine
<p align="center"> 
  <img align="center" width="240px" src="imgs/AppEngine.png" />
</p>

Este servicio nos permite hacer el despliegue de API's en la nube, en este caso se hizo uso de node para poder comunicar el frontend hecho en react, con la base de datos hecha en mongoDB.

Para el despliegue de esta API se usa un archivo .yaml el cual especifica las dependencias que necesita para funcionar la aplicacion, en este caso solo nodejs16.

>> Para acceder a la api se puede hacer desde el siguiente link: https://loyal-operation-341718.uc.r.appspot.com

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
Lee la informacion del modulo kernel solicitado con su respectivo endpoint (RAM o CPU) y envia una solicitud POST a la 
[CloudFunction](#guardado-de-Logs---cloud-functions) 
para guardar en la base de datos.


# Base de Datos - VM
<p align="center"> 
  <img align="center" width="240px" src="imgs/VMMongo.png" />
</p>
En una tercera maquina virtual se instalo Docker y se levanto un contenedor de MongoDB la cual es la encargada de guardar los diferentes registros del proyecto. Logs, CPU y RAM
</br>

Este se comunica solamente con la [CloudFunction](#Guardado-de-Logs---Cloud-Functions) 
para guardar datos y con la [Api Reportes](#API-Reportes---App-Engine) 
para obtener los datos guardados.


# Guardado de Logs - Cloud Functions
<p align="center"> 
  <img align="center" width="240px" src="imgs/CloudFunctions.png" />
</p>

El servicio de Cloud Functions aloja una funcion en GO que permite enviar requests a la base de datos contenida en la [Virtual Machine de Mongo DB](#Base-de-Datos---VM) y asi guardar la informacion enviada desde alguna de las dos VM que contienen la [API Modulos](#APIs-Modulos---VM)



# Load Balancing 
<p align="center"> 
  <img align="center" width="240px" src="imgs/Balancer.png" />
</p>

El Balanceador se encarga de dividir el trafico proveniente de las solicitudes del [Frontend](#Frontend---Cloud-Run) a conveniencia para realizar las peticiones a cualquiera de las dos Maquinas virtuales que contienen la API de Modulos.




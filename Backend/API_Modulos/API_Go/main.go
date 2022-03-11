package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

type api struct {
	router http.Handler
}

type Server interface {
	Router() http.Handler
}

type Proceso struct {
	Name       string `json:"Name"`
	PID        int64  `json:"PID"`
	State      int64  `json:"State"`
	Parent_PID int64  `json:"Parent_PID"`
	Sons_List  []Proceso
}

type RAM struct {
	VM         string
	Total      int64
	Consumida  int64
	Libre      int64
	Porcentaje int64
}

type DataCPU struct {
	VM           string
	Process_List []Proceso `json:"Process_List"`
}

type LogRam struct {
	VM       string
	Endpoint string
	Data     RAM
	Date     string
}
type LogCPU struct {
	VM       string
	Endpoint string
	Data     DataCPU
	Date     string
}

var ruta_ram = "/miproc/ram_grupo13"
var ruta_cpu = "/miproc/cpu_grupo13"
var num_VM = "Virtual Machine 2"
var RAM_URL = "https://us-central1-modified-talon-341302.cloudfunctions.net/sopes-logram"
var CPU_URL = "https://us-central1-modified-talon-341302.cloudfunctions.net/sopes1-logcpu"

func New() Server {
	a := &api{}

	r := mux.NewRouter()
	r.HandleFunc("/", a.getIndex).Methods("GET")
	r.HandleFunc("/CPU", a.getCPU).Methods("GET")
	r.HandleFunc("/RAM", a.getRAM).Methods("GET")
	a.router = r

	return a
}

func (a *api) Router() http.Handler {
	return a.router
}

func (a *api) getIndex(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(struct {
		Mensaje string `json:"mensaje"`
	}{Mensaje: "API - Group Thirteen"})
}

func (a *api) getCPU(w http.ResponseWriter, r *http.Request) {
	reqBody, err := ioutil.ReadFile(ruta_cpu)
	if err != nil {
		fmt.Fprintf(w, "Inserte datos validos")
		return
	}
	var x DataCPU
	json.Unmarshal(reqBody, &x)
	fmt.Println("x sons: ", x.Process_List[0].Sons_List)
	var log_CPU LogCPU
	log_CPU.VM = num_VM
	log_CPU.Endpoint = "/CPU"
	log_CPU.Data = x
	log_CPU.Data.VM = num_VM
	tiempo := time.Now()
	log_CPU.Date = tiempo.String()
	jsonInfo, _ := json.Marshal(log_CPU)

	//Send request to Cloud Function
	req, err := http.Post(CPU_URL, "application/json", bytes.NewBuffer(jsonInfo))
	if err != nil {
		panic(err)
	}
	var res interface{}
	json.NewDecoder(req.Body).Decode(&res)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(struct {
		Mensaje      string `json:"mensaje"`
		RespuestaBD  interface{}
		Data_Enviada interface{}
	}{Mensaje: "Log enviado a base", RespuestaBD: res, Data_Enviada: x})
}

func (a *api) getRAM(w http.ResponseWriter, r *http.Request) {
	reqBody, err := ioutil.ReadFile(ruta_ram)
	if err != nil {
		fmt.Fprintf(w, "Inserte datos validos")
		return
	}
	var x RAM
	json.Unmarshal(reqBody, &x)

	var log_RAM LogRam
	log_RAM.VM = num_VM
	log_RAM.Endpoint = "/RAM"
	log_RAM.Data = x
	log_RAM.Data.VM = num_VM
	tiempo := time.Now()
	log_RAM.Date = tiempo.String()
	jsonInfo, _ := json.Marshal(log_RAM)

	//Send request to Cloud Function
	req, err := http.Post(RAM_URL, "application/json", bytes.NewBuffer(jsonInfo))
	if err != nil {
		panic(err)
	}
	var res interface{}
	json.NewDecoder(req.Body).Decode(&res)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(struct {
		Mensaje      string `json:"mensaje"`
		RespuestaBD  interface{}
		Data_Enviada interface{}
	}{Mensaje: "Log enviado a base", RespuestaBD: res, Data_Enviada: x})
}

func main() {

	s := New()
	Cors := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowCredentials: true,
	})
	Handler := Cors.Handler(s.Router())
	fmt.Println("Server UP on port: 8080")

	log.Fatal(http.ListenAndServe(":8080", Handler))
	//log.Fatal(http.ListenAndServe(":8080", s.Router()))
}

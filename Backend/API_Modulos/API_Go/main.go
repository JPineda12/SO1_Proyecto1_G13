package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

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
}

type RAM struct {
	Total      int64
	Consumida  int64
	Libre      int64
	Porcentaje int64
}

type Data struct {
	Process_List []Proceso `json:"Process_List"`
}

var ruta_ram = "/miproc/ram_grupo13"
var ruta_cpu = "/miproc/cpu_grupo13"

func New() Server {
	a := &api{}

	r := mux.NewRouter()
	r.HandleFunc("/CPU", a.getCPU).Methods("GET")
	r.HandleFunc("/RAM", a.getRAM).Methods("GET")
	a.router = r

	return a
}

func (a *api) Router() http.Handler {
	return a.router
}

func (a *api) getCPU(w http.ResponseWriter, r *http.Request) {
	reqBody, err := ioutil.ReadFile(ruta_cpu)
	if err != nil {
		fmt.Fprintf(w, "Inserte datos validos")
		return
	}
	var x Data
	json.Unmarshal(reqBody, &x)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(x)
}

func (a *api) getRAM(w http.ResponseWriter, r *http.Request) {
	reqBody, err := ioutil.ReadFile(ruta_ram)
	if err != nil {
		fmt.Fprintf(w, "Inserte datos validos")
		return
	}
	var x RAM
	json.Unmarshal(reqBody, &x)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(x)
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

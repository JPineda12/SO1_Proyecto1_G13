package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type api struct {
	router http.Handler
}

type Server interface {
	Router() http.Handler
}

type LogRam struct {
	VM       string
	Endpoint string
	Data     []DataRam
	Date     string
}
type LogCPU struct {
	VM       string
	Endpoint string
	Data     []DataCPU
	Date     string
}

type DataCPU struct {
	Process_List []Proceso
}

type Proceso struct {
	Name       string
	PID        int64
	State      int64
	Parent_PID int64
}

type DataRam struct {
	Total      int64
	Consumida  int64
	Libre      int64
	Porcentaje int64
}

func New() Server {
	a := &api{}
	r := mux.NewRouter()
	r.HandleFunc("/PruebaRAM", a.PostRAM).Methods("POST")
	r.HandleFunc("/PruebaCPU", a.PostCPU).Methods("POST")
	a.router = r

	return a
}

func (a *api) Router() http.Handler {
	return a.router
}

var MONGO = "mongodb://mongoadmin:amarillo1234@35.232.31.144:27017/ProyectoSopes1?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false"

func (a *api) PostRAM(w http.ResponseWriter, r *http.Request) {
	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		fmt.Fprintf(w, "Inserte datos validos")
		return
	}
	client, _ := mongo.NewClient(options.Client().ApplyURI(MONGO))
	var logRAM LogRam
	json.Unmarshal(reqBody, &logRAM)

	collection := client.Database("ProyectoSopes1").Collection("log")
	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)
	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}
	collection.InsertOne(ctx, logRAM)

	collection = client.Database("ProyectoSopes1").Collection("memoria")
	ctx, _ = context.WithTimeout(context.Background(), 5*time.Second)
	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}
	collection.InsertOne(ctx, logRAM.Data)

	//RESPUESTA
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	json.NewEncoder(w).Encode(struct {
		Mensaje string `json:"mensaje"`
		Data    interface{}
	}{Mensaje: "Log almacenado en base", Data: logRAM})
}

func (a *api) PostCPU(w http.ResponseWriter, r *http.Request) {
	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		fmt.Fprintf(w, "Inserte datos validos")
		return
	}
	client, _ := mongo.NewClient(options.Client().ApplyURI(MONGO))
	var logCPU LogCPU
	json.Unmarshal(reqBody, &logCPU)

	collection := client.Database("ProyectoSopes1").Collection("log")
	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)
	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}
	collection.InsertOne(ctx, logCPU)

	collection = client.Database("ProyectoSopes1").Collection("procesos")
	ctx, _ = context.WithTimeout(context.Background(), 5*time.Second)
	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}
	collection.InsertOne(ctx, logCPU.Data)

	//RESPUESTA
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	json.NewEncoder(w).Encode(struct {
		Mensaje string `json:"mensaje"`
		Data    interface{}
	}{Mensaje: "Log almacenado en base", Data: logCPU})

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

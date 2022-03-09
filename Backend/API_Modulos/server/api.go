package server

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type api struct {
	router http.Handler
}

type Server interface {
	Router() http.Handler
}

var collection *mongo.Collection
var client *mongo.Client

func New() Server {
	a := &api{}

	r := mux.NewRouter()
	r.HandleFunc("/suma", a.Suma).Methods("POST")
	r.HandleFunc("/resta", a.Resta).Methods("POST")
	r.HandleFunc("/multiplicacion", a.Multiplicacion).Methods("POST")
	r.HandleFunc("/division", a.Division).Methods("POST")
	r.HandleFunc("/datos", a.getDatos).Methods("GET")
	a.router = r

	client, _ = mongo.NewClient(options.Client().ApplyURI("mongodb://mongoadmin:admin@34.125.207.236:27017/SOPractica1?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false"))

	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	err := client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}

	//ping the database
	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Connected to MongoDB")

	return a
}

func (a *api) Router() http.Handler {
	return a.router
}

func (a *api) getDatos(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-type", "application/json")
	var datosArray []Prueba
	fmt.Println(datosArray)
	collection := client.Database("practica1").Collection("Operacion")
	ctx, _ := context.WithTimeout(context.Background(), 30*time.Second)
	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{ "message": "` + err.Error() + `" }`))
		return
	}
	defer cursor.Close(ctx)
	for cursor.Next(ctx) {
		var temp Prueba
		cursor.Decode(&temp)
		fmt.Println("Prueba: ", temp)
		datosArray = append(datosArray, temp)
	}
	if err := cursor.Err(); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{ "message": "` + err.Error() + `" }`))
		return
	}
	json.NewEncoder(w).Encode(datosArray)

}

func (a *api) Suma(w http.ResponseWriter, r *http.Request) {
	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		fmt.Fprintf(w, "Inserte datos validos")
		return
	}
	var x Prueba
	json.Unmarshal(reqBody, &x)
	n1, _ := strconv.ParseFloat(x.Num1, 64)
	n2, _ := strconv.ParseFloat(x.Num2, 64)
	x.Res = fmt.Sprintf("%f", n1+n2)
	x.Operacion = "Suma"
	w.Header().Set("Content-Type", "application/json")
	collection := client.Database("practica1").Collection("Operacion")
	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)
	collection.InsertOne(ctx, x)
	json.NewEncoder(w).Encode(x)

}

func (a *api) Resta(w http.ResponseWriter, r *http.Request) {
	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		fmt.Fprintf(w, "Inserte datos validos")
		return
	}
	var x Prueba
	json.Unmarshal(reqBody, &x)
	n1, _ := strconv.ParseFloat(x.Num1, 64)
	n2, _ := strconv.ParseFloat(x.Num2, 64)
	x.Res = fmt.Sprintf("%f", n1-n2)
	x.Operacion = "Resta"
	w.Header().Set("Content-Type", "application/json")
	collection := client.Database("practica1").Collection("Operacion")
	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)
	collection.InsertOne(ctx, x)
	json.NewEncoder(w).Encode(x)
}

func (a *api) Multiplicacion(w http.ResponseWriter, r *http.Request) {
	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		fmt.Fprintf(w, "Inserte datos validos")
		return
	}
	var x Prueba
	json.Unmarshal(reqBody, &x)
	n1, _ := strconv.ParseFloat(x.Num1, 64)
	n2, _ := strconv.ParseFloat(x.Num2, 64)
	x.Res = fmt.Sprintf("%f", n1*n2)
	x.Operacion = "Multiplicacion"
	w.Header().Set("Content-Type", "application/json")
	collection := client.Database("practica1").Collection("Operacion")
	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)
	collection.InsertOne(ctx, x)
	json.NewEncoder(w).Encode(x)
}

func (a *api) Division(w http.ResponseWriter, r *http.Request) {
	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		fmt.Fprintf(w, "Inserte datos validos")
		return
	}
	var x Prueba
	x.Operacion = "Division"
	json.Unmarshal(reqBody, &x)
	n1, _ := strconv.ParseFloat(x.Num1, 64)
	n2, _ := strconv.ParseFloat(x.Num2, 64)

	var res float64 = n1 / n2
	x.Res = fmt.Sprintf("%f", res)
	w.Header().Set("Content-Type", "application/json")
	collection := client.Database("practica1").Collection("Operacion")
	ctx, _ := context.WithTimeout(context.Background(), 5*time.Second)
	collection.InsertOne(ctx, x)
	json.NewEncoder(w).Encode(x)
}

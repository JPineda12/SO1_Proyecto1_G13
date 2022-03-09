package main

import (
	"fmt"
	"log"
	"net/http"
	"practica1/server"

	"github.com/rs/cors"
)

func main() {

	s := server.New()
	Cors := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowCredentials: true,
	})
	Handler := Cors.Handler(s.Router())
	fmt.Println("Server UP on port: 8080")

	log.Fatal(http.ListenAndServe(":8080", Handler))
	//log.Fatal(http.ListenAndServe(":8080", s.Router()))
}

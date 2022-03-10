FROM golang:1.16
WORKDIR /backend_modulos
COPY . .
RUN  go mod download
EXPOSE 8080
CMD ["go","run","main.go"]
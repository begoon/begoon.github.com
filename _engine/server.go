package main

import "net/http"

func main() {
  panic(http.ListenAndServe(":80", http.FileServer(http.Dir(".."))))
}


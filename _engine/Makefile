all: format run

file = main

fmt_flags = -w=true -tabs=false -tabwidth=2

format:
	gofmt $(fmt_flags) $(file).go

run:
	go run $(file).go $(args)

server:
	go run server.go&

updated-public:
	git status | grep "modified:   ../" | cut -d ' ' -f 4 | xargs -I {} echo {}

revert-updated-public:
	git status | grep "modified:   ../" | cut -d ' ' -f 4 | xargs -I {} git checkout {}

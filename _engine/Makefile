all: format run

file = main

fmt_flags = -w=true -tabs=false -tabwidth=2

format:
	gofmt $(fmt_flags) $(file).go

run:
	go run $(file).go $(args)

server:
	go run server.go&

filter-updated:
	git status | grep "modified:   ../" | cut -d ' ' -f 4 | xargs -I {} $(cmd) {}
  
updated-public:
	$(MAKE) filter-updated cmd=echo
  
revert-updated-public:
	$(MAKE) filter-updated cmd="git checkout"

code-css:
	highlight --style-outfile=_site/css/highlight.css --print-style \
	--font Menlo,Monaco,\"Andale\ Mono\",\"lucida\ console\",\"Courier\ New\",monospace
	cat _site/css/highlight.css

newpost:
	ruby newpost.rb


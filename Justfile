set positional-arguments
set shell := ["bash", "-euo", "pipefail", "-c"]

# Format the engine and regenerate the blog.
all: format build

# Generate the static blog, including its browser assets.
build *args:
    cd _engine && go run main.go "$@"

# Format the Go engine.
format:
    gofmt -w _engine/main.go _engine/main_test.go

alias run := build
alias server := serve

# Serve the static blog locally.
serve port="9000":
    uv run --no-project python -m http.server "$1"

# Create a post interactively, with an optional translation.
newpost:
    uv run --no-project python _engine/newpost.py

# List tracked files with unstaged changes outside _engine.
updated-public:
    git diff --name-only -- . ':(exclude)_engine'

# Discard unstaged changes outside _engine, including root config and docs.
revert-updated-public:
    git restore --worktree -- . ':(exclude)_engine'

# Run a command for each tracked file with unstaged changes outside _engine.
[private]
filter-updated +command:
    git diff --name-only -z -- . ':(exclude)_engine' | xargs -0 -I {} "$@" '{}'

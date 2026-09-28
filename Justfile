# Generate the static blog, including its browser assets.
build:
    cd _engine && go run main.go

# Serve the static blog locally.
serve:
    uv run python -m http.server 9000

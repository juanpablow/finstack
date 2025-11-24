FROM rust:latest as builder

WORKDIR /app

# Copy all files
COPY . .

# Build the application
RUN cargo build --release

# Runtime stage
FROM debian:bookworm-slim

# Install dependencies
RUN apt-get update && \
    apt-get install -y ca-certificates libpq5 && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy binary from builder
COPY --from=builder /app/target/release/finstack-api /app/finstack-api

# Copy .env file
COPY .env .env

EXPOSE 8080

CMD ["./finstack-api"]

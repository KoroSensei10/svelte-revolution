# Use the official Rust image as the base image
FROM rust:latest

# Set the working directory
WORKDIR /app

# Copy the Cargo.toml and Cargo.lock files
COPY Cargo.toml Cargo.lock ./

# Copy the source code
COPY . .

# Build the application
RUN cargo build --release

# Expose the port that Rocket will run on
EXPOSE 8000

# Set the startup command to run the Rocket application
CMD ["./target/release/rust-server"]
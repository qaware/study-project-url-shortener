# .devcontainer/Dockerfile
FROM node:22-bullseye

# Install build dependencies for compiling Python 3.13 and other required packages
RUN apt-get update && apt-get install -y \
    build-essential \
    wget \
    libssl-dev \
    zlib1g-dev \
    libncurses5-dev \
    libncursesw5-dev \
    libreadline-dev \
    libsqlite3-dev \
    libgdbm-dev \
    libdb5.3-dev \
    libbz2-dev \
    libexpat1-dev \
    liblzma-dev \
    tk-dev \
    curl \
    docker.io \
    python3-venv \
    apt-transport-https \
    ca-certificates \
    gnupg \
    curl && \
    rm -rf /var/lib/apt/lists/*

# Download, compile, and install Python 3.13
RUN wget https://www.python.org/ftp/python/3.13.0/Python-3.13.0.tgz && \
    tar -xf Python-3.13.0.tgz && \
    cd Python-3.13.0 && \
    ./configure --enable-optimizations && \
    make -j$(nproc) && \
    make altinstall && \
    cd .. && \
    rm -rf Python-3.13.0 Python-3.13.0.tgz

# Install Taskfile (Go Task)
RUN curl -s https://taskfile.dev/install.sh | sh

EXPOSE 80

WORKDIR /workspace
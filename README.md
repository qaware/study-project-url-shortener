
# UrlShortener

This project is a demonstration of a URL shortener application built using Angular and Python. The project is intended for educational and demonstrative purposes, providing a hands-on example of how to work with Angular, Python, Docker and some further tools (Taskfile, ...).

## Requirements

To use this project locally, the followin dependencies have to be installed:

- node version 22 including npm
- python version 3.13
- taskfile version 3.40
- docker

## Usage

This section contains basic information about how the project shall be used.

Predefined tasks can be listed by simply entering `task` in the terminal. This lists all defined Taskfile tasks.

### Start the Application

Two differnt modes are implemented for starting the project:

1. Development:
    - Frontend and backend are executed independently by using commands `task run-backend-dev` and `task run-frontend-dev`.
    - This mode auto-updates running frontend and backend when changes to the corresponding code base were noticed.
    - The UI can be viewed locally at URL `http://localhost:80`
    - The backend can be reached locally via URL `http://localhost:8000`
    - The whole application will only work if both, frontend and backend, are running
2. Production
    - Application can be run via command `task run`
      - The commands includes
        - stopping the application
        - building the image
        - using the build image to start the docker container
    - Builds an image using `./Dockerfile` and uses it to start a docker container.
    - The `Dockerfile` contains both, frontend and backend.
    - The UI can be viewed locally at URL `http://localhost:8000`

### Github Codespace

A working environment for Github Codespaces is defined within `./.devcontainer`. It includes all listed requirements in section [Requirements](#requirements)

## Task

TODO:
This section is to be filled for the corresponding task, depending on what students shall do.
The general idea is to remove funcitonality, which students have to fill in later on.

<!-- # Requirements

- node version 22
 
# how to use

- taskfile
- docker commands
  
# Aufgabe
hier ausfü+llen lassen
# What to do
## teil 1

## teil 2

---- Previous version -->

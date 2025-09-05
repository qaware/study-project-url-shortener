
# UrlShortener

This project demonstrates a URL shortener application built with Angular and Python. The project is intended for educational and demonstrative purposes, providing a hands-on example of how to work with Angular, Python, Docker and some further tools (Taskfile, ...).

## Requirements

To use this project locally, the following dependencies have to be installed:

- Node.js version 22 including npm
- Python version 3.13
- Taskfile version 3.40
- Docker

## Tasks

You will develop some functionality within this repository

But BEFORE you change and commit any code, create a new Git branch with a name in the format `student/your-name` by executing command:

```bash
git checkout -b <your-branch-name>
```

For more information about Git, visit section [Git](#git).

### Application Development

The application which is to be completed is an URL shortener. A URL shortener is a tool that converts a long URL into a shorter, more manageable link. When entered, the shortened URL redirects users to the original destination, often while tracking click analytics.

In our scenario, a user can enter a long URL into an input field, which is then converted into a shorter URL. That shorter URL consists of the base-URL of your website, where the UI can be viewed (e.g. "localhost"), and a path appendix.

A short example:

```bash
http://base-url/appendix
```

Store the appendix key on the backend. This key serves as a shorthand for a full URL. When a user enters `http://base-url/appendix` in their browser, they will be redirected to the associated full URL. For example, the full URL might be “www.youtube.com”.

#### Primary Task

The backend of the application is not complete yet. The required endpoints which are called by the frontend are not implemented (take a look at file `src/backend/main.py`).

The following two Python-endpoints (in file `src/backend/main.py`) have to be implemented for this task:

- `shorten_url`
- `get_long_url`
  
You can test the functionality of those endpoints locally by utilizing the Taskfile task `execute-shorten-local` to shorten an URL and task `execute-get-long-url-local` to retrieve the original long version of a short URL.

Also, there already are working test-endpoints within `main.py` with corresponding test-tasks (enter `task` in the terminal to list all tasks) which you can use to get a better understanding of how the unimplemented endpoints could be implemented.

#### Optional QR Code Implementation

Optionally, the QR-Code endpoint `get_qr_code` can be implemented. It should take a URL parameter, generate a QR code from it, encode that QR code as a base64 string, and then return the result.

## Usage

This section contains basic information about how the project shall be used.

You can list predefined tasks by running `task` in the terminal. This lists all defined Taskfile tasks.

### Git

Git is a distributed version control system that allows you to track changes in your code, collaborate with others, and maintain a complete history of your project. This allows, for example, to come back to a previous code version late ron. It is an essential tool for modern software development. Here are some basic commands and best practices to get you started:

#### Create a Branch

Always create a new branch for your work to keep changes isolated:

```bash
git checkout -b some-branch-name/comes-also-with-slashes
```

#### Make Changes and Commit

After editing files, stage and commit your changes with a meaningful message:

```bash
git add .
git commit -m "Describe your changes here"
```

#### Push Your Branch

Share your branch with others or just back up your changes by pushing it to the remote repository:

```bash
git push origin your-branch-name
```

#### Update branch

Get the newest version of your branch:

```bash
git pull origin main
```

#### List Commits

You might want to list commits to apply actions based on previous commits (like resetting to a specific commit):

```bash
git log
```

#### Resetting a Branch to a Commit

If you might have implemented some trash and want to reset to an earlier state:

```bash
git reset <commit-hash>
```

The `commit-hash` can be taken from listed commits. See [List Commits](#list-commits).

### Build & Run the Application

During application development, multiple environments are typically established — one or more for testing and development, and another for production. The “production” environment refers to the configuration in which the final end user interacts with the application.
Also, the production build of the application includes optimizations and security steps which make sure that the application runs smoothly. The development-build on the other hand, is less performant but offers advantages such as easier debugging.

Distinct workflows are defined for each stage — development and production — to build and run the application:

#### Development

For development, the application runs in your local environment. Also, the build step of the application is skipped, as it automatically re-builds every time a change in the code space is recognized.

Both the frontend and backend have to be running if you want to test your application in a whole. Execute the following commands to start both:

- `task run-frontend-dev` to start the frontend
- `task run-backend-dev` to start the backend

Execute the commands in separate terminals since the daemons are not attached by default.
(Opening a new terminal in VS Code or Github Codespaces is possible by pressing `Cmd + Shift + P` and then selecting "Terminal: Create new Terminal")

After the application is running, the UI can be viewed via the browser by visiting `http://localhost:80` and the backend can be reached via `http://localhost:8000`.
  
#### Production

For production, the application-image will be running within a Docker container on the machine of your choice.

##### Docker Images and Container

A Docker image is like a recipe or blueprint. It contains everything needed to run an application: the code, libraries, environment variables, and configuration files. However, the image itself is just a static file. It doesn’t run or do anything on its own.

A Docker container, on the other hand, is what you get when you “bake” the image into a running instance. Think of the image as a recipe for a cake, and the container as the actual cake you bake. You can use the same recipe (image) to bake many cakes (containers), and each one can run independently. Containers are the live, running environments where your application is executed, and they can have temporary storage and runtime state.

#### Using Docker

##### Building Images

To build the Docker image, execute the following command:

```bash
docker build -t url-shortener .
```

This command utilizes the `./Dockerfile` to create an image and tag it (`-t`) with the name "url-shortener".

##### Run Container

That image can then be used to start a docker container using the command

```bash
docker run -d -p 8080:8080 -p 8000:8000 --name url-shortener url-shortener
```

Below is a brief explanation of each part of the command.

- `-d`: Runs the container in detached mode, meaning that the terminal remains available
- `-p <some-port>:<some-(different-)port>`: Maps a specific port on your host machine to a different port inside the Docker container, allowing you to access the containerized service from outside the container. Essentially, any traffic sent to the host’s `<host-port>` will be forwarded to the container’s `<container-port>`.
- `--name url-shortener`: Applies the name "url-shortener" to the container. That allows us to easily reference the container later on when we want to apply actions to it, like stopping the container or viewing its logs.

##### Stop Container

To stop a container, execute the following command:

```bash
docker stop <container-name>
```

The container-name references to the name we previously assigned when starting a docker container.
Keep in mind that only ONE container with the same name can exist at the same time. To re-start your application, you first have to stop AND delete the container.

##### Delete Container

To delete a container, execute the following command:

```bash
docker rm <container-name>
```

##### Restart stopped Container

If you might want to restart a previously stopped container, you can do that by executing command:

```bash
docker start <container-name>
```

##### Get information about Container

There are multiple ways to get information about running container.
You can access logs of a container by executing command

```bash
docker logs <container-name>
```

You can also attach to the command line of a running container by executing command

```bash
docker exec -it <container-name> sh
```

Here, `sh` defines the kind of terminal you want to use. In that case "shell".

To depict the overall stats of all running containers, regarding usage of memory and cpu computing power, execute command

```bash
docker stats -a
```

### Testing the Backend

The following Taskfile tasks have been designed to test the endpoints for shortening URLs and retrieving the corresponding long version of a previously shortened URL:
    - `task execute-shorten-local`: Shortens an URL. To shortened you presonal URL, update the corresponding task within file `Request.yml` by replacing the string `<your-long-url>` with your URL.
    - `task execute-get-long-url-local`: Change the task within file `Request.yml` to use a previously shortened URL. For that, simply replace the string `<shortened-url>` with the shortened code.

### Github Codespace

A working environment for Github Codespaces is defined within `./.devcontainer`. It includes all listed requirements in section [Requirements](#requirements)

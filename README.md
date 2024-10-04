# MovieMax API

## Project Overview

The **MovieMax** project is a web application that provides users with access to information about various movies, directors, and genres. Users can sign up, update their personal information, and create a list of their favorite movies. This is the backend server-side component of the MovieMax application, built using the MERN stack (MongoDB, Express, React, and Node.js).

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [User Stories](#user-stories)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Return all movies**: Allows users to retrieve a list of all movies.
- **Get movie details by title**: Allows users to view details (description, genre, director) about a specific movie.
- **Get genre details**: Allows users to view information about a genre by name (e.g., "Thriller").
- **Get director details**: Allows users to view information about a director (bio, birth year, death year).
- **User Registration**: Allows new users to register with a username, password, email, and date of birth.
- **User Login**: Allows users to log in with their username and password.
- **Update User Info**: Allows users to update their personal information (username, password, email, date of birth).
- **Favorite Movies**: Allows users to add or remove movies from their list of favorite movies.
- **Deregister User**: Allows users to delete their account.
- **Get cast details**: Allows users to see which actors star in which movies.

## User Stories

- **As a user**, I want to receive information on movies, directors, and genres so that I can learn more about movies I’ve watched or am interested in.
- **As a user**, I want to be able to create a profile so I can save data about my favorite movies.

## Setup and Installation

Follow these steps to get the MovieMax API up and running on your local machine:

1. **Clone the repository:**

    ```sh
    git clone https://github.com/jdeebs/moviemax.git
    ```

2. **Navigate to the project directory:**

    ```sh
    cd moviemax
    ```

3. **Install dependencies:**

    ```sh
    npm install
    ```

4. **Set up your MongoDB connection:**

    Update the `CONNECTION_URI` in your environment variables or `config` file to point to your MongoDB database.

5. **Run the server:**

    ```sh
    npm start
    ```

## Usage

1. Use an API client like Postman to interact with the various API endpoints.
2. Perform CRUD operations like retrieving movies, registering users, and managing favorite movies.
3. Authenticate with your username and password to access secure endpoints via JWT tokens.

    **Note:** New users must register an account to be issued a token for endpoint access. Information for the registration endpoint can be found in the [documentation](https://movie-max-f53b34b56a95.herokuapp.com/documentation.html).

## Deployment

The MovieMax API is deployed on Heroku and can be accessed [here](https://movie-max-f53b34b56a95.herokuapp.com/). Documentation can be found [here](https://movie-max-f53b34b56a95.herokuapp.com/documentation.html).

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes. Ensure that the code is well-documented and follows the existing style.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

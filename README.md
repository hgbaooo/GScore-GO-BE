# GScores - Backend

This repository contains the backend code for **G-Scores**, an online platform that allows students, parents, and teachers to quickly and accurately check National High School Exam scores for 2024. Additionally, the system provides detailed statistical reports on score distribution.

## Features

- **Score Lookup by Registration Number**
- **Score Classification into 4 Levels**
- **Rank the top 10 highest-scoring students in Group A**

## Technologies

- **Backend:** Node.js, NestJS
- **Database:** MongoDB, Mongoose
- **API Documentation:** Swagger
- **Code Formatting:** ESLint, Prettier
- **Version Control:** Git
- **Containerization:** Docker
- **Deployment:** Render

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/hgbaooo/GScore-GO-BE
   cd GScore-GO-BE
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Copy the `.env.example` file to `.env` and update the values as needed.

   ```bash
   cp .env.example .env
   ```

4. Start the server:

   ```bash
   npm start
   ```

## Environment Variables

```bash
# The port number on which your application will run
PORT=3100

# The connection string for your MongoDB database
# Replace <username> with your MongoDB username
# Replace <password> with your MongoDB password
# Replace <cluster-url> with your MongoDB cluster URL
# Replace <app-name> with your application name
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority&appName=<app-name>

```

## API Documentation

The API documentation can be accessed at `/api`. You can view the list of available APIs and their specifications by running the server and visiting `http://localhost:3100/api` in your browser.


## Docker

If you want to run the application using Docker, you can use the following commands:

```bash
# Run the Docker container
npm run docker:start
# Stop the Docker container in production mode
npm run docker:stop
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

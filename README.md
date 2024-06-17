## Node.js Food Delivery Backend Application

Welcome to the repository housing the backend code for a dynamic food delivery application built with Node.js. Our backend orchestrates critical functions such as user authentication, order management, menu customization, wallet integration, and seamless interactions with a MySQL database. This application incorporates cutting-edge technologies including Cloudinary for image storage, Nodemailer for email notifications, IPInfo for location tracking, Redis for caching, and Winston for logging.

### Key Features

- **User Authentication**: Facilitates user registration, login, and JWT token-based authentication.
- **Image Storage**: Utilizes Cloudinary for robust image storage and management capabilities.
- **Email Notifications**: Nodemailer sends timely notifications such as order confirmations and password resets, with EJS for mail templating.
- **Logging**: Winston ensures comprehensive event and error logging capabilities.
- **Database Interaction**: Utilizes MySQL for robust data storage, including user profiles, orders, and transactions.
- **RESTful API**: Offers a RESTful API for seamless client-server communication and integration.
- **Error Handling**: Implements robust error handling mechanisms for graceful degradation and informative feedback.
- **Middleware Integration**: Integrates middleware for streamlined request processing, logging, and validation.
- **Scalability**: Designed with scalability in mind to accommodate growing user bases and increased traffic.
- **Security**: Adheres to best practices to mitigate common vulnerabilities like SQL injection and XSS attacks.

### Technologies Utilized

- **Node.js**: Powerful JavaScript runtime for building scalable server-side applications.
- **Express.js**: Web application framework for Node.js, powering our RESTful API.
- **MySQL**: Reliable relational database for persistent data storage.
- **JWT (JSON Web Tokens)**: Facilitates secure user authentication and authorization.
- **Cloudinary**: Cloud-based platform for image storage and management.
- **Nodemailer**: Module for sending emails from Node.js applications.
- **EJS** Templating engine for rendering email templates.
- **Winston**: Logging library ensuring comprehensive event and error logging capabilities.
- **Sequelize**: ORM for MySQL, simplifying data modeling and interaction.

### Getting Started

To run the application locally, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/bakare-dev/lusc_voting_api.git
    ```

2. Navigate to the project directory:

    ```bash
    cd food_delivery
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Configure environment variables:

    Create a `.env` file in the root directory. Below are the required evnironment variables.

    - **PORT**: The port number on which the server will run.
    - **DEV_DB**: The name of the development database.
    - **DEV_USER**: The username for the development database.
    - **DEV_PASSWORD**: The password for the development database.
    - **DEV_HOST**: The host address of the development database.
    - **WINSTONSOURCETOKEN**: Token for Winston logging source.
    - **WINSTONSOURCEID**: ID for Winston logging source.
    - **SMTP_HOST**: SMTP host for Nodemailer.
    - **SMTP_PORT**: SMTP port for Nodemailer.
    - **SMTP_USN**: Username for SMTP server.
    - **SMTP_PASSWORD**: Password for SMTP server.
    - **JWT_SECRET**: Secret key for JWT authentication.
    - **CLOUDINARY_API_KEY**: API key for Cloudinary.
    - **CLOUDINARY_API_SECRET**: API secret for Cloudinary.
    - **CLOUDINARY_API_NAME**: API name for Cloudinary.
    - **CLOUDINARY_API_UPLOAD**: Upload preset for Cloudinary.
    - **CLOUDINARY_URL**: URL for Cloudinary.
    - **CLOUDINARY_CLOUD_NAME**: Cloud name for Cloudinary.

5. Go to config/main.settings.js and update client url value

6. Go to utils/Authentication.js and update election expirationdate

### First Run Instructions

Upon the first run of the application, follow these steps:

1. Navigate to `main.js` in your project directory.

2. Uncomment the following code block:
    ```javascript
        const db = new DatabaseEngine();

        db.connect( async () => {
            let serverEngine = new Server(server.port);
            serverEngine.start();
        });
    ```
3. Comment out the following code block:
    ```javascript
        let serverEngine = new Server(server.port);
        serverEngine.start();
    ```

4. Run `npm start` to initiate the migration process. Once the migration is complete, the server will start automatically.

5. After the migration process is done and the server is shut down, revert the changes in `main.js`:
    - Comment out the first code block.
    - Uncomment the second code block.

6. Run `npm start` to start the server.

This sequence ensures that the database migration is performed on the initial run and then switches back to the regular server initialization for subsequent runs.

### Contributing

Contributions are welcome! If you encounter issues or have suggestions for improvement, please open an issue or create a pull request.

### Acknowledgements

Special thanks to the developers of Node.js, Express.js, MySQL, Paystack, Cloudinary, Nodemailer, EJS, IPInfo, Redis, Winston, and other open-source technologies powering this project. Your contributions drive innovation and excellence in the development community.
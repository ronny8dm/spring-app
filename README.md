# Chatter

Chatter is a Client/Server chat application built with Spring Boot. It facilitates the exchange of text messages in real-time using WebSockets. The application utilizes HTTP and TCP protocols and is designed as a web-based application.

## Technologies Used

- **Spring Boot**: The backbone of the application, providing a framework to build stand-alone, production-grade Spring-based applications.
- **Spring Web**: Facilitates building web applications, setting up HTTP endpoints using Spring MVC and Tomcat as the default embedded server.
- **Spring Websocket**: Provides WebSocket functionality for real-time messaging.
- **Thymeleaf** (Optional): A templating engine for server-side rendering of HTML views.
- **Spring Security** (Optional): Provides authentication and authorization support, helping in securing the application.
- **Spring Data JPA**: Facilitates data access within the JPA-based repositories.
- **MySQL**: Used as the primary database.
- **Java 17**: The latest stable release of Java, providing various new features and performance improvements.
- **IntelliJ IDEA**: The chosen IDE for developing this project.

## Getting Started

### Prerequisites

- Java 17
- Maven
- Docker (For MySQL containerization)

### Setting up Development Environment

1. **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/chatter.git
    cd chatter
    ```

2. **Set up MySQL Docker container** (Optional):
    - Follow the instructions in the [MySQL Docker setup guide](./mysql-docker-setup.md).

3. **Build and Run**:
    ```bash
    mvn clean install
    mvn spring-boot:run
    ```

4. Open your browser and navigate to `http://localhost:8080`.

## Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

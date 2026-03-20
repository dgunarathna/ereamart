# Ereamart

A modern e-commerce platform built with Spring Boot, providing comprehensive management for customers, suppliers, inventory, orders, and more.

## Features

- **Customer Management**: User registration, profiles, and order history
- **Supplier Management**: Vendor onboarding and product catalog management
- **Inventory Control**: Real-time stock tracking and low-stock alerts
- **Order Processing**: Complete order lifecycle from quotation to delivery
- **Employee Management**: Staff role-based access and privilege management
- **Financial Reports**: Income, expense tracking, and comprehensive reporting
- **Dashboard Analytics**: Visual charts and business insights

## Technology Stack

- **Backend**: Java 17+, Spring Boot 3.x
- **Frontend**: Thymeleaf templates, Bootstrap 5.2.3, jQuery
- **Database**: Configurable (default: H2 for development)
- **Build Tool**: Gradle
- **UI Components**: DataTables, Chart.js, Font Awesome 6.6.0

## Prerequisites

- Java 17 or higher
- Gradle 7.x or higher (or use included wrapper)

## Getting Started

### Clone the Repository
```bash
git clone <repository-url>
cd ereamart
```

### Build the Project
```bash
./gradlew build
```

### Run the Application
```bash
./gradlew bootRun
```

The application will start on `http://localhost:8080`

### Run Tests
```bash
./gradlew test
```

## Project Structure

```
src/
├── main/
│   ├── java/com/ereamart/          # Java source code
│   └── resources/
│       ├── static/                 # CSS, JS, images, fonts
│       │   ├── bootstrap-5.2.3/    # Bootstrap framework
│       │   ├── css/                # Custom stylesheets
│       │   ├── datatables/         # DataTables library
│       │   ├── fontawesome-free-6.6.0/  # Font Awesome icons
│       │   ├── jquery/             # jQuery library
│       │   └── script/             # Custom JavaScript
│       ├── templates/              # Thymeleaf HTML templates
│       └── application.properties  # Application configuration
└── test/
    └── java/com/ereamart/          # Test classes
```

## Configuration

Edit `src/main/resources/application.properties` to configure:
- Database connection
- Server port
- Security settings
- Email configuration

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@ereamart.com or create an issue in this repository.
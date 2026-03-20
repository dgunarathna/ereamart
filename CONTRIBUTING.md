# Contributing to Ereamart

Thank you for your interest in contributing to Ereamart! We welcome contributions from the community. Please read this document to understand how to contribute effectively.

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to conduct@ereamart.com.

## How to Contribute

### Reporting Bugs

- Use the bug report template when creating issues
- Include detailed steps to reproduce the issue
- Provide environment details (OS, Java version, etc.)
- Include screenshots if applicable

### Suggesting Features

- Use the feature request template
- Clearly describe the feature and its benefits
- Consider if the feature aligns with the project's goals

### Contributing Code

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`./gradlew test`)
5. Ensure code follows the style guidelines
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## Development Setup

### Prerequisites
- Java 17+
- Gradle 7+

### Local Development
```bash
git clone https://github.com/your-username/ereamart.git
cd ereamart
./gradlew build
./gradlew bootRun
```

## Code Style Guidelines

### Java Code
- Follow standard Java naming conventions
- Use meaningful variable and method names
- Add JavaDoc comments for public methods
- Keep methods small and focused
- Use dependency injection appropriately

### Frontend Code
- Use consistent indentation (4 spaces)
- Follow BEM methodology for CSS classes
- Minify JavaScript and CSS for production
- Ensure responsive design principles

### Commit Messages
- Use clear, descriptive commit messages
- Start with a verb (Add, Fix, Update, Remove)
- Keep the first line under 50 characters
- Reference issue numbers when applicable

## Testing

- Write unit tests for new features
- Ensure all tests pass before submitting PR
- Test on multiple browsers for frontend changes
- Include integration tests for API endpoints

## Pull Request Process

1. Update the README.md if needed
2. Update documentation for any new features
3. Ensure CI/CD checks pass
4. Request review from maintainers
5. Address review feedback
6. Merge after approval

## Project Structure

- `src/main/java/com/ereamart/` - Main application code
- `src/main/resources/templates/` - Thymeleaf templates
- `src/main/resources/static/` - Static assets (CSS, JS, images)
- `src/test/java/com/ereamart/` - Test classes

## Build Configuration

The project uses Gradle. Key configuration is in:
- `build.gradle` - Dependencies and build settings
- `settings.gradle` - Project settings
- `application.properties` - Runtime configuration

## Questions?

If you have questions about contributing, please create an issue or contact the maintainers.
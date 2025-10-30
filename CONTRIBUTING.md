# Contributing to Spec-Kit Azure DevOps Integration

Thank you for your interest in contributing to this project! This document provides guidelines for contributing to the extension.

## Development Setup

1. **Prerequisites**
   - Node.js 18.x or higher
   - Visual Studio Code 1.80.0 or higher
   - Git

2. **Clone and Install**
   ```bash
   git clone https://github.com/dragoshont/spec-kit.ado.git
   cd spec-kit.ado
   npm install
   ```

3. **Build**
   ```bash
   npm run compile
   ```

4. **Run Linting**
   ```bash
   npm run lint
   ```

## Project Structure

```
spec-kit.ado/
├── src/
│   ├── extension.ts           # Main extension entry point
│   ├── specKitTaskParser.ts   # Parses spec-kit Markdown tasks
│   ├── azureDevOpsClient.ts   # Azure DevOps API wrapper
│   └── taskSynchronizer.ts    # Synchronization logic
├── out/                        # Compiled JavaScript output
├── package.json               # Extension manifest
├── tsconfig.json              # TypeScript configuration
└── README.md                  # User documentation
```

## Development Workflow

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write clean, well-documented code
   - Follow existing code style and conventions
   - Add comments for complex logic

3. **Test Your Changes**
   - Compile: `npm run compile`
   - Lint: `npm run lint`
   - Manual testing in VSCode Extension Development Host (F5)

4. **Commit Changes**
   - Use clear, descriptive commit messages
   - Reference issues if applicable

5. **Submit Pull Request**
   - Provide a clear description of changes
   - Include any relevant issue numbers
   - Ensure all checks pass

## Code Style Guidelines

- Use TypeScript for all source files
- Follow the existing ESLint configuration
- Use camelCase for variable and function names
- Use PascalCase for class names
- Add JSDoc comments for public methods
- Keep functions focused and single-purpose
- Handle errors gracefully with user-friendly messages

## Security Considerations

- Never commit sensitive credentials
- Sanitize all user inputs
- Use parameterized queries when possible
- Validate configuration values
- Handle API errors appropriately

## Testing

Currently, the project uses manual testing. When adding new features:

1. Test with various task file formats
2. Test error conditions (missing config, invalid credentials)
3. Test edge cases (empty files, malformed tasks)
4. Test the full sync workflow with Azure DevOps

## Adding New Features

When proposing new features:

1. Open an issue first to discuss the feature
2. Ensure it aligns with the project's goals
3. Consider backward compatibility
4. Update documentation accordingly

## Bug Reports

When reporting bugs:

1. Use the GitHub issue tracker
2. Provide a clear description
3. Include steps to reproduce
4. Share relevant error messages
5. Specify your environment (VSCode version, OS, etc.)

## Questions?

Feel free to open an issue for questions or discussions about contributing.

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

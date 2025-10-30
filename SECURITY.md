# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Security Measures

This extension implements several security measures to protect user data and prevent vulnerabilities:

### 1. Input Sanitization

**WIQL Injection Prevention**
- All user inputs used in WIQL (Work Item Query Language) queries are sanitized
- The `sanitizeWiqlValue()` method removes or escapes potentially dangerous characters:
  - Single quotes are doubled (SQL standard escaping)
  - Brackets are removed
  - Semicolons are removed
  - SQL comment markers (-- and /* */) are removed
- Additional validation ensures inputs are of the expected type

### 2. Secure Credential Storage

**Personal Access Token Handling**
- PATs are stored in VSCode settings
- Users are advised to use environment-specific PATs with minimal required permissions
- Tokens are only transmitted over HTTPS to Azure DevOps APIs
- No tokens are logged or stored in plain text files

**Recommended PAT Permissions**
- Work Items: Read & Write (minimum required)
- Avoid granting unnecessary permissions

### 3. API Security

**Azure DevOps Communication**
- All communication uses the official Azure DevOps Node.js API
- HTTPS is enforced for all API calls
- Authentication uses Personal Access Token (PAT) method
- No credentials are exposed in error messages

### 4. Code Security Practices

**Static Analysis**
- Code is regularly scanned with CodeQL
- ESLint is configured to catch potential issues
- TypeScript strict mode is enabled for type safety

**Dependency Management**
- Dependencies are regularly updated
- Known vulnerabilities are checked using npm audit
- Only trusted, well-maintained packages are used

### 5. Error Handling

**Information Disclosure Prevention**
- Error messages shown to users are sanitized
- Stack traces and internal details are not exposed
- Failed operations provide helpful but secure feedback

## Reporting a Vulnerability

If you discover a security vulnerability, please follow these steps:

1. **Do Not** disclose the vulnerability publicly
2. Email the maintainer with details:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)
3. Allow reasonable time for a fix to be developed and released
4. We will acknowledge receipt within 48 hours
5. We aim to provide a fix within 30 days for critical issues

## Security Best Practices for Users

### Configuration Security

1. **Protect Your PAT**
   - Store PAT securely in VSCode settings
   - Use workspace settings for project-specific configurations
   - Never commit PATs to version control
   - Rotate PATs regularly

2. **Minimal Permissions**
   - Grant only "Work Items: Read & Write" permissions
   - Use separate PATs for different projects
   - Set appropriate expiration dates

3. **Network Security**
   - Ensure your Azure DevOps organization URL is correct
   - Use corporate VPN if required by your organization
   - Verify SSL/TLS certificates

### Operational Security

1. **Task File Security**
   - Review task files before syncing
   - Avoid including sensitive information in task descriptions
   - Use .gitignore to exclude sensitive spec-kit files if needed

2. **Audit Trail**
   - All work item changes are tracked in Azure DevOps
   - Review sync results after each operation
   - Monitor Azure DevOps audit logs regularly

## Security Update Policy

- Security patches are released as soon as possible
- Critical vulnerabilities receive immediate attention
- Users are notified of security updates via GitHub releases
- Detailed security advisories are published for significant issues

## Compliance

This extension:
- Does not collect or transmit telemetry data
- Does not store credentials outside of VSCode settings
- Respects user privacy
- Follows VSCode extension security guidelines
- Uses official Microsoft APIs for Azure DevOps integration

## Third-Party Dependencies

Key dependencies and their security:

- **azure-devops-node-api**: Official Microsoft package for Azure DevOps integration
- **@types/vscode**: Type definitions for VSCode API
- **typescript**: Microsoft's TypeScript compiler
- **eslint**: Industry-standard linting tool

All dependencies are regularly updated and monitored for security vulnerabilities.

## Security Scanning Results

**Latest Scan: 2025-10-30**
- CodeQL Analysis: ✅ No vulnerabilities found
- Dependency Audit: ✅ No known vulnerabilities
- Manual Review: ✅ Security best practices followed

## Contact

For security-related questions or concerns:
- Open a private security advisory on GitHub
- Contact the repository maintainer directly

---

Last Updated: 2025-10-30

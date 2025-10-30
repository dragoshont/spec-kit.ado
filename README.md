# Spec-Kit Azure DevOps Integration

A VSCode extension that integrates [spec-kit](https://github.com/github/spec-kit) with Azure DevOps to keep your generated tasks synchronized with your sprint backlog. This extension enables a collaborative approach to specification-driven development by automatically syncing spec-kit generated tasks to Azure DevOps work items.

## Features

- 🔄 **Automatic Sync**: Synchronize spec-kit generated tasks with Azure DevOps backlog
- 📋 **Task Management**: Create and update Azure DevOps work items from spec-kit tasks
- 🏷️ **Smart Tagging**: Automatically tag work items for easy identification and tracking
- 📊 **User Story Mapping**: Maintain links between tasks and their user stories
- ⚡ **Status Sync**: Keep task completion status in sync between spec-kit and Azure DevOps

## Prerequisites

- Visual Studio Code 1.80.0 or higher
- Node.js 18.x or higher
- An Azure DevOps account with a project
- [spec-kit](https://github.com/github/spec-kit) installed and configured in your project

## Installation

### From Source

1. Clone this repository:
   ```bash
   git clone https://github.com/dragoshont/spec-kit.ado.git
   cd spec-kit.ado
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Compile the extension:
   ```bash
   npm run compile
   ```

4. Open the project in VSCode and press F5 to launch the extension in a new Extension Development Host window.

## Configuration

Before using the extension, you need to configure your Azure DevOps settings:

1. Open VSCode Settings (File > Preferences > Settings or `Ctrl+,`)
2. Search for "Spec-Kit ADO"
3. Configure the following settings:

   - **Organization URL**: Your Azure DevOps organization URL (e.g., `https://dev.azure.com/yourorg`)
   - **Project**: Your Azure DevOps project name
   - **Personal Access Token**: Your Azure DevOps PAT with Work Items (Read & Write) permissions
   - **Task File Path**: Path to your spec-kit tasks file (default: `.speckit/tasks.md`)

### Creating an Azure DevOps Personal Access Token

1. Sign in to your Azure DevOps organization
2. Go to User Settings > Personal Access Tokens
3. Click "New Token"
4. Give it a name (e.g., "Spec-Kit VSCode Extension")
5. Select the organization and set expiration
6. Under "Scopes", select "Work Items" with "Read & Write" permissions
7. Click "Create" and copy the token (you won't be able to see it again)
8. Paste the token in the VSCode settings

## Usage

### Setting up Spec-Kit Tasks

Your spec-kit tasks file should be in Markdown format with the following structure:

```markdown
## User Story: Implement user authentication

- [ ] Create user database schema
  Set up the database tables for users, roles, and permissions
  
- [ ] Implement login API endpoint
  Create POST /api/auth/login endpoint with JWT token generation
  
- [x] Design login UI component
  Create a responsive login form with email and password fields

## User Story: Add dashboard functionality

- [ ] Create dashboard layout
  Implement the main dashboard container with navigation

- [ ] Add data visualization widgets
  Integrate charts for displaying user analytics
```

### Syncing Tasks

1. Open your project in VSCode
2. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac)
3. Type and select: **"Spec-Kit ADO: Sync Tasks with Azure DevOps"**
4. The extension will:
   - Read your spec-kit tasks from the configured file
   - Connect to Azure DevOps
   - Create new work items for tasks that don't exist
   - Update existing work items if the task details have changed
5. A notification will show the sync results

### Task Tracking

- Each task synced from spec-kit is tagged with `spec-kit` and a unique task ID (e.g., `speckit-task-1`)
- Tasks are also tagged with their user story (e.g., `story:Implement user authentication`)
- Completed tasks (marked with `[x]` in spec-kit) are automatically set to "Done" state in Azure DevOps
- Pending tasks (marked with `[ ]`) are set to "To Do" state

## Development

### Building

```bash
npm run compile
```

### Watching for Changes

```bash
npm run watch
```

### Linting

```bash
npm run lint
```

### Running Tests

```bash
npm run test
```

## How It Works

1. **Task Parsing**: The extension parses your spec-kit tasks file (Markdown format) to extract tasks, their descriptions, user stories, and status
2. **Azure DevOps Connection**: Establishes a connection to Azure DevOps using your Personal Access Token
3. **Synchronization**: 
   - Queries existing work items tagged with `spec-kit`
   - Matches spec-kit tasks with existing work items using unique task IDs
   - Creates new work items for tasks that don't exist
   - Updates work items if task details have changed
4. **Status Updates**: Syncs task completion status between spec-kit and Azure DevOps

## Architecture

```
src/
├── extension.ts           # Main extension activation and command registration
├── specKitTaskParser.ts   # Parses spec-kit task files
├── azureDevOpsClient.ts   # Azure DevOps API client wrapper
└── taskSynchronizer.ts    # Synchronization logic
```

## Troubleshooting

### "Task file not found" error
- Verify the task file path in settings matches your spec-kit tasks file location
- Make sure you have a workspace folder open in VSCode

### "Failed to connect to Azure DevOps" error
- Check that your Organization URL is correct (should start with `https://dev.azure.com/`)
- Verify your Personal Access Token is valid and has Work Items permissions
- Ensure your project name is spelled correctly

### Tasks not syncing
- Check that your tasks file follows the expected Markdown format
- Verify the Azure DevOps project has the "Task" work item type available
- Check the Output panel (View > Output > Spec-Kit ADO) for detailed error messages

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

See [LICENSE](LICENSE) file for details.

## Related Projects

- [spec-kit](https://github.com/github/spec-kit) - GitHub's specification-driven development toolkit
- [Azure DevOps Node API](https://github.com/microsoft/azure-devops-node-api) - Node.js client library for Azure DevOps

## Acknowledgments

This project aims to bridge the gap between specification-driven development using spec-kit and project management in Azure DevOps, enabling teams to maintain a single source of truth for their development tasks.

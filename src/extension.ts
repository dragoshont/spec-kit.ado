import * as vscode from 'vscode';
import { AzureDevOpsClient } from './azureDevOpsClient';
import { SpecKitTaskParser } from './specKitTaskParser';
import { TaskSynchronizer } from './taskSynchronizer';

export function activate(context: vscode.ExtensionContext) {
    console.log('Spec-Kit ADO extension is now active');

    const syncCommand = vscode.commands.registerCommand('speckit.ado.sync', async () => {
        try {
            // Get configuration
            const config = vscode.workspace.getConfiguration('speckit.ado');
            const organizationUrl = config.get<string>('organizationUrl');
            const project = config.get<string>('project');
            const personalAccessToken = config.get<string>('personalAccessToken');
            const taskFilePath = config.get<string>('taskFilePath') || '.speckit/tasks.md';

            // Validate configuration
            if (!organizationUrl || !project || !personalAccessToken) {
                vscode.window.showErrorMessage(
                    'Spec-Kit ADO: Please configure Azure DevOps settings (Organization URL, Project, and Personal Access Token) in settings.'
                );
                return;
            }

            // Get workspace folder
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
            if (!workspaceFolder) {
                vscode.window.showErrorMessage('Spec-Kit ADO: No workspace folder open');
                return;
            }

            // Show progress
            await vscode.window.withProgress(
                {
                    location: vscode.ProgressLocation.Notification,
                    title: 'Syncing Spec-Kit tasks with Azure DevOps',
                    cancellable: false
                },
                async (progress) => {
                    try {
                        progress.report({ message: 'Reading spec-kit tasks...' });

                        // Parse spec-kit tasks
                        const parser = new SpecKitTaskParser();
                        const tasks = await parser.parseTasks(workspaceFolder.uri.fsPath, taskFilePath);

                        if (tasks.length === 0) {
                            vscode.window.showWarningMessage(
                                `Spec-Kit ADO: No tasks found in ${taskFilePath}`
                            );
                            return;
                        }

                        progress.report({ message: 'Connecting to Azure DevOps...' });

                        // Create Azure DevOps client
                        const adoClient = new AzureDevOpsClient(
                            organizationUrl,
                            personalAccessToken,
                            project
                        );

                        progress.report({ message: 'Synchronizing tasks...' });

                        // Synchronize tasks
                        const synchronizer = new TaskSynchronizer(adoClient);
                        const result = await synchronizer.syncTasks(tasks);

                        vscode.window.showInformationMessage(
                            `Spec-Kit ADO: Successfully synced ${result.created} new task(s), updated ${result.updated} existing task(s)`
                        );
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : String(error);
                        vscode.window.showErrorMessage(
                            `Spec-Kit ADO: Failed to sync tasks - ${errorMessage}`
                        );
                    }
                }
            );
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            vscode.window.showErrorMessage(
                `Spec-Kit ADO: Unexpected error - ${errorMessage}`
            );
        }
    });

    context.subscriptions.push(syncCommand);
}

export function deactivate() {
    // Cleanup if needed
}

import { AzureDevOpsClient } from './azureDevOpsClient';
import { SpecKitTask } from './specKitTaskParser';

export interface SyncResult {
    created: number;
    updated: number;
    errors: string[];
}

export class TaskSynchronizer {
    private adoClient: AzureDevOpsClient;
    private readonly speckitTag = 'spec-kit';

    constructor(adoClient: AzureDevOpsClient) {
        this.adoClient = adoClient;
    }

    /**
     * Synchronize spec-kit tasks with Azure DevOps work items
     */
    async syncTasks(tasks: SpecKitTask[]): Promise<SyncResult> {
        const result: SyncResult = {
            created: 0,
            updated: 0,
            errors: []
        };

        // Get existing work items with spec-kit tag
        const existingWorkItems = await this.adoClient.queryWorkItemsByTag(this.speckitTag);
        const existingWorkItemsMap = new Map<string, typeof existingWorkItems[0]>(
            existingWorkItems.map(wi => {
                const tags = wi.fields?.['System.Tags'] || '';
                const taskIdMatch = tags.match(/speckit-task-(\d+)/);
                if (taskIdMatch) {
                    return [taskIdMatch[0], wi];
                }
                return [null, wi];
            }).filter(([key]) => key !== null) as Array<[string, typeof existingWorkItems[0]]>
        );

        // Process each task
        for (const task of tasks) {
            try {
                const existingWorkItem = existingWorkItemsMap.get(task.id);

                const tags = [this.speckitTag, task.id];
                if (task.userStory) {
                    tags.push(`story:${task.userStory}`);
                }

                if (existingWorkItem) {
                    // Update existing work item
                    const workItemId = existingWorkItem.id!;
                    const currentTitle = existingWorkItem.fields?.['System.Title'] || '';
                    const currentDescription = existingWorkItem.fields?.['System.Description'] || '';

                    // Only update if there are changes
                    if (currentTitle !== task.title || currentDescription !== task.description) {
                        await this.adoClient.updateWorkItem({
                            id: workItemId,
                            title: task.title,
                            description: task.description,
                            tags: tags,
                            state: this.mapTaskStatusToAdoState(task.status)
                        });
                        result.updated++;
                    }
                } else {
                    // Create new work item
                    await this.adoClient.createWorkItem({
                        title: task.title,
                        description: this.formatTaskDescription(task),
                        tags: tags,
                        workItemType: 'Task'
                    });
                    result.created++;
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                result.errors.push(`Failed to sync task "${task.title}": ${errorMessage}`);
            }
        }

        return result;
    }

    /**
     * Format task description for Azure DevOps
     */
    private formatTaskDescription(task: SpecKitTask): string {
        let description = task.description;

        if (task.userStory) {
            description = `**User Story:** ${task.userStory}\n\n${description}`;
        }

        if (task.dependencies && task.dependencies.length > 0) {
            description += `\n\n**Dependencies:** ${task.dependencies.join(', ')}`;
        }

        return description;
    }

    /**
     * Map spec-kit task status to Azure DevOps work item state
     */
    private mapTaskStatusToAdoState(status?: string): string | undefined {
        if (!status) {
            return undefined;
        }

        const statusMap: Record<string, string> = {
            pending: 'To Do',
            'in-progress': 'In Progress',
            completed: 'Done'
        };

        return statusMap[status];
    }
}

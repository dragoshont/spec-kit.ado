import * as azdev from 'azure-devops-node-api';
import { IWorkItemTrackingApi } from 'azure-devops-node-api/WorkItemTrackingApi';
import { WorkItem } from 'azure-devops-node-api/interfaces/WorkItemTrackingInterfaces';

export interface WorkItemCreateInfo {
    title: string;
    description: string;
    tags?: string[];
    workItemType?: string;
    state?: string;
}

export interface WorkItemUpdateInfo {
    id: number;
    title?: string;
    description?: string;
    state?: string;
    tags?: string[];
}

export class AzureDevOpsClient {
    private connection: azdev.WebApi;
    private projectName: string;

    constructor(
        organizationUrl: string,
        personalAccessToken: string,
        projectName: string
    ) {
        const authHandler = azdev.getPersonalAccessTokenHandler(personalAccessToken);
        this.connection = new azdev.WebApi(organizationUrl, authHandler);
        this.projectName = projectName;
    }

    async getWorkItemTrackingApi(): Promise<IWorkItemTrackingApi> {
        return await this.connection.getWorkItemTrackingApi();
    }

    /**
     * Create a new work item in Azure DevOps
     */
    async createWorkItem(workItemInfo: WorkItemCreateInfo): Promise<WorkItem> {
        const witApi = await this.getWorkItemTrackingApi();

        const workItemType = workItemInfo.workItemType || 'Task';

        const patchDocument = [
            {
                op: 'add',
                path: '/fields/System.Title',
                value: workItemInfo.title
            },
            {
                op: 'add',
                path: '/fields/System.Description',
                value: workItemInfo.description
            }
        ];

        // Add state if provided
        if (workItemInfo.state) {
            patchDocument.push({
                op: 'add',
                path: '/fields/System.State',
                value: workItemInfo.state
            });
        }

        // Add tags if provided
        if (workItemInfo.tags && workItemInfo.tags.length > 0) {
            patchDocument.push({
                op: 'add',
                path: '/fields/System.Tags',
                value: workItemInfo.tags.join('; ')
            });
        }

        const workItem = await witApi.createWorkItem(
            undefined,
            patchDocument,
            this.projectName,
            workItemType
        );

        if (!workItem) {
            throw new Error('Failed to create work item');
        }

        return workItem;
    }

    /**
     * Update an existing work item
     */
    async updateWorkItem(workItemInfo: WorkItemUpdateInfo): Promise<WorkItem> {
        const witApi = await this.getWorkItemTrackingApi();

        const patchDocument = [];

        if (workItemInfo.title) {
            patchDocument.push({
                op: 'replace',
                path: '/fields/System.Title',
                value: workItemInfo.title
            });
        }

        if (workItemInfo.description !== undefined) {
            patchDocument.push({
                op: 'replace',
                path: '/fields/System.Description',
                value: workItemInfo.description
            });
        }

        if (workItemInfo.state) {
            patchDocument.push({
                op: 'replace',
                path: '/fields/System.State',
                value: workItemInfo.state
            });
        }

        if (workItemInfo.tags) {
            patchDocument.push({
                op: 'replace',
                path: '/fields/System.Tags',
                value: workItemInfo.tags.join('; ')
            });
        }

        const workItem = await witApi.updateWorkItem(
            undefined,
            patchDocument,
            workItemInfo.id
        );

        if (!workItem) {
            throw new Error(`Failed to update work item ${workItemInfo.id}`);
        }

        return workItem;
    }

    /**
     * Query work items by tags
     */
    async queryWorkItemsByTag(tag: string): Promise<WorkItem[]> {
        const witApi = await this.getWorkItemTrackingApi();

        // Sanitize inputs to prevent WIQL injection
        const sanitizedProject = this.projectName.replace(/'/g, "''");
        const sanitizedTag = tag.replace(/'/g, "''");

        const wiql = {
            query: `SELECT [System.Id], [System.Title], [System.State], [System.Tags] 
                    FROM WorkItems 
                    WHERE [System.TeamProject] = '${sanitizedProject}' 
                    AND [System.Tags] CONTAINS '${sanitizedTag}' 
                    ORDER BY [System.CreatedDate] DESC`
        };

        const result = await witApi.queryByWiql(wiql, {
            project: this.projectName
        });

        if (!result.workItems || result.workItems.length === 0) {
            return [];
        }

        const workItemIds = result.workItems.map(wi => wi.id!);
        const workItems = await witApi.getWorkItems(
            workItemIds,
            undefined,
            undefined,
            undefined,
            undefined
        );

        return workItems;
    }

    /**
     * Get a work item by ID
     */
    async getWorkItem(id: number): Promise<WorkItem | null> {
        const witApi = await this.getWorkItemTrackingApi();
        try {
            const workItem = await witApi.getWorkItem(id);
            return workItem;
        } catch (error) {
            return null;
        }
    }
}

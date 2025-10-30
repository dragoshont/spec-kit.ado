import * as fs from 'fs';
import * as path from 'path';

export interface SpecKitTask {
    id: string;
    title: string;
    description: string;
    userStory?: string;
    dependencies?: string[];
    status?: 'pending' | 'in-progress' | 'completed';
}

export class SpecKitTaskParser {
    /**
     * Parse tasks from a spec-kit tasks file (Markdown format)
     * Expected format:
     * ## User Story: [Story Name]
     * - [ ] Task title
     *   Description of the task
     * - [x] Completed task
     */
    async parseTasks(workspacePath: string, taskFilePath: string): Promise<SpecKitTask[]> {
        const fullPath = path.join(workspacePath, taskFilePath);

        if (!fs.existsSync(fullPath)) {
            throw new Error(`Task file not found: ${taskFilePath}`);
        }

        const content = fs.readFileSync(fullPath, 'utf-8');
        return this.parseMarkdownTasks(content);
    }

    private parseMarkdownTasks(content: string): SpecKitTask[] {
        const tasks: SpecKitTask[] = [];
        const lines = content.split('\n');
        let currentUserStory = '';
        let currentTask: Partial<SpecKitTask> | null = null;
        let taskCounter = 1;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Check for user story headers
            const userStoryMatch = line.match(/^##\s+(?:User Story:?\s*)?(.+)$/i);
            if (userStoryMatch) {
                currentUserStory = userStoryMatch[1].trim();
                continue;
            }

            // Check for task items (checkbox format)
            const taskMatch = line.match(/^[\s-]*\[([x\s])\]\s+(.+)$/i);
            if (taskMatch) {
                // Save previous task if exists
                if (currentTask && currentTask.title) {
                    tasks.push(this.completeTask(currentTask, taskCounter++));
                }

                // Start new task
                const isCompleted = taskMatch[1].toLowerCase() === 'x';
                currentTask = {
                    title: taskMatch[2].trim(),
                    description: '',
                    userStory: currentUserStory || undefined,
                    status: isCompleted ? 'completed' : 'pending',
                    dependencies: []
                };
            } else if (currentTask && line.trim()) {
                // Add to description if we're building a task and line is not empty
                const trimmedLine = line.trim();
                if (trimmedLine && !trimmedLine.startsWith('#')) {
                    if (currentTask.description) {
                        currentTask.description += '\n' + trimmedLine;
                    } else {
                        currentTask.description = trimmedLine;
                    }
                }
            } else if (currentTask && !line.trim()) {
                // Empty line might signal end of task description
                // But we'll continue to see if there's more content
            }
        }

        // Don't forget the last task
        if (currentTask && currentTask.title) {
            tasks.push(this.completeTask(currentTask, taskCounter++));
        }

        return tasks;
    }

    private completeTask(partialTask: Partial<SpecKitTask>, counter: number): SpecKitTask {
        return {
            id: `speckit-task-${counter}`,
            title: partialTask.title || 'Untitled Task',
            description: partialTask.description || '',
            userStory: partialTask.userStory,
            dependencies: partialTask.dependencies || [],
            status: partialTask.status || 'pending'
        };
    }
}

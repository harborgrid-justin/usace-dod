
import { USACEProject } from '../types';
import { MOCK_USACE_PROJECTS } from '../constants';

class ProjectDataService {
    private projects: USACEProject[] = JSON.parse(JSON.stringify(MOCK_USACE_PROJECTS));
    private listeners = new Set<Function>();

    getProjects = () => this.projects;

    addProject = (project: USACEProject) => {
        this.projects = [project, ...this.projects];
        this.notify();
    };

    updateProject = (updated: USACEProject) => {
        this.projects = this.projects.map(p => p.id === updated.id ? updated : p);
        this.notify();
    };

    subscribe = (listener: Function) => {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    };

    private notify = () => this.listeners.forEach(l => l());
}

export const projectService = new ProjectDataService();

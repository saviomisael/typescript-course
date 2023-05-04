import { Project, ProjectStatus } from '../models/Project';

type Listener<T> = (items: T[]) => void;

class State<G> {
  protected listeners: Listener<G>[] = [];

  addListener(listenerFn: Listener<G>) {
    this.listeners.push(listenerFn);
  }
}

export class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.ACTIVE,
    );

    this.projects.push(newProject);

    this.updateListeners();
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find((x) => x.id === projectId);

    if (project && project.status !== newStatus) {
      project.status = newStatus;
    }

    this.updateListeners();
  }

  private updateListeners() {
    for (const listener of this.listeners) {
      listener([...this.projects]);
    }
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ProjectState();
    }

    return this.instance;
  }
}

export const projectState = ProjectState.getInstance();

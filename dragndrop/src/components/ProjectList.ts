import { Autobind } from '../decorators/Autobind.js';
import { Project, ProjectStatus } from '../models/Project.js';
import { DragTarget } from '../models/drag-n-drop.js';
import { projectState } from '../state/project-state.js';
import { Component } from './BaseComponent.js';
import { ProjectItem } from './ProjectItem.js';

export class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  private assignedProjects: Project[];

  constructor(private type: 'active' | 'finished') {
    super('project-list', 'app', false, `${type}-projects`);

    this.assignedProjects = [];

    this.configure();

    this.renderContent();
  }

  @Autobind
  dragOverHandler(event: DragEvent): void {
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      event.preventDefault(); // Needs this to allow drop
      const listEL = this.element.querySelector('ul')!;
      listEL.classList.add('droppable');
    }
  }

  @Autobind
  dropHandler(event: DragEvent): void {
    const projectId = event.dataTransfer!.getData('text/plain');
    projectState.moveProject(
      projectId,
      this.type === 'active' ? ProjectStatus.ACTIVE : ProjectStatus.FINISHED,
    );
  }

  @Autobind
  dragLeaveHandler(event: DragEvent): void {
    const listEL = this.element.querySelector('ul')!;
    listEL.classList.remove('droppable');
  }

  configure(): void {
    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('drop', this.dropHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);

    projectState.addListener((projects) => {
      if (this.type === 'active') {
        this.assignedProjects = projects.filter(
          (x) => x.status === ProjectStatus.ACTIVE,
        );
      } else {
        this.assignedProjects = projects.filter(
          (x) => x.status === ProjectStatus.FINISHED,
        );
      }

      this.renderProjects();
    });
  }

  public renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent =
      this.type.toUpperCase() + ' PROJECTS';
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`,
    )! as HTMLUListElement;

    listEl.innerHTML = '';

    for (const item of this.assignedProjects) {
      new ProjectItem(this.element.querySelector('ul')!.id, item);
    }
  }
}

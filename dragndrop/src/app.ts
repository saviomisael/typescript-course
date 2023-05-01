enum ProjectStatus {
  ACTIVE,
  FINISHED,
}

interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

interface DragTarget {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus,
  ) {}
}

type Listener<T> = (items: T[]) => void;

class State<G> {
  protected listeners: Listener<G>[] = [];

  addListener(listenerFn: Listener<G>) {
    this.listeners.push(listenerFn);
  }
}

class ProjectState extends State<Project> {
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

const projectState = ProjectState.getInstance();

interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function required(value: string | number) {
  return String(value).trim().length > 0;
}

function minLength(value: string, length: number) {
  return value.trim().length >= length;
}

function maxLength(value: string, length: number) {
  return value.trim().length <= length;
}

function min(value: number, minValue: number) {
  return value >= minValue;
}

function max(value: number, maxValue: number) {
  return value <= maxValue;
}

function validate(validatableInput: Validatable): boolean {
  let isValid = true;

  const validations = Object.keys(validatableInput).filter((x) => x != 'value');

  validations.forEach((x) => {
    switch (x) {
      case 'min':
        if (
          typeof validatableInput.value === 'number' &&
          validatableInput.min !== undefined
        ) {
          isValid =
            isValid && min(validatableInput.value, validatableInput.min);
        }
        break;
      case 'max':
        if (
          typeof validatableInput.value === 'number' &&
          validatableInput.max !== undefined
        ) {
          isValid =
            isValid && max(validatableInput.value, validatableInput.max);
        }
        break;
      case 'required':
        isValid = isValid && required(validatableInput.value);
        break;
      case 'minLength':
        if (
          validatableInput.minLength !== undefined &&
          typeof validatableInput.value === 'string'
        )
          isValid =
            isValid &&
            minLength(validatableInput.value, validatableInput.minLength);
        break;
      case 'maxLength':
        if (
          validatableInput.maxLength !== undefined &&
          typeof validatableInput.value === 'string'
        )
          isValid =
            isValid &&
            maxLength(validatableInput.value, validatableInput.maxLength);
        break;
      default:
        break;
    }
  });

  return isValid;
}

function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjustedDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };

  return adjustedDescriptor;
}

abstract class Component<H extends HTMLElement, E extends HTMLElement> {
  protected templateElement: HTMLTemplateElement;
  protected hostElement: H;
  protected element: E;

  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string,
  ) {
    this.templateElement = document.getElementById(
      templateId,
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId)! as H;

    const importedNode = document.importNode(
      this.templateElement.content,
      true,
    );
    this.element = importedNode.firstElementChild as E;

    if (newElementId) this.element.id = newElementId;

    this.attach(insertAtStart);
  }

  private attach(insertAtStart: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtStart ? 'afterbegin' : 'beforeend',
      this.element,
    );
  }

  abstract configure(): void;
  abstract renderContent(): void;
}

class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  private project: Project;
  constructor(hostId: string, project: Project) {
    super('single-project', hostId, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  @Autobind
  dragStartHandler(event: DragEvent): void {
    event.dataTransfer!.setData('text/plain', this.project.id);
    event.dataTransfer!.effectAllowed = 'move';
  }

  @Autobind
  dragEndHandler(_: DragEvent): void {}

  configure() {
    this.element.addEventListener('dragstart', this.dragStartHandler);
    this.element.addEventListener('dragend', this.dragEndHandler);
  }

  get persons() {
    if (this.project.people === 1) {
      return '1 person';
    }

    return `${this.project.people} persons`;
  }

  renderContent(): void {
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent = `${this.persons} assigned`;
    this.element.querySelector('p')!.textContent = this.project.description;
  }
}

class ProjectList
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

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  private titleInputElement: HTMLInputElement;
  private descriptionInputElement: HTMLInputElement;
  private peopleInputElement: HTMLInputElement;

  constructor() {
    super('project-input', 'app', true, 'user-input');

    this.titleInputElement = this.element.querySelector('#title')!;
    this.descriptionInputElement = this.element.querySelector('#description')!;
    this.peopleInputElement = this.element.querySelector('#people')!;

    this.configure();
  }

  public addProject() {}

  public renderContent(): void {}

  public configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }

  @Autobind
  private submitHandler(event: Event) {
    event.preventDefault();

    const userInput = this.gatherUserInput();

    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput;
      projectState.addProject(title, description, people);
      this.clearInputs();
    }
  }

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.valueAsNumber;

    if (
      !validate({ value: enteredTitle, required: true }) ||
      !validate({ value: enteredDescription, required: true, minLength: 5 }) ||
      !validate({ value: enteredPeople, required: true, min: 1, max: 5 })
    ) {
      alert('Invalid Input');
      return;
    }

    return [enteredTitle.trim(), enteredDescription.trim(), enteredPeople];
  }

  private clearInputs() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }
}

const prjInput = new ProjectInput();
const activeProjectList = new ProjectList('active');
const finishedProjectList = new ProjectList('finished');

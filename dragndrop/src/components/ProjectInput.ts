import { Autobind } from '../decorators/Autobind';
import { projectState } from '../state/project-state';
import { validate } from '../util/validation';
import { Component } from './BaseComponent';

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
      !validate({
        value: enteredDescription,
        required: true,
        minLength: 5,
      }) ||
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

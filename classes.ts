abstract class Department {
  protected employees: string[] = [];

  constructor(private readonly name: string) {}

  describe(this: Department) {
    console.log('Department: ' + this.name);
  }

  addEmployee(employee: string) {
    this.employees.push(employee);
  }

  printEmployeeInformation() {
    console.log(this.employees.length);
    console.log(this.employees);
  }

  getName() {
    return this.name;
  }

  abstract printDescription(): void;
}

class ITDepartment extends Department {
  static ID = 'it-2';

  constructor() {
    super('IT');
  }

  static getInstance() {
    return new ITDepartment();
  }

  printDescription(): void {
    this.describe();
  }

  describe(this: Department): void {
    console.log('IT Department');
  }
}

class Singleton {
  private static instance: Singleton;

  private constructor() {}

  static getInstance() {
    if (!Singleton.instance) Singleton.instance = new Singleton();

    return Singleton.instance;
  }
}

const department = ITDepartment.getInstance();

console.log(department);

console.log(ITDepartment.ID);

department.describe();

department.addEmployee('Max');
department.addEmployee('Manu');

department.printEmployeeInformation();

department.printDescription();

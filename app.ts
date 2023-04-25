type Admin = {
  name: string;
  privileges: string[];
};

type Employee = {
  name: string;
  startDate: Date;
};

type ElevatedEmployee = Admin | Employee;

const e1: ElevatedEmployee = {
  name: 'Savio',
  privileges: ['create-user'],
  startDate: new Date(),
};

function printEmployeeInformation(emp: ElevatedEmployee) {
  if ('privileges' in emp) {
    console.log(emp.privileges);
  }
}

printEmployeeInformation(e1);

const userInputElement = document.querySelector(
  '.user-input',
)! as HTMLInputElement;

userInputElement.value = 'Hi there!';

interface ErrorContainer {
  [key: string]: string;
}

const errorBag: ErrorContainer = {
  email: 'Not a valid email!',
  username: 'Must start with a capital character!',
};

const storedData = null ?? 'DEFAULT';
console.log(storedData);

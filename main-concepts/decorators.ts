function Logger(logString: string) {
  return function (target: Function) {
    console.log(logString);
    console.log(target);
  };
}

function WithTemplate(template: string, hookId: string) {
  return function <T extends { new (...args: any[]): { name: string } }>(
    target: T,
  ) {
    return class extends target {
      constructor(..._: any[]) {
        super();

        const hookEl = document.getElementById(hookId);

        if (hookEl) {
          hookEl.insertAdjacentHTML('afterbegin', template);
          hookEl.querySelector('h1')!.textContent = this.name;
        }
      }
    };
  };
}

@Logger('logging-person')
@WithTemplate('<h1>My Person Object</h1>', 'app')
class Person {
  name = 'Savio';

  constructor() {
    console.log('Creating person object...');
  }
}

const pers = new Person();

console.log(pers);

function Log(prototypeObj: any, propertyName: string) {
  console.log('Property decorator!');
  console.log(prototypeObj, propertyName);
}

function Log2(
  prototypeObj: any,
  name: string,
  propertyDescriptor: PropertyDescriptor,
) {
  console.log('Accessor decorator!');
  console.log(prototypeObj);
  console.log(name);
  console.log(propertyDescriptor);
}

function Log3(
  prototypeObj: any,
  nameMethod: string | Symbol,
  descriptor: PropertyDescriptor,
) {
  console.log('Method Decorator');
  console.log(prototypeObj);
  console.log(nameMethod);
  console.log(descriptor);
}

function Log4(target: any, nameMethod: string | Symbol, position: number) {
  console.log('Parameter Decorator');
  console.log(target);
  console.log(nameMethod);
  console.log(position);
}

class Product {
  @Log
  title: string;
  private _price: number;

  constructor(title: string, price: number) {
    this.title = title;
    this._price = price;
  }

  @Log2
  set price(val: number) {
    if (val > 0) {
      this._price = val;
    }
  }

  @Log3
  getPriceWithTax(@Log4 tax: number) {
    return this._price * (1 + tax);
  }
}

function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };

  return adjDescriptor;
}

class Printer {
  message = 'This works!';

  @Autobind
  showMessage() {
    console.log(this.message);
  }
}

const printer = new Printer();

const button = document.querySelector('button')!;

button.addEventListener('click', printer.showMessage);

interface ValidatorConfig {
  [property: string]: {
    [validatableProp: string]: string[];
  };
}

const registeredValidators: ValidatorConfig = {};

function Required(target: any, propName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propName]: [
      ...(registeredValidators[target.constructor.name]?.[propName] ?? []),
      'required',
    ],
  };
}

function PositiveNumber(target: any, propName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propName]: [
      ...(registeredValidators[target.constructor.name]?.[propName] ?? []),
      'required',
    ],
  };
}

function validate(obj: any) {
  const objValidatorConfig: {
    [prop: string]: string[];
  } = registeredValidators[obj.constructor.name];

  if (!objValidatorConfig) return true;

  let isValid = true;

  for (const prop in objValidatorConfig) {
    for (const validator of objValidatorConfig[prop]) {
      switch (validator) {
        case 'required':
          isValid = isValid && !!obj[prop];
          break;
        case 'positive':
          isValid = isValid && obj[prop] > 0;
          break;
      }
    }
  }

  return isValid;
}

class Course {
  @Required
  title: string;
  @PositiveNumber
  price: number;

  constructor(title: string, price: number) {
    this.title = title;
    this.price = price;
  }
}

const courseForm = document.querySelector('form')!;

courseForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const titleEl = document.querySelector('#title') as HTMLInputElement;
  const priceEl = document.querySelector('#price') as HTMLInputElement;

  const title = titleEl.value;
  const price = +priceEl.value;

  const createdCourse = new Course(title, price);

  if (!validate(createdCourse)) {
    alert('Invalid input, please try again!');

    return;
  }

  console.log(createdCourse);
});

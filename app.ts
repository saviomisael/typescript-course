interface Greetable {
  name: string;

  greet(phrase: string): void;
}

interface IPerson extends Greetable {
  age: number;
}

class PersonImpl implements IPerson {
  name!: string;
  age!: number;
  greet(phrase: string): void {
    console.log(phrase + ' ' + this.name);
  }
}

let user1 = new PersonImpl();
user1.age = 23;
user1.name = 'Savio';

user1.greet("Hi there - I'm");

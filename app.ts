const names = ['Max', 'Manuel']

function merge<T extends object, U extends object>(objA: T, objB: U) {
  return Object.assign({}, objA, objB);
}

const mergedObject = merge({name: 'Savio'}, {age: 23});

console.log(mergedObject.age, mergedObject.name);

interface Lengthy {
  length: number;
}

function countAndDescribe<T extends Lengthy>(element: T): [T, string] {
  let description = 'Got no value.';

  if(element.length > 0) {
    description = `Got ${element.length} elements.`;
  }

  return [element, description];
}

console.log(countAndDescribe('Hi there!'));

function extractAndConvert<T extends object, U extends keyof T>(obj: T, key: U) {
  return 'Value ' + obj[key];
}

console.log(extractAndConvert({name: 'Savio'}, 'name'));

interface CourseGoal {
  title: string;
  description: string;
  completeUntil: Date;
}

function createCourseGoal(title: string, description: string, date: Date): CourseGoal {
  let courseGoal: Partial<CourseGoal> = {};
  courseGoal.title = title;
  courseGoal.description = description;
  courseGoal.completeUntil = date;

  return courseGoal as CourseGoal;
}

const namesArr: Readonly<string[]> = ['Max', 'Sports'];
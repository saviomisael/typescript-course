function add(num1: number, num2: number): number {
  return num1 + num2;
}

let combineValues: (num1: number, num2: number) => number;

combineValues = add;

function addAndHandle(n1: number, n2: number, cb: CallableFunction) {
  cb(n1 + n2);
}

addAndHandle(1, 2, (result: number) => console.log(result));

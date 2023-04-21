let userInput: unknown;
let userName: string;

userInput = 5;
userInput = 'Hi';

function generateError(message: string, code: number): never {
  throw { message, errorCode: code };
}

generateError('An error occured', 500);

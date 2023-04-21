var userInput;
var userName;
userInput = 5;
userInput = 'Hi';
function generateError(message, code) {
    throw { message: message, errorCode: code };
}
generateError('An error occured', 500);

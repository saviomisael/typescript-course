export interface Validatable {
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

export function validate(validatableInput: Validatable): boolean {
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

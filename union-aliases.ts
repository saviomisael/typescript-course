type Combinable = number | string;

type ConversionDescriptor = 'as-number' | 'as-text';

function combine(
  input1: Combinable,
  input2: Combinable,
  resultType: ConversionDescriptor,
) {
  let result;

  if (
    (typeof input1 === 'number' && typeof input2 === 'number') ||
    resultType === 'as-number'
  )
    return Number(input1) + Number(input2);
  else return input1.toString() + input2.toString();
}

const combinedAges = combine(30, 26, 'as-number');

console.log(combinedAges);

const combinedStringAges = combine('30', '26', 'as-number');

console.log(combinedStringAges);

const combinedNames = combine('Max', 'Ana', 'as-text');

console.log(combinedNames);

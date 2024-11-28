import { ulid } from "jsr:@std/ulid/ulid";

console.log(ulid());

const arr = [1, 2, 3, 4, 5];
const r = arr.reduce((p, c) => p + c, 0);
console.log("r", r);

const nestedArray = [[1, 2], [3, 4], [5]];
const flatArray = nestedArray.reduce(
  (accumulator, currentArray) => accumulator.concat(currentArray),
  [],
);
console.log(flatArray); // Output: [1, 2, 3, 4, 5]

const fruits = [
  "apple",
  "banana",
  "orange",
  "apple",
  "orange",
  "banana",
  "banana",
];
const fruitCount = fruits.reduce((accumulator, fruit) => {
  accumulator[fruit] = (accumulator[fruit] || 0) + 1;
  return accumulator;
}, {} as { [key: string]: number });
console.log(fruitCount); // Output: { apple: 2, banana: 3, orange: 2 }

const values = [10, 5, 100, 50];
const maxValue = values.reduce(
  (max, currentValue) => Math.max(max, currentValue),
  -Infinity,
);
console.log(maxValue); // Output: 100

interface Student {
  name: string;
  subject: string;
}

const students: Student[] = [
  { name: "Alice", subject: "Math" },
  { name: "Bob", subject: "Science" },
  { name: "Charlie", subject: "Math" },
];

const groupedBySubject = students.reduce((accumulator, student) => {
  const subject = student.subject;
  if (!accumulator[subject]) {
    accumulator[subject] = [];
  }
  accumulator[subject].push(student);
  return accumulator;
}, {} as { [key: string]: Student[] });

console.log(groupedBySubject);
/*
Output:
{
    Math: [{ name: "Alice", subject: "Math" }, { name: "Charlie", subject: "Math" }],
    Science: [{ name: "Bob", subject: "Science" }]
}
*/

const numbersWithDuplicates = [1, 2, 2, 3, 4, 4];
const uniqueNumbers = numbersWithDuplicates.reduce<number[]>(
  (accumulator, currentValue) => {
    if (!accumulator.includes(currentValue)) {
      accumulator.push(currentValue);
    }
    return accumulator;
  },
  [],
);
console.log(uniqueNumbers); // Output: [1, 2, 3, 4]

const scores = [90, 80, 70];
const averageScore = scores.reduce(
  (accumulator, currentValue) => accumulator + currentValue,
  0,
) / scores.length;
console.log(averageScore); // Output: 80

interface Product {
  id: number;
  name: string;
}

const products: Product[] = [
  { id: 1, name: "Shirt" },
  { id: 2, name: "Shoes" },
];

const productMap = products.reduce((accumulator, product) => {
  accumulator[product.id] = product.name;
  return accumulator;
}, {} as { [key: number]: string });

console.log(productMap); // Output: { '1': 'Shirt', '2': 'Shoes' }

interface Item {
  price: number;
}

const items: Item[] = [
  { price: 10 },
  { price: 20 },
  { price: 30 },
];

const totalPrice = items.reduce(
  (accumulator, item) => accumulator + item.price,
  0,
);
console.log(totalPrice); // Output: 60

const asyncFunction = (value: number) => {
  return new Promise((resolve) =>
    setTimeout(() => resolve(value), Math.random() * 1000)
  );
};

const functions = [
  () => asyncFunction(1),
  () => asyncFunction(2),
  () => asyncFunction(3),
];

async function executeInOrder(
  functionsArray: any[],
) {
  const result = await functionsArray.reduce(
    (promiseChain, currentFunction) => promiseChain.then(currentFunction),
    Promise.resolve(),
  );

  console.log(result); // Output will be the last resolved value
}

executeInOrder(functions);

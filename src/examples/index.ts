import { Person } from './Person';
import Benchmark from 'benchmark';

// const person = new Person({name: 'test'});

const metadata = [
 {key: 'name'},
 {key: 'age'}
];

let script = 'const person = new Person();';
metadata.forEach(entry => {
  script = `${script}if (document.${entry.key}) person.${entry.key} = document.${entry.key};`;
});

script = `${script} return person;`;

console.log(script);

const document = {name: 'test', age: 22};

const createPersonFn = new Function('Person', 'document', script);

const person = createPersonFn(Person, document);

const suite = new Benchmark.Suite;

// add tests
suite.add('new Function', function() {
  createPersonFn(Person, document);
})
.add('forEach', function() {
  const person = new Person();
  metadata.forEach(entry => {
    if (document[entry.key]) person[entry.key] = document[entry.key];
  });
  return person;
})
// add listeners
.on('cycle', function(event: any) {
  console.log(String(event.target));
})
// run async
.run({ 'async': false });

console.log(person);
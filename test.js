Object.defineProperty(
  String.prototype,
  'toJadenCase',
  { value :
   function toJadenCase() {
     return this.split(' ').map(word => {
       return word.charAt(0).toUpperCase() + word.slice(1)
     }).join(" ");
   }
  }
);

console.log('love from js!'.toJadenCase())

// to run the program: node test.js
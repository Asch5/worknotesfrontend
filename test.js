// function outer() {
//     const outerVar = 'I am an outer variable';

//     function inner() {
//         console.log(outerVar); // Output: I am an outer variable
//     }

//     return inner;
// }

// const innerFn = outer(); // Invoke outer function and assign the result to innerFn
// innerFn(); // Invoke inner function

const name = 'Ida';

{
    var name2 = 'Ida2';
    console.log(name);
}
console.log(name2);

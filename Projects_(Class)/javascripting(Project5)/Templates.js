//Template string
        var st1  = "Hello";
        var st2 = "Hello World";
        var st3 = "Hello World@123";
        var st4 = "";
        var st5 = ''
        var st6 = 4791879821648;
        var st7 = 'olleh';
        var st8 = 'H';

//temp function
function employee(name, salary){

    return "Hello " + name + ", " + "You have a salary of Rs. : " + salary;
}

function function2(name, salary){
    return `Hello ${name}, You have a salary of Rs. : ${salary}`;
}

console.log(function2("Soham" ,1000000));


//id fetching and variable adding to the link.

//template string (how do we connect it to the actual link tho?)
var id = 8;
var api = "https://fakestoreapi.com/products/"+ id;
var api1 = `https://fakestoreapi.com/products/${id}`;

console.log(api1);
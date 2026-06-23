
// FUNCTIONS
// function is a reuseable block of code that runs only when we call it.
/*
function fun() {
    var a = 30;
    var b = 2;

    var c = a * b;

    console.log(c);
}

//called function fun.
fun();

// PARAMETER TIMM!!!

function division(x,y) {
    var z = x/y;
    
    console.log(z);
}

division(100,2);


// string use in functions.
function employee(name, salary){
    var tax = salary * 0.20;

    console.log("Hello " + name + ", " + "You have to pay: " + tax);
    
}
//here the name, salary are the function's parameters.
employee("Jitesh", 100000);
employee("Dharmaraj", 500000);

// Area of Triangle

function areaOfTriangle (height, base, lengthT) {
    var c = height * base/2;

    console.log("Area of the Triangle of the given dimentions is: " + c + lengthT);
}

areaOfTriangle(4, 2, "cm");


//Pune = 25%, mumbai = 30%, Jalgaon = 15%
//Employee name, salary after all(tax) deduction, city.

function Employee(name, salary, city) {
    var puneTax = 0.25;
    var mumbaiTax = 0.30;
    var jalgaonTax = 0.15;
    
    var cityLower = city.toLowerCase();
    
        if(cityLower == "pune") {
    var tax = salary * puneTax;
            console.log("Hello " + name + ", " + "Your salary is: " + (salary - tax) + " because you are from: pune after tax deduction");
        }
        else if(cityLower == "mumbai") {
    var tax = salary * mumbaiTax;
            console.log("Hello " + name + ", " + "Your salary is: " + (salary - tax) + " because you are from: mumbai after tax deduction");
        }
        else if(cityLower == "jalgaon") {
    var tax = salary * jalgaonTax;
            console.log("Hello " + name + ", " + "Your salary is: " + (salary - tax) + " because you are from: jalgaon after tax deduction");
        }
        else {
            console.log("Please input a valid city for your tax deducted salary valuation");
        }
}

Employee("Om", 1000000, "jalgaon");


//same code. its an example of the void type function. its a function type with no specific return and output.


function Employee(name, salary, city) {
    var puneTax = 0.25;
    var mumbaiTax = 0.30;
    var jalgaonTax = 0.15;
    
    var cityLower = city.toLowerCase();
    
        if(cityLower == "pune") {
    var tax = salary * puneTax;
            console.log("Hello " + name + ", " + "Your salary is: " + (salary - tax) + " because you are from: pune after tax deduction");
        }
        else if(cityLower == "mumbai") {
    var tax = salary * mumbaiTax;
            console.log("Hello " + name + ", " + "Your salary is: " + (salary - tax) + " because you are from: mumbai after tax deduction");
        }
        else if(cityLower == "jalgaon") {
    var tax = salary * jalgaonTax;
            console.log("Hello " + name + ", " + "Your salary is: " + (salary - tax) + " because you are from: jalgaon after tax deduction");
        }
        else {
            console.log("Please input a valid city for your tax deducted salary valuation");
        }
}

Employee("Om", 1000000, "jalgaon");

//void and function types

function fun() {
    var a =100;
    var b =200;
    var c = a*(2*b);
    return c;
}
//this is the number type.
console.log(fun());

function evenOdd (){
    var number = 26;
    if (number%2 == 0) {
        console.log("The Number is Even");
    }
    else {
        console.log("The Number is Odd");
    }
}

evenOdd(); 

//return type function of boolean type.
function evenOdd (){
    var number = 26;
    if (number%2 == 0) {
        return true;
    }
    else {
        return false;
    }
}


    if (evenOdd()) {
        console.log("The Number is Even");
    }
    else {
        console.log("The Number is Odd");
    } 
    */

// make functionm of datatype string, number.

function string() {
    var firstName = "Soham";
    var middleName = "Girish";
    var lastName = "Nandedkar";
    var s = " ";
    return firstName + s + middleName + s + lastName;
}

console.log(string());

function number() {
    var a = 2;
    var b = a * 5;
    var c = b + (a*4);
    return c;
}

console.log(number());

function isNegative() {
    a = -10; 
    if(a > 0){
        return false;
    }
    else if(a == 0){
        return false;
    }
    else {
        return true;
    }
}

console.log(isNegative());

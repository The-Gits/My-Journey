
/*
var string = "Soham";
var reversi = "";

for(var i=string.length-1;  i >= 0 ; i--){
    console.log(string.charAt(i));
}
*/
var string = "Soham";
var revSt = "";

for(var i=string.length-1;  i >= 0 ; i--){
    revSt = revSt + string.charAt(i);
}

console.log(revSt);

//functions 
var sting = "Yashashwini"
console.log(sting.charAt(4));
console.log(sting.concat("Mahale"));
console.log(sting.startsWith("Yash"));
console.log(sting.includes("ashwini"));
console.log(sting.match("asha"));
console.log(sting.indexOf("a"));
console.log(sting.length);
console.log(sting.slice(2, 5));
var stingy = "Soham Grish Nandedkar";
console.log(stingy.split(" "));

console.log(sting.substring(2,5));
console.log(sting.toUpperCase());

console.log(stingy.trim())


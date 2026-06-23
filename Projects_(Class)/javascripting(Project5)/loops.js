for (let i = 0; i < 3; i++) {
    console.log(i);
}

console.log("The above is for for loop.");
//initialization condition ke bad me condotion 

// Initialization > condition > task > increment > initi(loops again)

var j = 10;
while (j>5) {
    console.log(j);
    j--;
}

console.log("The above is for while loop.");

var arree = [10,20,30,40,50,60,70,80,90,100];

for(var i = 0; i < arree.length; i = i+1){
    console.log(arree[i]);
}

/*
// Create a 7x7 table using nested loops
const tableSize = 7;
const table = Array(tableSize).fill().map(() => Array(tableSize).fill(' '));

for (let i = 0; i < tableSize; i++) {
    for (let j = 0; j < tableSize; j++) {
        table[i][j] = String.fromCharCode(48 + Math.min(i, j)); // Numbers 0-9
    }
}

table.forEach(row => console.log(row.join(' ')));
// Fill the table with numbers 0-9 in a diagonal pattern
for (let i = 0; i < tableSize; i++) {
    for (let j = 0; j < tableSize; j++) {
        table[i][j] = String.fromCharCode(48 + Math.min(i, j));
    }
}

// Print the table with numbers 0-9 in a diagonal pattern
for (let i = 0; i < tableSize; i++) {
    for (let j = 0; j < tableSize; j++) {
        console.log(table[i][j], end=' ');
    }
    console.log();
}*/
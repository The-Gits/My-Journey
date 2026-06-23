var a = [1,2,3,4,5,6,7,8,9,10];

function even(arr){
    var evenNumbers = [];
    var j = 0;
    for(var i = 0; i < arr.length; i++){
        if(arr[i]%2 == 0){
            evenNumbers[j]= arr[i];
            j++;
        }    
    }
    return evenNumbers;
}
console.log(even(a));
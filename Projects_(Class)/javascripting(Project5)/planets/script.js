function vajan (){

    var weight = document.getElementById("w").value;

    var W = " Your Weight is: ";
    var m = 0.38 * weight;
    var v = 0.91 * weight;
    var mo = 0.14 * weight;
    var ma = 0.38 * weight;
    var j = 2.53 * weight;
    var s = 1.06 * weight;
    var n = 1.12 * weight;
    var u = 0.89 * weight;
    var p = 0.07 * weight;
    

    document.getElementById("mercury").innerHTML = W + m;
    document.getElementById("venus").innerHTML = W + v;
    document.getElementById("moon").innerHTML = W + mo;
    document.getElementById("mars").innerHTML = W + ma;
    document.getElementById("jupiter").innerHTML = W + j;
    document.getElementById("saturn").innerHTML = W + s;
    document.getElementById("neptune").innerHTML = W + n;
    document.getElementById("uranus").innerHTML = W + u;
    document.getElementById("pluto").innerHTML = W + p;
}
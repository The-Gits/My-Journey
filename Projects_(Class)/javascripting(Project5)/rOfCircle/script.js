function area () {
    var r = document.getElementById("radius").value;
    // var Header = document.getElementById("head")
    //var span = document.getElementById("Span")

    var area = 3.1428*r*r;

    document.getElementById("Span").innerHTML = area;
}
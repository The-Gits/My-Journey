function aor () {
    var h = document.getElementById("height").value;
    var w = document.getElementById("width").value;

    var area = h * w;

    document.getElementById("area").innerHTML = area;
}
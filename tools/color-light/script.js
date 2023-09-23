function updateColor() {
    document.body.style.background = document.getElementById("color-config").color.value;
}

document.getElementById("color").onchange = updateColor;
updateColor();

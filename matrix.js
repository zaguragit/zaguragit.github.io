const element = document.querySelector ('#matrix_bg');
const style = getComputedStyle (element);
const color = style.color;
const accent_color = style.getPropertyValue ('--extra-color');
const ctx = matrix_bg.getContext ('2d');

matrix_bg.width = window.innerWidth;
matrix_bg.height = window.innerHeight;
matrix_bg.style.opacity = 0;

const yPositions = Array (300).join (0).split ('');
const waitUntil = Array (300).join (0).split ('');
var lastRedX = 0, lastRedY = 0;

function clear () {
    ctx.fillStyle = style.backgroundColor;
    ctx.fillRect (0, 0, window.innerWidth, window.innerHeight);
}

function draw () {
    ctx.font = '10pt Fairfax HD';
	yPositions.map ((y, index) => {
        var text = String.fromCodePoint (0xf1900 + parseInt (Math.random () * 0x88));
        var x = (index * 18);
        if (Math.abs (lastRedY + lastRedX - x - yPositions[index]) > 30) {
	        ctx.fillStyle = color;
	        lastRedX = x;
	        lastRedY = yPositions[index];
        } else ctx.fillStyle = accent_color;
	    if (Date.now() - waitUntil[index] > 0) {
		    if (Math.random () > 0.3) {
		        waitUntil[index] = 0;
		        ctx.fillText (text, x, y);
		        if (y > 100 + Math.random () * 1e4)
		            yPositions[index] = 0;
		        else
		            yPositions[index] = y + 20;
		    } else {
		        waitUntil[index] = Date.now() + Math.random () * 1200 + 300;
		    }
		} else {
	        ctx.fillText (text, x, y);
	        ctx.fillText (text, x, y);
	        ctx.fillText (text, x, y);
        }
	});
}


setTimeout (() => {
    setInterval (() => {
        if (matrix_bg.width !== window.innerWidth) matrix_bg.width = window.innerWidth;
	    if (matrix_bg.height !== window.innerHeight) matrix_bg.height = window.innerHeight;
	    clear ();
    }, 32);

    setInterval (() => {
        if (matrix_bg.width !== window.innerWidth) matrix_bg.width = window.innerWidth;
	    if (matrix_bg.height !== window.innerHeight) matrix_bg.height = window.innerHeight;
	    draw ();
    }, 64);
    clearInterval (c);
    clearInterval (d);
    matrix_bg.style.opacity = 1;
}, 300);

var c = setInterval (clear, 0.0000001);
var d = setInterval (draw, 0.0000002);

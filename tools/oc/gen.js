const haircuts = [
    "bald",
    "buzz cut",
    "pixy cut",

    "mohawk",
    
    "bob",
    "chinlength curly",
    "wolf cut",

    "dreadlocks",
    "afro",
];

const ears = [
    "human",
    "pointy",
    "dog",
    "cat",
    "bunny",
];

const proportions = [
    "tall",
    "short",
    "elongated (smaller torso)",
    "big torso",
];

const constitution = [
    "muscular",
    "skinny",
    "average",
    "chubby",
    "plus size",
];

const vibe = [
    "slutty",
    "gothic",
    "cottage core",
    "vibrant",
    "cyberpunk",
    "solarpunk",
];

const personality = [
    "flirty",
    "bubbly",
    "shy",
    "curious",
    "smug",
    "rude",
];

const button = document.getElementById("generate-button");
const hr = "<td colspan=99><hr></td>";

button.addEventListener("click", () => {
    document.getElementById("result").innerHTML = card([
        table([
            ["proportions", pick(proportions)],
            ["constitution", pick(constitution)],
            ["skin colors", color() + color()],
            hr,
            ["hair", pick(haircuts) + color()],
            ["eye color", color()],
            ["ears", pick(ears)],
            hr,
            ["personality", pick(personality)],
            ["vibe", pick(vibe) + pick(vibe)],
        ]),
    ]);
});

function card(sections) {
    return "<section>" + sections.join("<hr>") + "</section>";
}

function table(rows) {
    return "<table>" + rows.map(row => (row === hr) ? hr : `<tr><td>${row[0]}</td><td>${row[1]}</td></tr>`).join("") + "</table>";
}

function pick(list) {
    return "<div class=type>" + list[Math.round(Math.random() * (list.length - 1))] + "</div>"
}

var last_hue = null;
function color() {
    let h = Math.random();
    if (last_hue != null)
        h = 0.6 * h + 0.4 * (Math.abs(last_hue - h) > 0.5) ? (last_hue + 0.5) % 1 : last_hue;
    last_hue = h;
    return `<div class=color style="background-color:${hsl2hex(h * 360, Math.random(), Math.random())};"></div>`;
}

function hsl2hex(h, s, l) {
    const a = s * Math.min(l, 1 - l);
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}
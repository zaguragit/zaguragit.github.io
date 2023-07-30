const hair_texture = [
    "straight",
    "wavy",
    "curly",
    "coily",
    "dreadlocks",
];

const hair_length = [
    "bald",
    "buzzcut",
    "short",
    "chin length",
    "shoulder length",
    "butt length",
    "beyond butt length",
    "mohawk",
    "afro",
];

const hair_bangs = [
    "none",
    "buzzcut",
    "short",
    "chin length",
    "shoulder length",
    "butt length",
    "beyond butt length",
    "mohawk",
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

const extra = [
    "fins",
    "horns",
    "fangs",
    "beard",
    "mustache",
    "tatoos",
    "glowing markings",
    "piercings",
    "antennas",
    "wings",
]

const vibe = [
    "slutty",
    "gothic",
    "cottage core",
    "vibrant",
    "cyberpunk",
    "solarpunk",
    "steampunk",
    "masculine",
    "feminine",
    "psychedelic",
    "pastelgoth",
];

const personality = [
    "flirty",
    "bubbly",
    "shy",
    "curious",
    "smug",
    "rude",
    "calm",
];

const tops = [
    "nothing",
    "t-shirt",
    "croptop",
    "oversized t-shirt",
    "shirt",
    "jacket",
    "bralette",
    "hoodie",
];

const bottoms = [
    "nothing",
    "maxi skirt",
    "pleated skirt",
    "pants",
    "leggings",
    "shorts",
    "crinoline dress",
];

const clothing_textures = [
    "plad",
    "denim",
    "silk",
    "plain",
    "translucent",
    "leaf",
    "latex",
    "leather",
];

const place = [
    "village",
    "city",
    "town",
    "forest",
    "jungle",
    "taiga",
    "cave",
    "building roof",
    "balcony",
    "elevator",
    "inside window",
    "beach",
    "mountains",
    "ship",
];

const time_period = [
    "ancient",
    "futuristic",
    "victorian",
    "roman",
    "gothic",
    "modern",
];

const button = document.getElementById("generate-button");
const hr = "<td colspan=99><hr></td>";

button.addEventListener("click", () => {
    document.getElementById("result").innerHTML = table([
        ["proportions", pick(proportions)],
        ["constitution", pick(constitution)],
        ["skin colors", color() + color()],
        ["extra", pick(extra, 1, 4, 3.0)],
        hr,
        ["hair", pick(hair_length) + pick(hair_texture) + color()],
        ["eye color", color()],
        ["ears", pick(ears)],
        hr,
        ["top", pick(clothing_textures) + pick(tops)],
        ["bottom", pick(clothing_textures) + pick(bottoms)],
        hr,
        ["personality", pick(personality, 1, 2, 2.0)],
        ["vibe", pick(vibe, 1, 2)],
        ["setting", pick(time_period) + pick(place)],
    ]);
});

function table(rows) {
    return "<table>" + rows.map(row => (row === hr) ? hr : `<tr><td>${row[0]}</td><td>${row[1]}</td></tr>`).join("") + "</table>";
}

function pick(list, min, max, min_weight) {
    if (!min)
        min = 1;
    if (!max)
        max = min;
    if (!min_weight)
        min_weight = 1;
    const count = min - 0.5 + Math.round(Math.pow(Math.random(), min_weight) * (max - min));
    let a = [];
    for (let i = 0; i < count; i++) {
        let b;
        do {
            b = list[Math.round(Math.random() * (list.length - 1))]
        } while (a.includes(b));
        a.push(b);
    }
    return "<div class=type>" + a.join(", ") + "</div>"
}

var last_hue = null;
function color() {
    let h = Math.random();
    if (last_hue != null)
        h = 0.6 * h + 0.4 * (Math.abs(last_hue - h) > 0.5) ? (last_hue + 0.5) % 1 : last_hue;
    last_hue = h;
    return `<div class=color style="color:${hsl2hex(h * 360, Math.random(), Math.random())};"></div>`;
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
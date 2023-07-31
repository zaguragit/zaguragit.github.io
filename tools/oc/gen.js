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
    "harness",
];

const bottoms = [
    "nothing",
    "maxi skirt",
    "pleated skirt",
    "pants",
    "sweat pants",
    "cargo pants",
    "leggings",
    "shorts",
    "crinoline dress",
    "boxers",
    "swim trunks",
];

const shoes = [
    "nothing",
    "thigh highs",
    "boots",
    "moccasins",
    "sneakers",
    "high heel shoes",
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
    "floral",
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

const hr = "<td colspan=99><hr></td>";

document.getElementById("char-gen-button").addEventListener("click", () => {
    document.getElementById("char-res").innerHTML = table([
        ["body", pick(proportions) + pick(constitution)],
        ["skin", pick_color(1, 2, 2.0)],
        ["extra", pick(extra, 1, 4, 3.0)],
        hr,
        ["hair", pick(hair_length) + pick(hair_texture) + pick_color(1, 3, 2.0)],
        ["eye color", pick_color()],
        ["ears", pick(ears)],
        hr,
        ["top", pick(clothing_textures) + pick(tops)],
        ["bottom", pick(clothing_textures) + pick(bottoms)],
        ["shoes", pick(shoes)],
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
    return "<div class=type>" + pick_elements(list, min, max, min_weight).join(", ") + "</div>";
}


function pick_elements(list, min, max, min_weight) {
    const count = get_count(min, max, min_weight);
    let a = [];
    for (let i = 0; i < count; i++) {
        let b;
        do {
            b = list[Math.round(Math.random() * (list.length - 1))]
        } while (a.includes(b));
        a.push(b);
    }
    return a;
}

var last_hue = null;
function pick_color(min, max, min_weight) {
    const count = get_count(min, max, min_weight);
    let a = [];
    for (let i = 0; i < count; i++) {
        let b;
        do {
            let h = Math.random();
            if (last_hue !== null)
                h = 0.6 * h + 0.4 * (Math.abs(last_hue - h) > 0.5) ? (last_hue + 0.5) % 1 : last_hue;
            last_hue = h;
            b = `<div class=color style="color:${hsl2hex(h * 360, Math.random(), Math.random())};"></div>`
        } while (a.includes(b));
        a.push(b);
    }
    return a.join("");
}

function get_count(min, max, min_weight) {
    if (!min)
        min = 1;
    if (!max)
        max = min;
    if (!min_weight)
        min_weight = 1;
    return min - 0.5 + Math.round(Math.pow(Math.random(), min_weight) * (max - min));
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


document.getElementById("name-gen-button").addEventListener("click", () => {
    const name = gen_name(2, 4, 2.0);
    document.getElementById("name-res").innerHTML = table([
        ["ipa", "/" + name[0] + "/"],
        ["latin", name[1]],
        ["cyrillic", name[2]],
    ]);
});

const consonants = [
    ["b", "b", "б"],
    ["d", "d", "д"],
    ["f", "f", "ф"],
    ["g", "g", "г"],
    ["h", "h", "х"],
    ["j", "j", "й"],
    ["k", "k", "к"],
    ["l", "l", "л"],
    ["m", "m", "м"],
    ["n", "n", "н"],
    ["p", "p", "п"],
    ["r", "r", "р"],
    ["s", "s", "с"],
    ["t", "t", "т"],
    ["v", "v", "в"],
    ["w", "w", "в"],
    ["z", "z", "з"],
    ["t̠ʃ", "ch", "ч"],
    ["ʃ", "sh", "ш"],
    ["ʒ", "zh", "ш"],
];
const vowels = [
    ["a", "a", "а"],
    ["e", "e", "е"],
    ["i", "i", "и"],
    ["o", "o", "о"],
    ["u", "u", "у"],
    ["ɨ", "y", "ы"],
];

function gen_name(min, max, min_weight) {
    const syllables = get_count(min, max, min_weight);
    let name = ["", "", ""];
    for (let i = 0; i < syllables; i++) {
        const c = pick_elements(consonants)[0];
        const v = pick_elements(vowels)[0];
        const c1 = (Math.random() > 0.9) ? pick_elements(consonants)[0] : ["", "", ""];
        for (let j = 0; j < name.length; j++) {
            let syllable = c[j] + v[j] + c1[j];
            name[j] += syllable;
        }
    }
    return name;
}
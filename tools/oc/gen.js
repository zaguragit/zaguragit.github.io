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
    "nose length",
    "chin length",
    "shoulder length",
    "butt length",
    "beyond butt length",
    "mohawk",
    "afro",
    "short with long bangs",
    "undercut",
];

const ears = [
    "human",
    "pointy",
    "dog",
    "cat",
    "bunny",
];

const proportions = [
    "short",
    "average",
    "tall",
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
    "goth",
    "psychedelic",
    "maximalist",
    "minimalist",
    "vintage",
];

const personality = [
    "slutty",
    "flirty",
    "bubbly",
    "shy",
    "curious",
    "smug",
    "rude",
    "calm",
    "punk",
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

var last_hue = null;
var hue_palette = null;
var lightness_base = null;
document.getElementById("char-gen-button").addEventListener("click", () => {
    last_hue = null;
    hue_palette = create_hue_palette();
    lightness_base = 0.1 + Math.random() * 0.8;
    document.getElementById("char-res").innerHTML = table([
        ["body", pick(proportions) + pick(constitution)],
        ["skin", pick_color(1, 4, 3.0)],
        ["extra", pick(extra, 1, 4, 3.0)],
        hr,
        ["hair", pick(hair_length) + pick(hair_texture) + pick_color(1, 3, 2.0)],
        ["eye color", pick_color(1, 2, 5.0)],
        ["ears", pick(ears)],
        hr,
        ["top", pick(clothing_textures) + pick(tops) + pick_color(1, 3, 5.0)],
        ["bottom", pick(clothing_textures) + pick(bottoms) + pick_color(1, 3, 5.0)],
        ["shoes", pick(shoes) + pick_color(1, 3, 6.0)],
        hr,
        ["personality", pick(personality, 1, 2, 2.0)],
        ["vibe", pick(vibe, 1, 2)],
        ["setting", pick(time_period) + pick(place)],
    ]);
});

function create_hue_palette() {
    const h = Math.random();
    let o;
    switch (Math.floor(Math.random() * 3)) {
        case 0: return [h, (h + 0.5) % 1.0];
        case 1: o = Math.random() * 0.1; break;
        case 2: o = 1.0 / 3.0 + Math.random() * 0.1; break;
    }
    return [h, (h + 1.0 - o) % 1.0, (h + o) % 1.0];
}

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

function pick_color(min, max, min_weight) {
    const count = get_count(min, max, min_weight);
    let a = [];
    for (let i = 0; i < count; i++) {
        let b;
        let j = 0;
        do {
            let i = Math.round(Math.pow(Math.random(), 1.5) * (hue_palette.length - 1));
            if (last_hue == i && Math.random() > 0.5)
                continue;
            last_hue = i;
            const lab = rgbToOklab(hsl2rgb({
                h: hue_palette[i] * 360,
                s: 0.05 + Math.random() * 0.9,
                l: 0.5,
            }));
            lab.L = lightness_base + Math.pow(Math.random() * 2.0 - 1.0, 3.0),
            b = `<div class=color style="color:${rgb2Hex(oklabToSRGB(lab))};"></div>`
        } while (a.includes(b) && j++ < 100);
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

function hsl2rgb({h, s, l}) {
    const a = s * Math.min(l, 1 - l);
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color);
    };
    return {r: f(0), g: f(8), b: f(4)};
}


function clamp(value, min, max) {
    return Math.max(Math.min(value, max), min);
}

function rgb2Hex({r, g, b}) {
    return "#" + (b | (g << 8) | (r << 16) | (1 << 24)).toString(16).slice(1);
}

const gammaToLinear = (c) =>
    c >= 0.04045 ? Math.pow((c + 0.055) / 1.055, 2.4) : c / 12.92;
const linearToGamma = (c) =>
    c >= 0.0031308 ? 1.055 * Math.pow(c, 1 / 2.4) - 0.055 : 12.92 * c;

function rgbToOklab({r, g, b}) {
    r = gammaToLinear(r / 255); g = gammaToLinear(g / 255); b = gammaToLinear(b / 255);
    var l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
    var m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
    var s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
    l = Math.cbrt(l); m = Math.cbrt(m); s = Math.cbrt(s);
    return {
        L: l * +0.2104542553 + m * +0.7936177850 + s * -0.0040720468,
        a: l * +1.9779984951 + m * -2.4285922050 + s * +0.4505937099,
        b: l * +0.0259040371 + m * +0.7827717662 + s * -0.8086757660
    }
}

function oklabToSRGB({L, a, b}) {
    var l = L + a * +0.3963377774 + b * +0.2158037573;
    var m = L + a * -0.1055613458 + b * -0.0638541728;
    var s = L + a * -0.0894841775 + b * -1.2914855480;
    l = l ** 3; m = m ** 3; s = s ** 3;
    var r = l * +4.0767416621 + m * -3.3077115913 + s * +0.2309699292;
    var g = l * -1.2684380046 + m * +2.6097574011 + s * -0.3413193965;
    var b = l * -0.0041960863 + m * -0.7034186147 + s * +1.7076147010;
    r = 255 * linearToGamma(r); g = 255 * linearToGamma(g); b = 255 * linearToGamma(b);
    
    r = clamp(r, 0, 255); g = clamp(g, 0, 255); b = clamp(b, 0, 255);
    r = Math.round(r); g = Math.round(g); b = Math.round(b);
    return {r, g, b};
}


document.getElementById("name-gen-button").addEventListener("click", () => {
    const encouraged_letters = document.getElementById("name-gen-config").letters.value;
    const name = gen_name(1, 4, 2.0, encouraged_letters);
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
    ["ʒ", "zh", "ж"],
];
const vowels = [
    ["a", "a", "а"],
    ["e", "e", "е"],
    ["i", "i", "и"],
    ["o", "o", "о"],
    ["u", "u", "у"],
    ["ɨ", "y", "ы"],
];

function gen_name(min, max, min_weight, encouraged_letters) {
    const syllables = get_count(min, max, min_weight);
    let name = [[], [], []];
    if (Math.random() > 0.6) {
        const v = pick_elements(vowels)[0];
        for (let j = 0; j < name.length; j++) {
            name[j].push(v[j]);
        }
    }
    for (let i = 0; i < syllables; i++) {
        const c = pick_elements(consonants)[0];
        const v = pick_elements(vowels)[0];
        const c1 = (Math.random() > 0.9) ? pick_elements(consonants)[0] : null;
        for (let j = 0; j < name.length; j++) {
            name[j].push(c[j]);
            name[j].push(v[j]);
            if (c1) name[j].push(c1[j]);
        }
    }
    let replaced_locations = [];
    for (const letter of encouraged_letters) {
        let l = get_letters_for_letter(letter);
        let l_is_vowel = false;
        for (const v of vowels)
            if (l[0] == v[0]) {
                l_is_vowel = true;
                break;
            }
        if (!name[0].includes(l[0])) {
            for (let i = 0; i < 100; i++) {
                const i = Math.round(Math.random() * (name[0].length - 1));
                if (replaced_locations.includes(i))
                    continue;
                let is_vowel = false;
                for (const v of vowels)
                    if (name[0][i] == v[0]) {
                        is_vowel = true;
                        break;
                    }
                if (is_vowel != l_is_vowel)
                    continue;
                replaced_locations.push(i);
                for (let j = 0; j < name.length; j++) {
                    name[j][i] = l[j];
                }
                break;
            }
        }
    }
    return name.map(x => x.join(""));
}

function get_letters_for_letter(letter) {
    for (const l of consonants)
        for (const c of l)
            if (letter == c)
                return l;
    for (const l of vowels)
        for (const c of l)
            if (letter == c)
                return l;
}
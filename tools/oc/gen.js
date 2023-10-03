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
var lightness_type = null;
document.getElementById("char-gen-button").addEventListener("click", () => {
    last_hue = null;
    const v = pick(vibe, 1, 2);
    hue_palette = create_hue_palette();
    document.getElementById("char-res").innerHTML = table([
        ["body", pick(proportions) + pick(constitution)],
        ["skin", pick_color(v, 1, 4, 3.0)],
        ["extra", pick(extra, 1, 4, 3.0)],
        hr,
        ["hair", pick(hair_length) + pick(hair_texture) + pick_color(v, 1, 3, 2.0)],
        ["eye color", pick_color(v, 1, 2, 5.0)],
        ["ears", pick(ears)],
        hr,
        ["top", pick(clothing_textures) + pick(tops) + pick_color(v, 1, 3, 5.0)],
        ["bottom", pick(clothing_textures) + pick(bottoms) + pick_color(v, 1, 3, 5.0)],
        ["shoes", pick(shoes) + pick_color(v, 1, 3, 6.0)],
        hr,
        ["personality", pick(personality, 1, 2, 2.0)],
        ["vibe", v],
        ["setting", pick(time_period) + pick(place)],
    ]);
});

function create_hue_palette() {
    // switch (Math.floor(Math.random() * 3)) {
    //     case 0: {
    //         const h = Math.random();
    //         return [h, (h + 0.5) % 1.0];
    //     }
    //     case 1: {
    //         // const h = Math.random();
    //         // return [h, (h + 1.0/3.0) % 1.0, (h + 2.0/3.0) % 1.0];
    //     }
    //     case 2: {
    //         const h = Math.random();
    //         const o = 0.05 + Math.random() * 0.45;
    //         return [h, (h + 1.0 - o) % 1.0, (h + o) % 1.0];
    //     }
    // }
    const h = Math.random();
    const o = 0.05 + Math.random() * 0.45;
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

function pick_color(vibe, min, max, min_weight) {
    const count = get_count(min, max, min_weight);
    let a = [];
    for (let i = 0; i < count; i++) {
        let b;
        do {
            let i = Math.floor(Math.pow(Math.random(), 1.5) * hue_palette.length);
            if (last_hue == i && Math.random() > 0.5)
                continue;
            last_hue = i;
            const h = hue_palette[i];
            const s = 0.05 + Math.random() * 0.9;
            const l = 0.05 + Math.random() * 0.9;
            b = `<div class=color style="color:${hsl2hex(h * 360, s, l)};"></div>`
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
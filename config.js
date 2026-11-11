/**
 * Everything personal about this page lives here, so you can make it yours
 * without touching any other file.
 */
window.VDAY_CONFIG = {
    // Shown if the name list below is empty
    defaultName: "Isimi Mi",

    // Date the "Counting Down to You" timer starts with (YYYY-MM-DD).
    // The visitor can override it from the page.
    reunionDefault: "2025-06-01",

    // Playlist: files live in /music. One is picked at random each new day,
    // then it carries on to the next when a song ends.
    songs: [
        { file: "music/Mannywellz-Looking-For-God.mp3",    title: "Mannywellz - Looking For God",    note: "Our Valentine's song 🎵" },
        { file: "music/Tchella-Ife-In-Love.mp3",           title: "Tchella - Ife In Love",           note: "Love in every note ❤️" },
        { file: "music/Mannywellz-Magic-Take-It-Easy.mp3", title: "Mannywellz - Magic Take It Easy", note: "Magic when I'm with you ✨" }
    ],

    // GIF for each "No" click (index 0 = before any click). A fallback emoji
    // is shown if a GIF fails to load (e.g. Tenor is down or blocked).
    gifStages: [
        "https://media.tenor.com/EBV7OT7ACfwAAAAj/u-u-qua-qua-u-quaa.gif",    // 0 normal
        "https://media1.tenor.com/m/uDugCXK4vI4AAAAd/chiikawa-hachiware.gif",  // 1 confused
        "https://media.tenor.com/f_rkpJbH1s8AAAAj/somsom1012.gif",             // 2 pleading
        "https://media.tenor.com/OGY9zdREsVAAAAAj/somsom1012.gif",             // 3 sad
        "https://media1.tenor.com/m/WGfra-Y_Ke0AAAAd/chiikawa-sad.gif",       // 4 sadder
        "https://media.tenor.com/CivArbX7NzQAAAAj/somsom1012.gif",             // 5 devastated
        "https://media.tenor.com/5_tv1HquZlcAAAAj/chiikawa.gif",               // 6 very devastated
        "https://media1.tenor.com/m/uDugCXK4vI4AAAAC/chiikawa-hachiware.gif"  // 7 crying runaway
    ],
    gifFallbackEmoji: ["🥰", "🤔", "🥺", "😢", "😭", "😭", "😭", "🏃"],

    // What the "No" button says on click 1, 2, 3 ... (the last one repeats)
    noMessages: [
        "Are you sure, Isimi? 🥺",
        "Mo nifẹ rẹ o! ❤️",           // I love you
        "But I added our song! 🎵",
        "Jowo, ronu daradara! 🙏",    // Please, think well
        "Isimi, you are my rest 💕",  // Meaning of her name
        "What if I bring you food? 🍜",
        "O l'ewa ju! ✨",             // You're beautiful
        "But I coded this for you! 💻",
        "Okan mi 💘",                 // My heart
        "Oluwadarasimi o! 😭",       // God is good to me
        "Last chance, Ife mi! 💔",
        "I'll let you pick the movie! 🎬",
        "Okay this is the LAST last chance! 😂"
    ],

    // Toasts shown when she tries to click "Yes" before the "No" button runs away
    yesTeasePokes: [
        "try saying no first... I bet you want to know what happens 😏",
        "go on, hit no... just once 👀",
        "you're missing out 😈",
        "click no, I dare you 😏",
        "Isimi, just click it once! 😂"
    ],

    // A random one is shown in the question each visit
    names: [
        // ===== YORUBA =====
        "Isimi Mi",           // My Rest (DEFAULT FALLBACK)
        "Simileoluwa",        // Full name
        "Simi",               // Short form
        "Ife mi",             // My love
        "Ore ofe mi",         // My special friend
        "Okan mi",            // My heart
        "Obidiya",            // The one after her husband's heart
        "Omaobidiya",         // A beautiful woman in her husband's heart
        "Achalugo",           // A regal, majestic woman (like an eagle)
        "Asampete",           // A beautiful, stunning woman ✨
        "Akwa Ugo",           // Precious eagle egg
        "Udara Mmicha",       // Sweet, leakable African star apple
        "Omo Oluwa",          // Child of God
        "Ayoka",              // One who causes joy
        
        // ===== IGBO =====
        "Ifunanya m",         // My love
        "Ola m",              // My diamond/jewel
        "Omasirim",           // My choice
        "Nkem",               // My own/mine
        "Obim",               // My heart
        "Akalaka",            // Precious one
        "Ure",                // Joy
        "Adamma",             // Beautiful girl
        "Somto",              // Join me to praise
        "Kamsiyochukwu",      // Like the way God does
        
        // ===== HAUSA =====
        "Ina sonki",          // I love you (as name)
        "Zuciyata",           // My heart
        "Rayuwata",           // My life
        "Kyakkyawa",          // Beautiful
        "Masoyita",           // My beloved
        "Rabi",               // Breeze
        "Sa'adatu",           // Happiness
        
        // ===== EFIK/IBIBIO =====
        "Ata edi",            // True love
        "Esit mi",            // My heart
        "Mfon",               // Goodness/grace
        "Idara",              // Joy/happiness
        "Ima",                // Love
        
        // ===== TIV =====
        "Ngover",             // Love
        "U sha u",            // My heart
        "U tamen u",          // My treasure
        "Dooshima",           // God's love
        "Mngusever",          // I love you
        "Tersoo",             // God's gift
        "Anyam",              // Joy
        
        // ===== URHOBO =====
        "Oma",                // Heart
        "Oghene me",          // My God
        "Omavwovwo",          // Love heart
        
        // ===== IJAW =====
        "Ayebatari",          // Blessed child
        "Tari",               // Love
        "Tarakiri",           // Love is good
        "Boma",               // My heart
        "Kuro",               // Sweet
        "Kurotamuno",         // Sweet is God
        "Tamunoibi",          // God's gift
        "Sotonye",            // God's time
        
        // ===== FULANI =====
        "Yidde",              // Love
        "Mi yidi ma",         // I love you (as name)
        "Suudu",              // Heart
        "Jawdi",              // Treasure
        "Jam",                // Peace
        "Barka",              // Blessing
        "Nafu",               // Joy
        
        // ===== NUPE =====
        "Gana",               // Love
        "Mi gana",            // My love
        "Egi mi",             // My heart
        "So mi",              // My treasure
        "Tsadu",              // Joy
        "Ndakun",             // Beautiful
        "Kuso",               // Sweet
        "Lami",               // Mine
        
        // ===== NEW ENGLISH ENDEARMENTS =====
        "My baby",            // English
        "Wifeeeeyyyy",        // Playful
        "My love",            // English
        "My heart",           // English
        
        // ===== INTERNATIONAL PET NAMES =====
        "Mon amour",          // French
        "Mi amor",            // Spanish
        "Habibti",            // Arabic
        "Jagiya",             // Korean
        "Amore mio",          // Italian
        "Mein Schatz",        // German
        "Saranghae",          // Korean
        "Je t'aime",          // French
        "Ti amo",             // Italian
        "Ich liebe dich",     // German
        "Te quiero",          // Spanish
        "Te amo",             // Spanish
        "Aishiteru",          // Japanese
        "Habibi",             // Arabic
        "Mahal kita",         // Filipino
        "Anh yêu em",         // Vietnamese
        "Chan rak khun",      // Thai
        "Szeretlek",          // Hungarian
        "Kocham cię",         // Polish
        "Jag älskar dig",     // Swedish
        "Min älskling",       // Swedish
        "Mo grá",             // Irish
        "Mo chuisle",         // Irish
        "Mo stór",            // Irish
        "Aşkım",              // Turkish
        "Canım",              // Turkish
        "Bir tanem",          // Turkish
        "Meri jaan",          // Hindi
        "Priya",              // Hindi
        "Dil"                 // Hindi
    ]
};

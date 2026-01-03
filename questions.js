/**
 * SATSA - Question Database
 * Categories: mixed, geography, history, entertainment, sports, science
 */

const QUESTIONS = {
    geography: [
        {
            question: "Vilken är Sveriges längsta flod?",
            answers: ["Dalälven", "Klarälven", "Torne älv", "Göta älv"],
            correct: 1
        },
        {
            question: "I vilket land ligger staden Marrakech?",
            answers: ["Tunisien", "Algeriet", "Marocko", "Egypten"],
            correct: 2
        },
        {
            question: "Vilken är världens största ö?",
            answers: ["Borneo", "Madagaskar", "Grönland", "Nya Guinea"],
            correct: 2
        },
        {
            question: "Vilket hav ligger mellan Europa och Afrika?",
            answers: ["Svarta havet", "Röda havet", "Medelhavet", "Adriatiska havet"],
            correct: 2
        },
        {
            question: "Vad heter Japans högsta berg?",
            answers: ["Mount Everest", "Fuji", "K2", "Kilimanjaro"],
            correct: 1
        },
        {
            question: "Vilken stad kallas 'Den eviga staden'?",
            answers: ["Aten", "Rom", "Jerusalem", "Kairo"],
            correct: 1
        },
        {
            question: "I vilket land ligger Victoriafallen?",
            answers: ["Kenya", "Sydafrika", "Zambia/Zimbabwe", "Tanzania"],
            correct: 2
        },
        {
            question: "Vilken är Australiens huvudstad?",
            answers: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
            correct: 2
        },
        {
            question: "Genom vilka tre länder rinner floden Donau INTE?",
            answers: ["Österrike", "Ungern", "Polen", "Rumänien"],
            correct: 2
        },
        {
            question: "Vilken ögrupp tillhör Teneriffa?",
            answers: ["Balearerna", "Kanarieöarna", "Azorerna", "Kapverde"],
            correct: 1
        },
        {
            question: "Vilket är världens minsta land till ytan?",
            answers: ["Monaco", "San Marino", "Vatikanstaten", "Liechtenstein"],
            correct: 2
        },
        {
            question: "I vilken stad ligger Frihetsgudinnnan?",
            answers: ["Washington D.C.", "New York", "Boston", "Philadelphia"],
            correct: 1
        },
        {
            question: "Vilken flod rinner genom Paris?",
            answers: ["Rhône", "Loire", "Seine", "Garonne"],
            correct: 2
        },
        {
            question: "Vilket land har flest tidszoner?",
            answers: ["Ryssland", "USA", "Frankrike", "Kina"],
            correct: 2
        },
        {
            question: "Vad heter Sveriges sydligaste udde?",
            answers: ["Kullen", "Smygehuk", "Falsterbo", "Sandhammaren"],
            correct: 1
        },
        {
            question: "I vilket land ligger Machu Picchu?",
            answers: ["Bolivia", "Ecuador", "Peru", "Colombia"],
            correct: 2
        },
        {
            question: "Vilken är Nordens största sjö?",
            answers: ["Mälaren", "Vänern", "Ladoga", "Vättern"],
            correct: 1
        },
        {
            question: "Vilket land gränsar till flest andra länder?",
            answers: ["Ryssland", "Kina", "Brasilien", "Indien"],
            correct: 1
        },
        {
            question: "I vilken världsdel ligger Ghana?",
            answers: ["Asien", "Sydamerika", "Afrika", "Oceanien"],
            correct: 2
        },
        {
            question: "Vad heter Storbritanniens längsta flod?",
            answers: ["Themsen", "Severn", "Trent", "Mersey"],
            correct: 1
        }
    ],
    history: [
        {
            question: "Vilket år föll Berlinmuren?",
            answers: ["1987", "1989", "1991", "1985"],
            correct: 1
        },
        {
            question: "Vem var Sveriges första kvinnliga statsminister?",
            answers: ["Anna Lindh", "Mona Sahlin", "Magdalena Andersson", "Margot Wallström"],
            correct: 2
        },
        {
            question: "Under vilken kung byggdes Versailles?",
            answers: ["Ludvig XIII", "Ludvig XIV", "Ludvig XV", "Ludvig XVI"],
            correct: 1
        },
        {
            question: "Vilket år landade människan på månen första gången?",
            answers: ["1967", "1969", "1971", "1973"],
            correct: 1
        },
        {
            question: "Vem var Roms första kejsare?",
            answers: ["Julius Caesar", "Augustus", "Nero", "Tiberius"],
            correct: 1
        },
        {
            question: "Under vilket krig användes stridsgas för första gången i stor skala?",
            answers: ["Krimkriget", "Första världskriget", "Andra världskriget", "Koreakriget"],
            correct: 1
        },
        {
            question: "Vilket år blev Sverige medlem i EU?",
            answers: ["1993", "1994", "1995", "1996"],
            correct: 2
        },
        {
            question: "Vem uppfann boktryckarkonsten i Europa?",
            answers: ["Leonardo da Vinci", "Johannes Gutenberg", "Galileo Galilei", "Martin Luther"],
            correct: 1
        },
        {
            question: "Under vilken dynasti byggdes Kinesiska muren huvudsakligen?",
            answers: ["Han-dynastin", "Tang-dynastin", "Ming-dynastin", "Qing-dynastin"],
            correct: 2
        },
        {
            question: "Vilket år ägde Stockholms blodbad rum?",
            answers: ["1510", "1520", "1530", "1540"],
            correct: 1
        },
        {
            question: "Vem var president i USA under amerikanska inbördeskriget?",
            answers: ["George Washington", "Thomas Jefferson", "Abraham Lincoln", "Ulysses S. Grant"],
            correct: 2
        },
        {
            question: "Vilken civilisation byggde pyramiderna i Giza?",
            answers: ["Sumererna", "Babylonierna", "Egyptierna", "Perserna"],
            correct: 2
        },
        {
            question: "Vilket år bildades FN?",
            answers: ["1942", "1945", "1948", "1950"],
            correct: 1
        },
        {
            question: "Vem ledde den franska revolutionen till en början?",
            answers: ["Napoleon", "Robespierre", "Marat", "Danton"],
            correct: 1
        },
        {
            question: "Under vilket århundrade levde William Shakespeare?",
            answers: ["1400-talet", "1500-talet", "1600-talet", "1700-talet"],
            correct: 1
        },
        {
            question: "Vilken stad var huvudstad i Romarriket efter Rom?",
            answers: ["Konstantinopel", "Alexandria", "Aten", "Kartago"],
            correct: 0
        },
        {
            question: "Vilket år började första världskriget?",
            answers: ["1912", "1914", "1916", "1918"],
            correct: 1
        },
        {
            question: "Vem var den sista tsaren av Ryssland?",
            answers: ["Alexander III", "Nikolaj I", "Nikolaj II", "Peter den store"],
            correct: 2
        },
        {
            question: "Under vilken epok levde dinosaurierna?",
            answers: ["Paleozoikum", "Mesozoikum", "Kenozoikum", "Prekambrium"],
            correct: 1
        },
        {
            question: "Vilket år sjönk Titanic?",
            answers: ["1910", "1912", "1914", "1916"],
            correct: 1
        }
    ],
    entertainment: [
        {
            question: "Vem skrev Harry Potter-böckerna?",
            answers: ["Stephen King", "J.R.R. Tolkien", "J.K. Rowling", "George R.R. Martin"],
            correct: 2
        },
        {
            question: "Vilken svensk artist vann Eurovision Song Contest 2012?",
            answers: ["Måns Zelmerlöw", "Loreen", "Eric Saade", "Robin Stjernberg"],
            correct: 1
        },
        {
            question: "I vilken film säger man 'Må kraften vara med dig'?",
            answers: ["Star Trek", "Star Wars", "Battlestar Galactica", "Avatar"],
            correct: 1
        },
        {
            question: "Vem spelade huvudrollen i filmen 'Forrest Gump'?",
            answers: ["Brad Pitt", "Johnny Depp", "Tom Hanks", "Leonardo DiCaprio"],
            correct: 2
        },
        {
            question: "Vilket band sjöng 'Bohemian Rhapsody'?",
            answers: ["The Beatles", "Led Zeppelin", "Queen", "Pink Floyd"],
            correct: 2
        },
        {
            question: "Vad heter karaktären som Leonardo DiCaprio spelar i Titanic?",
            answers: ["Jack Dawson", "Jack Sparrow", "Jack Ryan", "Jack Torrance"],
            correct: 0
        },
        {
            question: "Vilket år släpptes ABBA:s låt 'Dancing Queen'?",
            answers: ["1974", "1976", "1978", "1980"],
            correct: 1
        },
        {
            question: "Vem regisserade filmen 'Pulp Fiction'?",
            answers: ["Martin Scorsese", "Steven Spielberg", "Quentin Tarantino", "Christopher Nolan"],
            correct: 2
        },
        {
            question: "I vilken TV-serie medverkar karaktären Walter White?",
            answers: ["The Wire", "Breaking Bad", "Better Call Saul", "Ozark"],
            correct: 1
        },
        {
            question: "Vem skrev 'Pippi Långstrump'?",
            answers: ["Elsa Beskow", "Selma Lagerlöf", "Astrid Lindgren", "Tove Jansson"],
            correct: 2
        },
        {
            question: "Vilket år grundades Spotify?",
            answers: ["2004", "2006", "2008", "2010"],
            correct: 1
        },
        {
            question: "Vem sjöng 'Thriller'?",
            answers: ["Prince", "Michael Jackson", "Stevie Wonder", "Whitney Houston"],
            correct: 1
        },
        {
            question: "I vilken stad utspelar sig TV-serien 'Friends'?",
            answers: ["Los Angeles", "Chicago", "New York", "Boston"],
            correct: 2
        },
        {
            question: "Vem spelar Iron Man i Marvel-filmerna?",
            answers: ["Chris Evans", "Chris Hemsworth", "Robert Downey Jr.", "Mark Ruffalo"],
            correct: 2
        },
        {
            question: "Vilket band hade hits med 'Smells Like Teen Spirit'?",
            answers: ["Pearl Jam", "Nirvana", "Soundgarden", "Alice in Chains"],
            correct: 1
        },
        {
            question: "Vad heter Sveriges mest sedda film genom tiderna?",
            answers: ["Hundraåringen", "Jägarna", "Sällskapsresan", "Ronja Rövardotter"],
            correct: 2
        },
        {
            question: "Vem skrev romanen '1984'?",
            answers: ["Aldous Huxley", "George Orwell", "Ray Bradbury", "Arthur C. Clarke"],
            correct: 1
        },
        {
            question: "I vilken fantasybok finns 'Härskarringen'?",
            answers: ["Narnia", "Sagan om Ringen", "Harry Potter", "Game of Thrones"],
            correct: 1
        },
        {
            question: "Vilken svensk artist har sålt flest skivor internationellt?",
            answers: ["Roxette", "ABBA", "Robyn", "Avicii"],
            correct: 1
        },
        {
            question: "Vem skapade musfiguren Musse Pigg?",
            answers: ["Walt Disney", "Chuck Jones", "Tex Avery", "Ub Iwerks"],
            correct: 0
        }
    ],
    sports: [
        {
            question: "Vilket land har vunnit flest VM i fotboll (herrar)?",
            answers: ["Tyskland", "Argentina", "Brasilien", "Italien"],
            correct: 2
        },
        {
            question: "I vilken sport tävlar man om Stanley Cup?",
            answers: ["Basket", "Ishockey", "Amerikansk fotboll", "Baseball"],
            correct: 1
        },
        {
            question: "Hur många spelare finns det i ett basketlag på planen?",
            answers: ["4", "5", "6", "7"],
            correct: 1
        },
        {
            question: "Vem har flest Grand Slam-titlar i herrtennis (alla tiders)?",
            answers: ["Roger Federer", "Rafael Nadal", "Novak Djokovic", "Pete Sampras"],
            correct: 2
        },
        {
            question: "I vilken stad spelades sommar-OS 2012?",
            answers: ["Peking", "London", "Rio de Janeiro", "Tokyo"],
            correct: 1
        },
        {
            question: "Vilket lag har vunnit flest Champions League-titlar?",
            answers: ["Barcelona", "Real Madrid", "AC Milan", "Bayern München"],
            correct: 1
        },
        {
            question: "Hur långt är ett maratonlopp?",
            answers: ["40,195 km", "42,195 km", "44,195 km", "45 km"],
            correct: 1
        },
        {
            question: "Vilket svenskt fotbollslag har flest SM-guld?",
            answers: ["AIK", "Malmö FF", "IFK Göteborg", "Djurgårdens IF"],
            correct: 1
        },
        {
            question: "I vilken sport används termen 'hole in one'?",
            answers: ["Bowling", "Golf", "Biljard", "Dart"],
            correct: 1
        },
        {
            question: "Vem är den mest framgångsrika OS-deltagaren genom tiderna?",
            answers: ["Usain Bolt", "Carl Lewis", "Michael Phelps", "Mark Spitz"],
            correct: 2
        },
        {
            question: "Hur ofta hålls fotbolls-VM?",
            answers: ["Vart 2:a år", "Vart 3:e år", "Vart 4:e år", "Vart 5:e år"],
            correct: 2
        },
        {
            question: "Vilket land kommer tennisspelaren Björn Borg ifrån?",
            answers: ["Norge", "Danmark", "Sverige", "Finland"],
            correct: 2
        },
        {
            question: "I vilken sport tävlar man i Tour de France?",
            answers: ["Löpning", "Cykling", "Skidåkning", "Simning"],
            correct: 1
        },
        {
            question: "Hur många perioder spelas i en ishockeymatch?",
            answers: ["2", "3", "4", "5"],
            correct: 1
        },
        {
            question: "Vilket land vann fotbolls-VM 2022?",
            answers: ["Frankrike", "Brasilien", "Argentina", "Kroatien"],
            correct: 2
        },
        {
            question: "Vad kallas det när en bowlare fäller alla käglor på första kastet?",
            answers: ["Spare", "Strike", "Split", "Perfect"],
            correct: 1
        },
        {
            question: "Vilken sport förknippas med Wimbledon?",
            answers: ["Golf", "Polo", "Tennis", "Cricket"],
            correct: 2
        },
        {
            question: "Hur många poäng ger en touchdown i amerikansk fotboll?",
            answers: ["5", "6", "7", "8"],
            correct: 1
        },
        {
            question: "Vilket land har vunnit flest VM-guld i ishockey (herrar)?",
            answers: ["Sverige", "Ryssland/Sovjetunionen", "Kanada", "Finland"],
            correct: 2
        },
        {
            question: "I vilken stad har AIK sin hemmaarena?",
            answers: ["Göteborg", "Malmö", "Stockholm", "Uppsala"],
            correct: 2
        }
    ],
    science: [
        {
            question: "Vad är den kemiska beteckningen för vatten?",
            answers: ["CO2", "H2O", "O2", "NaCl"],
            correct: 1
        },
        {
            question: "Vilken planet är närmast solen?",
            answers: ["Venus", "Mars", "Merkurius", "Jorden"],
            correct: 2
        },
        {
            question: "Hur många ben har en spindel?",
            answers: ["6", "8", "10", "12"],
            correct: 1
        },
        {
            question: "Vad mäts i Kelvin?",
            answers: ["Tryck", "Temperatur", "Ljusstyrka", "Strålning"],
            correct: 1
        },
        {
            question: "Vilket grundämne har symbolen Fe?",
            answers: ["Fluor", "Fosfor", "Järn", "Francium"],
            correct: 2
        },
        {
            question: "Hur många kromosomer har en människa normalt?",
            answers: ["23", "44", "46", "48"],
            correct: 2
        },
        {
            question: "Vad heter den största planeten i vårt solsystem?",
            answers: ["Saturnus", "Uranus", "Jupiter", "Neptunus"],
            correct: 2
        },
        {
            question: "Vem formulerade relativitetsteorin?",
            answers: ["Isaac Newton", "Albert Einstein", "Stephen Hawking", "Niels Bohr"],
            correct: 1
        },
        {
            question: "Vilken gas utgör störst andel av jordens atmosfär?",
            answers: ["Syre", "Kväve", "Koldioxid", "Argon"],
            correct: 1
        },
        {
            question: "Vad kallas studiet av fossiler?",
            answers: ["Arkeologi", "Geologi", "Paleontologi", "Biologi"],
            correct: 2
        },
        {
            question: "Hur lång tid tar det för ljuset att nå jorden från solen?",
            answers: ["8 sekunder", "8 minuter", "8 timmar", "8 dagar"],
            correct: 1
        },
        {
            question: "Vilket organ producerar insulin?",
            answers: ["Levern", "Njurarna", "Bukspottkörteln", "Mjälten"],
            correct: 2
        },
        {
            question: "Vad är atomnumret för kol?",
            answers: ["4", "6", "8", "12"],
            correct: 1
        },
        {
            question: "Vilken enhet mäter elektrisk ström?",
            answers: ["Volt", "Watt", "Ohm", "Ampere"],
            correct: 3
        },
        {
            question: "Hur många tänder har en vuxen människa normalt?",
            answers: ["28", "30", "32", "34"],
            correct: 2
        },
        {
            question: "Vad kallas den process där växter omvandlar solljus till energi?",
            answers: ["Respiration", "Fotosyntes", "Metabolism", "Osmos"],
            correct: 1
        },
        {
            question: "Vilken vetenskapsman upptäckte penicillinet?",
            answers: ["Louis Pasteur", "Alexander Fleming", "Joseph Lister", "Robert Koch"],
            correct: 1
        },
        {
            question: "Vad är det hårdaste naturliga materialet på jorden?",
            answers: ["Kvarts", "Rubin", "Diamant", "Safir"],
            correct: 2
        },
        {
            question: "Hur många planeter finns i vårt solsystem?",
            answers: ["7", "8", "9", "10"],
            correct: 1
        },
        {
            question: "Vilken blodtyp är universell givare?",
            answers: ["A", "B", "AB", "O negativ"],
            correct: 3
        }
    ],
    mixed: []
};

// Populate mixed category with questions from all categories
function populateMixedCategory() {
    const categories = ['geography', 'history', 'entertainment', 'sports', 'science'];
    categories.forEach(cat => {
        QUESTIONS.mixed.push(...QUESTIONS[cat].map(q => ({...q, category: cat})));
    });
}

populateMixedCategory();

// Category display names
const CATEGORY_NAMES = {
    mixed: 'Blandat',
    geography: 'Geografi',
    history: 'Historia',
    entertainment: 'Nöje',
    sports: 'Sport',
    science: 'Vetenskap'
};

// Category icons
const CATEGORY_ICONS = {
    mixed: '🎲',
    geography: '🌍',
    history: '📜',
    entertainment: '🎬',
    sports: '⚽',
    science: '🔬'
};

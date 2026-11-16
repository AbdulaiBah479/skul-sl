// Free resources, grouped by category. Links point to each organisation's own site; terms and availability can change.
// `npm run check:links` visits every URL and reports the ones that no longer answer.
export type Cat =
  | "Start here"
  | "Full courses"
  | "Textbooks & notes"
  | "Maths & science"
  | "Exam prep"
  | "Health & medicine"
  | "Technology & coding"
  | "Business & skills"
  | "English & writing"
  | "Reading"
  | "Research & university"
  | "Offline"
  | "GitHub repos"
  | "Free APIs";

export interface Resource {
  name: string;
  url: string;
  what: string;
  cat: Cat;
  tags: string[];
}

export const CATS: Cat[] = [
  "Start here", "Full courses", "Textbooks & notes", "Maths & science", "Exam prep", "Health & medicine", "Technology & coding",
  "Business & skills", "English & writing", "Reading", "Research & university", "Offline", "GitHub repos", "Free APIs",
];

export const RESOURCES: Resource[] = [
  // ---- Start here
  { cat: "Start here", name: "UNICEF Learning Passport", url: "https://www.unicef.org/learningpassport", what: "Curriculum-aligned lessons; Sierra Leone's national platform also hosts past national exam papers.", tags: ["sierra leone", "exam", "primary", "jss", "sss"] },
  { cat: "Start here", name: "Khan Academy", url: "https://www.khanacademy.org", what: "Free video lessons and exercises: maths, science, economics, grammar, computing and more.", tags: ["video", "maths", "science", "all"] },
  { cat: "Start here", name: "Sierra Leone Ministry of Basic and Senior Secondary Education", url: "https://mbsse.gov.sl", what: "Official source for the national curriculum, circulars and notices.", tags: ["sierra leone", "official"] },
  { cat: "Start here", name: "Class Central", url: "https://www.classcentral.com", what: "Search engine for free online courses from hundreds of universities.", tags: ["courses", "university"] },
  { cat: "Start here", name: "OER Commons", url: "https://oercommons.org", what: "Library of open educational resources for every level.", tags: ["reference", "teachers"] },
  { cat: "Start here", name: "Open Culture", url: "https://www.openculture.com", what: "Free courses, ebooks, audiobooks and movies, collected from around the web.", tags: ["courses", "books"] },

  // ---- Full courses
  { cat: "Full courses", name: "Coursera (audit for free)", url: "https://www.coursera.org", what: "University courses. Many can be audited free; look for 'Audit' or apply for financial aid.", tags: ["university", "courses"] },
  { cat: "Full courses", name: "edX (audit for free)", url: "https://www.edx.org", what: "Courses from top universities, free to audit.", tags: ["university", "courses"] },
  { cat: "Full courses", name: "MIT OpenCourseWare", url: "https://ocw.mit.edu", what: "Lecture notes, videos and problem sets from real MIT courses.", tags: ["university", "video", "engineering"] },
  { cat: "Full courses", name: "Open Yale Courses", url: "https://oyc.yale.edu", what: "Free recorded Yale lectures in law, economics, sciences and humanities.", tags: ["university", "video", "law"] },
  { cat: "Full courses", name: "OpenLearn (Open University, UK)", url: "https://www.open.edu/openlearn/", what: "Free short courses with statements of participation.", tags: ["university", "courses"] },
  { cat: "Full courses", name: "Saylor Academy", url: "https://www.saylor.org", what: "Free self-paced college courses with free certificates.", tags: ["university", "courses", "business"] },
  { cat: "Full courses", name: "Alison", url: "https://alison.com", what: "Free diploma and certificate courses in skills, business and IT.", tags: ["courses", "skills", "tech"] },
  { cat: "Full courses", name: "FutureLearn (free access)", url: "https://www.futurelearn.com", what: "Short courses from UK and global universities.", tags: ["courses", "university"] },
  { cat: "Full courses", name: "Stanford Online", url: "https://online.stanford.edu", what: "Free and open Stanford courses.", tags: ["university", "courses"] },
  { cat: "Full courses", name: "NPTEL", url: "https://nptel.ac.in", what: "Free engineering and science lectures from India's top institutes.", tags: ["engineering", "university", "video"] },
  { cat: "Full courses", name: "African Virtual University", url: "https://avu.org", what: "Open, distance and e-learning for African students.", tags: ["africa", "university"] },

  // ---- Textbooks & notes
  { cat: "Textbooks & notes", name: "OpenStax", url: "https://openstax.org", what: "Free peer-reviewed textbooks for school and college.", tags: ["books", "university", "sss"] },
  { cat: "Textbooks & notes", name: "LibreTexts", url: "https://libretexts.org", what: "Open textbooks for chemistry, physics, maths, biology, engineering and more.", tags: ["books", "university"] },
  { cat: "Textbooks & notes", name: "CK-12", url: "https://www.ck12.org", what: "Free textbooks (FlexBooks), simulations and practice for maths and science.", tags: ["maths", "science", "books", "sss", "jss"] },
  { cat: "Textbooks & notes", name: "Open Textbook Library", url: "https://open.umn.edu/opentextbooks", what: "Hundreds of free, openly licensed college textbooks.", tags: ["books", "university"] },
  { cat: "Textbooks & notes", name: "Wikibooks", url: "https://en.wikibooks.org", what: "Free textbooks written by volunteers.", tags: ["books", "reference"] },
  { cat: "Textbooks & notes", name: "Curriki", url: "https://www.curriki.org", what: "Free lesson plans and materials that teachers can adapt.", tags: ["teachers", "primary", "jss"] },

  // ---- Maths & science
  { cat: "Maths & science", name: "PhET Simulations", url: "https://phet.colorado.edu", what: "Interactive physics, chemistry, biology and maths simulations; many can be downloaded.", tags: ["science", "interactive", "sss"] },
  { cat: "Maths & science", name: "GeoGebra", url: "https://www.geogebra.org", what: "Graphing, geometry and calculus tools.", tags: ["maths", "interactive"] },
  { cat: "Maths & science", name: "Desmos", url: "https://www.desmos.com", what: "Free online graphing calculator.", tags: ["maths", "interactive"] },
  { cat: "Maths & science", name: "Math is Fun", url: "https://www.mathsisfun.com", what: "Simple, clear explanations of maths from primary to college.", tags: ["maths", "primary", "jss"] },
  { cat: "Maths & science", name: "Paul's Online Math Notes", url: "https://tutorial.math.lamar.edu", what: "Algebra, calculus and differential equations notes with worked examples.", tags: ["maths", "university"] },
  { cat: "Maths & science", name: "3Blue1Brown", url: "https://www.3blue1brown.com", what: "Beautiful visual explanations of maths ideas.", tags: ["maths", "video"] },
  { cat: "Maths & science", name: "HyperPhysics", url: "http://hyperphysics.phy-astr.gsu.edu", what: "Concept maps and explanations for physics.", tags: ["science", "physics"] },
  { cat: "Maths & science", name: "Chemguide", url: "https://www.chemguide.co.uk", what: "Clear chemistry notes for school and first-year university.", tags: ["science", "chemistry", "sss"] },
  { cat: "Maths & science", name: "Crash Course (YouTube)", url: "https://www.youtube.com/@crashcourse", what: "Fast, friendly video courses in science, history, economics and more.", tags: ["video", "science"] },
  { cat: "Maths & science", name: "NASA STEM", url: "https://www.nasa.gov/learning-resources/", what: "Free space and science resources for students and teachers.", tags: ["science"] },
  { cat: "Maths & science", name: "Falstad Circuit Simulator", url: "https://www.falstad.com/circuit/", what: "Build and run electric circuits in your browser.", tags: ["engineering", "physics", "electrical"] },
  { cat: "Maths & science", name: "Tinkercad", url: "https://www.tinkercad.com", what: "Free 3D design, circuits and basic coding.", tags: ["engineering", "tech", "electrical"] },

  // ---- Exam prep
  { cat: "Exam prep", name: "WAEC International", url: "https://waecinternational.org", what: "Official site of the West African Examinations Council: syllabuses, notices and results information.", tags: ["exam", "wassce", "bece", "official"] },
  { cat: "Exam prep", name: "Afrilearn", url: "https://www.myafrilearn.com", what: "Free lessons and practice tests for BECE, WASSCE and other West African exams.", tags: ["exam", "africa", "sss", "jss"] },
  { cat: "Exam prep", name: "uLesson", url: "https://ulesson.com", what: "Curriculum-aligned video lessons for West African exams; some features are paid.", tags: ["exam", "africa", "video"] },
  { cat: "Exam prep", name: "BBC Bitesize", url: "https://www.bbc.co.uk/bitesize", what: "Short revision guides and quizzes for primary and secondary subjects.", tags: ["exam", "primary", "jss", "sss"] },
  { cat: "Exam prep", name: "Save My Exams (free notes)", url: "https://www.savemyexams.com", what: "Revision notes and past-paper style resources; some content is paid.", tags: ["exam", "sss"] },
  { cat: "Exam prep", name: "Quizlet", url: "https://quizlet.com", what: "Search millions of free flashcard sets made by students.", tags: ["study", "flashcards"] },

  // ---- Health & medicine
  { cat: "Health & medicine", name: "Hesperian Health Guides", url: "https://hesperian.org", what: "Free practical health books for communities, including 'Where There Is No Doctor'.", tags: ["health", "africa"] },
  { cat: "Health & medicine", name: "OpenWHO", url: "https://openwho.org", what: "Free WHO courses on outbreaks, infection control and emergencies.", tags: ["health", "courses"] },
  { cat: "Health & medicine", name: "MedlinePlus", url: "https://medlineplus.gov", what: "Trusted plain-language health information from the US National Library of Medicine.", tags: ["health", "reference"] },
  { cat: "Health & medicine", name: "TeachMeAnatomy", url: "https://teachmeanatomy.info", what: "Clear anatomy notes and diagrams.", tags: ["health", "university"] },
  { cat: "Health & medicine", name: "Geeky Medics", url: "https://geekymedics.com", what: "Clinical skills guides and OSCE revision.", tags: ["health", "university", "nursing"] },
  { cat: "Health & medicine", name: "PubMed", url: "https://pubmed.ncbi.nlm.nih.gov", what: "Search biomedical research; many articles are free in full.", tags: ["research", "health", "university"] },
  { cat: "Health & medicine", name: "Research4Life (HINARI)", url: "https://www.research4life.org", what: "Free or low-cost journals for institutions in eligible countries. Ask your librarian to register.", tags: ["university", "research", "health", "agriculture"] },

  // ---- Technology & coding
  { cat: "Technology & coding", name: "freeCodeCamp", url: "https://www.freecodecamp.org", what: "Learn web development, data and programming with free certificates.", tags: ["computing", "tech", "uni"] },
  { cat: "Technology & coding", name: "CS50 (Harvard)", url: "https://cs50.harvard.edu", what: "Famous free introduction to computer science.", tags: ["computing", "uni"] },
  { cat: "Technology & coding", name: "The Odin Project", url: "https://www.theodinproject.com", what: "Free full-stack web development curriculum.", tags: ["computing", "tech"] },
  { cat: "Technology & coding", name: "MDN Web Docs", url: "https://developer.mozilla.org", what: "The reference for HTML, CSS and JavaScript.", tags: ["computing", "tech"] },
  { cat: "Technology & coding", name: "W3Schools", url: "https://www.w3schools.com", what: "Beginner tutorials for HTML, CSS, JavaScript, Python, SQL and more.", tags: ["computing", "tech"] },
  { cat: "Technology & coding", name: "Python.org tutorial", url: "https://docs.python.org/3/tutorial/", what: "The official free Python tutorial.", tags: ["computing", "tech"] },
  { cat: "Technology & coding", name: "Scratch", url: "https://scratch.mit.edu", what: "Learn coding by snapping blocks together.", tags: ["computing", "primary", "jss"] },
  { cat: "Technology & coding", name: "Code.org", url: "https://code.org", what: "Free coding lessons for beginners of all ages.", tags: ["computing", "primary", "jss"] },
  { cat: "Technology & coding", name: "Microsoft Learn", url: "https://learn.microsoft.com/training/", what: "Free learning paths for Microsoft tools, Azure, data and AI.", tags: ["tech", "courses"] },
  { cat: "Technology & coding", name: "Cisco Networking Academy", url: "https://www.netacad.com", what: "Free networking, cybersecurity and IT courses.", tags: ["tech", "courses", "tvet"] },
  { cat: "Technology & coding", name: "Grow with Google", url: "https://grow.google", what: "Free digital skills training.", tags: ["tech", "skills"] },
  { cat: "Technology & coding", name: "Kaggle Learn", url: "https://www.kaggle.com/learn", what: "Free short courses in Python, data science and machine learning.", tags: ["computing", "data"] },

  // ---- Business & skills
  { cat: "Business & skills", name: "FAO eLearning Academy", url: "https://elearning.fao.org", what: "Free courses on agriculture, food security and farming practice.", tags: ["agriculture", "tvet", "courses"] },
  { cat: "Business & skills", name: "Investopedia", url: "https://www.investopedia.com", what: "Plain explanations of economics, finance and accounting terms.", tags: ["business", "economics"] },
  { cat: "Business & skills", name: "Coursera: Financial Markets (Yale, audit)", url: "https://www.coursera.org/learn/financial-markets-global", what: "Free-to-audit finance course from a Yale professor.", tags: ["business", "economics", "university"] },
  { cat: "Business & skills", name: "LibreOffice", url: "https://www.libreoffice.org", what: "Free office suite: documents, spreadsheets and slides.", tags: ["tools", "tech"] },

  // ---- English & writing
  { cat: "English & writing", name: "BBC Learning English", url: "https://www.bbc.co.uk/learningenglish", what: "Free lessons, vocabulary and grammar.", tags: ["english", "language"] },
  { cat: "English & writing", name: "British Council LearnEnglish", url: "https://learnenglish.britishcouncil.org", what: "Free English practice at every level.", tags: ["english", "language"] },
  { cat: "English & writing", name: "Purdue OWL", url: "https://owl.purdue.edu/owl/", what: "Writing guides, grammar and referencing styles (APA, MLA, Chicago).", tags: ["english", "writing", "university"] },
  { cat: "English & writing", name: "Duolingo", url: "https://www.duolingo.com", what: "Free language learning, including French and Spanish.", tags: ["language"] },
  { cat: "English & writing", name: "Grammarly (free checker)", url: "https://www.grammarly.com", what: "Free spelling and grammar checker.", tags: ["english", "writing"] },

  // ---- Reading
  { cat: "Reading", name: "African Storybook", url: "https://africanstorybook.org", what: "Free children's stories in many African languages and English.", tags: ["primary", "reading"] },
  { cat: "Reading", name: "Project Gutenberg", url: "https://www.gutenberg.org", what: "70,000+ free classic books, including literature set texts.", tags: ["books", "literature"] },
  { cat: "Reading", name: "Open Library", url: "https://openlibrary.org", what: "Borrow digital books free (free account).", tags: ["books"] },
  { cat: "Reading", name: "Internet Archive", url: "https://archive.org", what: "Millions of free books, audio and videos.", tags: ["books", "video"] },
  { cat: "Reading", name: "Standard Ebooks", url: "https://standardebooks.org", what: "Beautifully formatted free public-domain books.", tags: ["books", "literature"] },
  { cat: "Reading", name: "LibriVox", url: "https://librivox.org", what: "Free audiobooks read by volunteers; good for listening on a phone.", tags: ["books", "audio"] },
  { cat: "Reading", name: "Wikipedia", url: "https://www.wikipedia.org", what: "Free encyclopedia. Start here, then check the sources.", tags: ["reference"] },

  // ---- Research & university
  { cat: "Research & university", name: "Google Scholar", url: "https://scholar.google.com", what: "Search scholarly articles. Look for [PDF] links on the right.", tags: ["research", "university"] },
  { cat: "Research & university", name: "DOAJ", url: "https://doaj.org", what: "Directory of open-access journals.", tags: ["research", "university"] },
  { cat: "Research & university", name: "arXiv", url: "https://arxiv.org", what: "Free preprints in maths, physics, computing and more.", tags: ["research", "university"] },
  { cat: "Research & university", name: "OpenAlex", url: "https://openalex.org", what: "Open catalogue of scholarly papers, authors and journals.", tags: ["research", "university"] },
  { cat: "Research & university", name: "CORE", url: "https://core.ac.uk", what: "Millions of open-access research papers.", tags: ["research", "university"] },
  { cat: "Research & university", name: "Unpaywall", url: "https://unpaywall.org", what: "Finds a legal free copy of research papers.", tags: ["research", "university"] },
  { cat: "Research & university", name: "Zotero", url: "https://www.zotero.org", what: "Free reference manager for essays and theses.", tags: ["university", "research", "tools"] },
  { cat: "Research & university", name: "Anki", url: "https://apps.ankiweb.net", what: "Free flashcard app with spaced repetition (works offline).", tags: ["study", "tools"] },
  { cat: "Research & university", name: "Overleaf", url: "https://www.overleaf.com", what: "Free online LaTeX editor for reports and theses.", tags: ["university", "writing", "tools"] },

  // ---- Offline
  { cat: "Offline", name: "Kolibri (Learning Equality)", url: "https://learningequality.org/kolibri/", what: "Offline-first learning platform with Khan Academy and other content, built for places with poor internet. Schools can run it on a local server.", tags: ["offline", "schools", "africa"] },
  { cat: "Offline", name: "Kiwix", url: "https://www.kiwix.org", what: "Download Wikipedia and other libraries to read with no internet.", tags: ["offline", "reference"] },
  { cat: "Offline", name: "PhET offline simulations", url: "https://phet.colorado.edu/en/offline-access", what: "Download simulations to use without internet.", tags: ["offline", "science"] },
  { cat: "Offline", name: "Khan Academy Lite", url: "https://www.khanacademy.org/khan-academy-lite", what: "Khan Academy for slow connections.", tags: ["offline", "video"] },

  // ---- GitHub repos
  { cat: "GitHub repos", name: "EbookFoundation/free-programming-books", url: "https://github.com/EbookFoundation/free-programming-books", what: "Huge list of free books, courses and cheat sheets in many languages.", tags: ["github", "computing", "books"] },
  { cat: "GitHub repos", name: "freeCodeCamp/freeCodeCamp", url: "https://github.com/freeCodeCamp/freeCodeCamp", what: "The full open-source curriculum behind freeCodeCamp.", tags: ["github", "computing"] },
  { cat: "GitHub repos", name: "TheOdinProject/curriculum", url: "https://github.com/TheOdinProject/curriculum", what: "The Odin Project's open curriculum.", tags: ["github", "computing"] },
  { cat: "GitHub repos", name: "kamranahmedse/developer-roadmap", url: "https://github.com/kamranahmedse/developer-roadmap", what: "Step-by-step roadmaps for becoming a developer.", tags: ["github", "computing"] },
  { cat: "GitHub repos", name: "ossu/computer-science", url: "https://github.com/ossu/computer-science", what: "Free self-taught computer-science degree path.", tags: ["github", "computing", "university"] },
  { cat: "GitHub repos", name: "ossu/math", url: "https://github.com/ossu/math", what: "Free self-taught mathematics curriculum.", tags: ["github", "maths", "university"] },
  { cat: "GitHub repos", name: "practical-tutorials/project-based-learning", url: "https://github.com/practical-tutorials/project-based-learning", what: "Learn programming by building projects.", tags: ["github", "computing"] },
  { cat: "GitHub repos", name: "Developer-Y/cs-video-courses", url: "https://github.com/Developer-Y/cs-video-courses", what: "List of university computer-science video courses.", tags: ["github", "computing", "video"] },
  { cat: "GitHub repos", name: "jwasham/coding-interview-university", url: "https://github.com/jwasham/coding-interview-university", what: "Study plan for software engineering job interviews.", tags: ["github", "computing"] },
  { cat: "GitHub repos", name: "ripienaar/free-for-dev", url: "https://github.com/ripienaar/free-for-dev", what: "Free tiers of cloud and developer services.", tags: ["github", "tech"] },
  { cat: "GitHub repos", name: "sindresorhus/awesome", url: "https://github.com/sindresorhus/awesome", what: "The master list of 'awesome' curated lists on every topic.", tags: ["github", "reference"] },
  { cat: "GitHub repos", name: "public-apis/public-apis", url: "https://github.com/public-apis/public-apis", what: "Large list of free APIs, including education, science and books.", tags: ["github", "api"] },
  { cat: "GitHub repos", name: "learning-equality/kolibri", url: "https://github.com/learningequality/kolibri", what: "Source code of the offline learning platform Kolibri.", tags: ["github", "offline", "schools"] },

  // ---- Free APIs (for developers, and used inside this app where marked)
  { cat: "Free APIs", name: "Wikipedia REST API (used in Explore)", url: "https://en.wikipedia.org/api/rest_v1/", what: "Page summaries and content, no key.", tags: ["api"] },
  { cat: "Free APIs", name: "Free Dictionary API (used in Explore)", url: "https://dictionaryapi.dev", what: "Definitions, phonetics and examples, no key.", tags: ["api", "english"] },
  { cat: "Free APIs", name: "Gutendex (used in Explore)", url: "https://gutendex.com", what: "JSON API for the Project Gutenberg catalogue, no key.", tags: ["api", "books"] },
  { cat: "Free APIs", name: "Open Trivia DB (used in Trivia)", url: "https://opentdb.com/api_config.php", what: "Free trivia questions in many categories, no key.", tags: ["api", "quiz"] },
  { cat: "Free APIs", name: "Open Library API", url: "https://openlibrary.org/developers/api", what: "Book search and covers, no key.", tags: ["api", "books"] },
  { cat: "Free APIs", name: "REST Countries", url: "https://restcountries.com", what: "Data on every country: capital, population, languages, flags.", tags: ["api", "geography"] },
  { cat: "Free APIs", name: "World Bank Open Data API", url: "https://datahelpdesk.worldbank.org/knowledgebase/topics/125589-developer-information", what: "Development data (population, economy, education) for all countries.", tags: ["api", "data", "economics"] },
  { cat: "Free APIs", name: "Open-Meteo", url: "https://open-meteo.com", what: "Free weather and climate data, no key.", tags: ["api", "geography", "science"] },
  { cat: "Free APIs", name: "NASA Open APIs", url: "https://api.nasa.gov", what: "Space images, asteroids and Earth data (free key).", tags: ["api", "science"] },
  { cat: "Free APIs", name: "OpenAlex API", url: "https://docs.openalex.org", what: "Scholarly works, authors and journals as JSON, no key.", tags: ["api", "research"] },
  { cat: "Free APIs", name: "Crossref API", url: "https://www.crossref.org/documentation/retrieve-metadata/rest-api/", what: "Look up papers and references by DOI.", tags: ["api", "research"] },
  { cat: "Free APIs", name: "PubChem PUG REST", url: "https://pubchem.ncbi.nlm.nih.gov/docs/pug-rest", what: "Chemical compound data, no key.", tags: ["api", "chemistry", "science"] },
  { cat: "Free APIs", name: "Google AI Studio (Gemini free tier)", url: "https://aistudio.google.com/apikey", what: "Free API key for the AI tutor in this app.", tags: ["api", "ai"] },
  { cat: "Free APIs", name: "Groq (free tier)", url: "https://console.groq.com/keys", what: "Free, fast AI API key for the AI tutor in this app.", tags: ["api", "ai"] },
];

export interface Scholarship {
  name: string;
  url: string;
  what: string;
}
export const SCHOLARSHIPS: Scholarship[] = [
  { name: "Chevening (UK)", url: "https://www.chevening.org", what: "UK government scholarships for one-year master's study." },
  { name: "Commonwealth Scholarships (UK)", url: "https://cscuk.fcdo.gov.uk", what: "Master's and PhD study for Commonwealth citizens." },
  { name: "Mastercard Foundation Scholars Program", url: "https://mastercardfdn.org/all/scholars/", what: "Scholarships for African students at partner universities. Check partners and eligibility." },
  { name: "Fulbright (USA)", url: "https://foreign.fulbrightonline.org", what: "Graduate study and research in the US. Apply through your country's programme." },
  { name: "DAAD (Germany)", url: "https://www.daad.de/en/", what: "German government scholarships for master's and doctoral study." },
  { name: "Erasmus Mundus (Europe)", url: "https://erasmus-plus.ec.europa.eu", what: "Joint master's programmes with scholarships." },
  { name: "Türkiye Scholarships", url: "https://turkiyeburslari.gov.tr", what: "Fully funded study in Türkiye at all levels." },
  { name: "Chinese Government Scholarships (CSC)", url: "https://www.campuschina.org", what: "Study in China at bachelor's, master's and PhD levels." },
  { name: "Aga Khan Foundation scholarships", url: "https://www.akdn.org", what: "Partial funding for postgraduate study; check the current call." },
  { name: "Gates Cambridge", url: "https://www.gatescambridge.org", what: "Full-cost postgraduate scholarships at Cambridge." },
];

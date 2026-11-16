// Free resources. Links point to each organisation's main site; check each site for current terms.
export interface Resource {
  name: string;
  url: string;
  what: string;
  tags: string[];
}

export const RESOURCES: Resource[] = [
  // Whole-curriculum learning
  { name: "Khan Academy", url: "https://www.khanacademy.org", what: "Free video lessons and exercises: maths, science, economics and more.", tags: ["video", "maths", "science", "all"] },
  { name: "UNICEF Learning Passport", url: "https://www.learningpassport.unicef.org", what: "Curriculum-aligned content; Sierra Leone's national platform also hosts past papers.", tags: ["sierra leone", "exam", "primary", "jss", "sss"] },
  { name: "CK-12", url: "https://www.ck12.org", what: "Free textbooks and simulations for maths and science.", tags: ["maths", "science", "books"] },
  { name: "OpenStax", url: "https://openstax.org", what: "Free peer-reviewed college and high-school textbooks.", tags: ["books", "university", "sss"] },
  { name: "LibreTexts", url: "https://libretexts.org", what: "Open textbooks for chemistry, physics, maths, engineering and more.", tags: ["books", "university"] },
  { name: "MIT OpenCourseWare", url: "https://ocw.mit.edu", what: "Free lecture notes, videos and problem sets from MIT courses.", tags: ["university", "video", "engineering"] },
  { name: "Coursera (audit for free)", url: "https://www.coursera.org", what: "University courses; many can be audited free (certificate costs extra). Look for 'Audit' or financial aid.", tags: ["university", "courses"] },
  { name: "edX (audit for free)", url: "https://www.edx.org", what: "Courses from top universities, free to audit.", tags: ["university", "courses"] },
  // Interactive
  { name: "PhET Simulations", url: "https://phet.colorado.edu", what: "Interactive physics, chemistry, biology and maths simulations (many download for offline use).", tags: ["science", "interactive", "sss"] },
  { name: "GeoGebra", url: "https://www.geogebra.org", what: "Free graphing, geometry and calculus tools.", tags: ["maths", "interactive"] },
  { name: "Desmos", url: "https://www.desmos.com", what: "Free online graphing calculator.", tags: ["maths", "interactive"] },
  // Reading
  { name: "African Storybook", url: "https://africanstorybook.org", what: "Free children's stories in many African languages and English.", tags: ["primary", "reading"] },
  { name: "Project Gutenberg", url: "https://www.gutenberg.org", what: "70,000+ free classic books (literature set texts and more).", tags: ["books", "literature"] },
  { name: "Open Library", url: "https://openlibrary.org", what: "Borrow digital books free; free account needed.", tags: ["books"] },
  { name: "Internet Archive", url: "https://archive.org", what: "Millions of free books, audio and videos.", tags: ["books", "video"] },
  { name: "Wikipedia", url: "https://www.wikipedia.org", what: "Free encyclopedia. Use it to start, then check the sources.", tags: ["reference"] },
  { name: "Kiwix", url: "https://www.kiwix.org", what: "Download Wikipedia and other libraries to read with no internet.", tags: ["offline", "reference"] },
  // Skills
  { name: "freeCodeCamp", url: "https://www.freecodecamp.org", what: "Learn web development, data and programming free.", tags: ["computing", "tech", "uni"] },
  { name: "CS50 (Harvard)", url: "https://cs50.harvard.edu", what: "Free introduction to computer science.", tags: ["computing", "uni"] },
  { name: "MDN Web Docs", url: "https://developer.mozilla.org", what: "The reference for HTML, CSS and JavaScript.", tags: ["computing", "tech"] },
  { name: "Scratch", url: "https://scratch.mit.edu", what: "Learn coding by snapping blocks together. Great for beginners.", tags: ["computing", "primary", "jss"] },
  // Study tools
  { name: "Anki", url: "https://apps.ankiweb.net", what: "Free flashcard app with spaced repetition (works offline).", tags: ["study", "tools"] },
  { name: "Zotero", url: "https://www.zotero.org", what: "Free reference manager for essays and theses.", tags: ["university", "research", "tools"] },
  { name: "LibreOffice", url: "https://www.libreoffice.org", what: "Free office suite: documents, spreadsheets and slides.", tags: ["tools", "tech"] },
  // Research (university)
  { name: "Research4Life (HINARI, AGORA, OARE, ARDI)", url: "https://www.research4life.org", what: "Free or low-cost access to thousands of journals for institutions in eligible countries. Ask your university librarian to register.", tags: ["university", "research", "health", "agriculture"] },
  { name: "DOAJ", url: "https://doaj.org", what: "Directory of open-access journals.", tags: ["research", "university"] },
  { name: "Google Scholar", url: "https://scholar.google.com", what: "Search scholarly articles. Look for the [PDF] links on the right.", tags: ["research", "university"] },
  { name: "arXiv", url: "https://arxiv.org", what: "Free preprints in maths, physics, computing and more.", tags: ["research", "university"] },
  { name: "PubMed", url: "https://pubmed.ncbi.nlm.nih.gov", what: "Biomedical literature search (many free full texts).", tags: ["research", "health", "university"] },
  { name: "OER Commons", url: "https://oercommons.org", what: "Open educational resources for teachers and students.", tags: ["reference", "teachers"] },
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

import type { Level } from "./types";

export const tech: Level = {
  id: "tech",
  title: "Technical & Vocational",
  short: "Tech & Skills",
  exam: "TVET / NCTVA",
  emoji: "🛠️",
  blurb: "Practical skills for work: digital, business, farming, electrical and health.",
  subjects: [
    {
      id: "digital",
      title: "Digital Skills",
      emoji: "🖥️",
      topics: [
        {
          id: "office-skills",
          title: "Word processing and spreadsheets",
          lesson: [
            "A word processor (Word, Google Docs, LibreOffice Writer) is for letters and reports. A spreadsheet (Excel, Google Sheets, LibreOffice Calc) is for numbers.",
            "## Spreadsheet formulas",
            "- Start with =. =SUM(A1:A5) adds cells A1 to A5. =AVERAGE(B1:B10) gives the mean.",
            "- Cell A1 means column A, row 1.",
            "## Free tools",
            "- LibreOffice and Google Workspace are free alternatives to paid software.",
          ],
          questions: [
            { q: "Which formula adds cells A1 to A5?", options: ["=SUM(A1:A5)", "=ADD(A1,A5)", "SUM A1-A5", "=TOTAL(A1+A5)"], answer: 0, why: "SUM with a range is the standard." },
            { q: "Every spreadsheet formula starts with", options: ["=", "#", "@", "/"], answer: 0, why: "The = sign tells the sheet to calculate." },
            { q: "Cell B3 is in", options: ["column B, row 3", "row B, column 3", "page B3", "sheet 3"], answer: 0, why: "Letter is the column and number is the row." },
            { q: "Which is a free office suite?", options: ["LibreOffice", "A paid-only product", "Notepad only", "None exist"], answer: 0, why: "LibreOffice is free and open source." },
            { q: "To save a file you press", options: ["Ctrl + S", "Ctrl + P", "Ctrl + Z", "Ctrl + X"], answer: 0, why: "Ctrl+S saves." },
          ],
        },
        {
          id: "web-basics",
          title: "Internet, email and staying safe online",
          lesson: [
            "Search engines like Google help you find information. Use specific keywords and check who wrote the page.",
            "## Email",
            "- An email has To, Subject and Body. Use a clear subject and a polite greeting.",
            "## Safety",
            "- Never share passwords or OTP codes. Check web addresses carefully. Back up important files.",
            "## Mobile money safety",
            "- Never give your PIN to anyone, including people who call claiming to be from the company.",
          ],
          questions: [
            { q: "Someone calls and asks for your mobile money PIN. You should", options: ["Refuse and never share it", "Give it if they sound polite", "Send it by SMS", "Share half of it"], answer: 0, why: "Genuine companies never ask for your PIN." },
            { q: "A good email subject is", options: ["Clear and short", "Empty", "ALL CAPITALS and symbols", "Your password"], answer: 0, why: "It tells the reader what the message is about." },
            { q: "Which is a safer password?", options: ["T!ger-Mango-2749", "password", "1234", "aaaa"], answer: 0, why: "Length plus mixed characters." },
            { q: "To judge a web page, check", options: ["Who wrote it and when", "Only the colours", "Only the ads", "Nothing"], answer: 0, why: "Source and date show reliability." },
            { q: "Backing up files means", options: ["Keeping a second copy elsewhere", "Deleting them", "Renaming them", "Printing the screen"], answer: 0, why: "A backup protects against loss." },
          ],
        },
      ],
    },
    {
      id: "business",
      title: "Entrepreneurship",
      emoji: "🏪",
      topics: [
        {
          id: "small-business",
          title: "Starting and running a small business",
          lesson: [
            "A business earns profit when income is greater than costs. Know your fixed costs (rent) and variable costs (stock).",
            "## Pricing",
            "- Selling price = cost price + profit margin. Always include transport and your time.",
            "## Record keeping",
            "- Write down every sale and expense. Separate business money from personal money.",
            "## Customers",
            "- Good service, fair prices and reliability bring customers back.",
          ],
          questions: [
            { q: "Profit is", options: ["Income − costs", "Income + costs", "Costs only", "Income only"], answer: 0, why: "Profit = income − total costs." },
            { q: "Rent is a", options: ["fixed cost", "variable cost", "sale", "profit"], answer: 0, why: "Rent stays the same however much you sell." },
            { q: "Why separate business and personal money?", options: ["To know the true profit", "To confuse customers", "To pay more tax", "No reason"], answer: 0, why: "Mixing money hides how the business is doing." },
            { q: "You buy 10 items at Le 5,000 each and sell all at Le 7,000. Profit?", options: ["Le 20,000", "Le 50,000", "Le 70,000", "Le 2,000"], answer: 0, why: "Income 70,000 − cost 50,000 = 20,000." },
            { q: "What brings customers back?", options: ["Good service and fair prices", "Rude service", "Hidden charges", "Empty shelves"], answer: 0, why: "Trust is the heart of repeat business." },
          ],
        },
      ],
    },
    {
      id: "agriculture",
      title: "Agriculture",
      emoji: "🌾",
      topics: [
        {
          id: "crops-soil",
          title: "Soil, crops and farming practice",
          lesson: [
            "Soil is made of rock particles, humus (rotted plant and animal matter), water and air. Loam soil (a mix of sand, silt and clay) is best for most crops.",
            "## Practices",
            "- Crop rotation reduces pests and keeps the soil fertile. Mulching holds moisture. Compost adds nutrients.",
            "## Common crops in Sierra Leone",
            "- Rice (staple), cassava, groundnut, oil palm, cocoa and coffee.",
            "## Safe farming",
            "- Use chemicals only as directed and store them away from food and children.",
          ],
          questions: [
            { q: "The best soil for most crops is", options: ["loam", "pure sand", "pure clay", "gravel"], answer: 0, why: "Loam balances drainage and nutrients." },
            { q: "Crop rotation helps to", options: ["Reduce pests and keep fertility", "Use more chemicals only", "Stop rainfall", "Kill all plants"], answer: 0, why: "Different crops use and add different nutrients." },
            { q: "Humus is", options: ["Rotted organic matter", "A type of rock", "A fertiliser brand", "Water"], answer: 0, why: "It improves soil structure and nutrients." },
            { q: "Which is a staple food crop in Sierra Leone?", options: ["Rice", "Wheat only", "Tulips", "Oats"], answer: 0, why: "Rice is the main staple." },
            { q: "Mulching helps by", options: ["Keeping the soil moist", "Burning weeds", "Making soil salty", "Washing away soil"], answer: 0, why: "A cover layer reduces evaporation." },
          ],
        },
      ],
    },
    {
      id: "electrical",
      title: "Basic Electrical",
      emoji: "🔌",
      topics: [
        {
          id: "electrical-safety",
          title: "Electrical safety and basics",
          lesson: [
            "Electricity is dangerous. Always switch off and unplug before working on a device. Never touch wires with wet hands.",
            "## Basics",
            "- Voltage is measured in volts, current in amperes and resistance in ohms. V = I × R.",
            "- A fuse or circuit breaker stops dangerous current.",
            "## Earthing",
            "- An earth wire gives dangerous current a safe path to the ground.",
            "## Solar basics",
            "- A solar panel gives DC (direct current). A charge controller protects the battery, and an inverter changes DC to AC.",
          ],
          questions: [
            { q: "Before repairing a device you should", options: ["Switch off and unplug it", "Test it with wet hands", "Cut the wires while it is on", "Remove the fuse only"], answer: 0, why: "Remove the power first." },
            { q: "A fuse protects a circuit by", options: ["Breaking when current is too high", "Increasing current", "Making light", "Storing energy"], answer: 0, why: "It is a deliberate weak link." },
            { q: "An inverter changes", options: ["DC to AC", "AC to DC", "Water to fuel", "Heat to sound"], answer: 0, why: "Homes use AC; batteries and panels give DC." },
            { q: "V = 12 V, R = 6 Ω. Current is", options: ["2 A", "72 A", "0.5 A", "18 A"], answer: 0, why: "I = V/R = 2." },
            { q: "The purpose of an earth wire is to", options: ["Give faults a safe path to ground", "Save electricity", "Make the wire longer", "Reduce voltage"], answer: 0, why: "It prevents shocks when there is a fault." },
          ],
        },
      ],
    },
    {
      id: "health",
      title: "Health & First Aid",
      emoji: "🩹",
      topics: [
        {
          id: "first-aid",
          title: "First aid basics",
          lesson: [
            "First aid is the first help given before medical care arrives. Stay calm, check for danger, then help.",
            "## Bleeding",
            "- Press firmly on the wound with a clean cloth and raise the limb if you can.",
            "## Burns",
            "- Cool the burn under clean running water for at least 10–20 minutes. Do not put oil, toothpaste or butter on it.",
            "## Seek help",
            "- Go to a clinic quickly for deep wounds, serious burns, difficulty breathing, fits, or snake bites. Do not cut the wound or suck out venom.",
          ],
          questions: [
            { q: "For a minor burn you should first", options: ["Cool it under clean running water", "Apply oil", "Apply toothpaste", "Burst blisters"], answer: 0, why: "Cooling reduces damage; oil traps heat." },
            { q: "To stop bleeding", options: ["Press firmly with a clean cloth", "Wash with soil", "Leave it open", "Tie tightly for hours"], answer: 0, why: "Direct pressure is the first step." },
            { q: "First step in any emergency", options: ["Check for danger", "Run away", "Take photos", "Wait"], answer: 0, why: "Do not become a second casualty." },
            { q: "Fever in a young child needs", options: ["Prompt visit to a clinic", "Ignoring it", "Only herbs, no checks", "Cold drinks only"], answer: 0, why: "Fever can be a sign of malaria and other serious illness." },
            { q: "After a snake bite you should", options: ["Keep calm and get to a clinic fast", "Cut the wound", "Suck the venom", "Tie a very tight band"], answer: 0, why: "Cutting and sucking cause harm and do not help." },
          ],
        },
      ],
    },
  ],
};

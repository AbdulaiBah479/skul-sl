import type { Level } from "./types";

export const primary: Level = {
  id: "primary",
  title: "Primary School",
  short: "Primary",
  exam: "NPSE",
  emoji: "🎒",
  blurb: "Class 1–6: numbers, reading, science and our country.",
  subjects: [
    {
      id: "maths",
      title: "Mathematics",
      emoji: "➕",
      topics: [
        {
          id: "place-value",
          title: "Place value",
          lesson: [
            "Every digit in a number has a place. In 3,482 the 3 means 3 thousands, the 4 means 4 hundreds, the 8 means 8 tens and the 2 means 2 ones.",
            "## Reading big numbers",
            "- Ones, tens, hundreds, thousands, ten thousands, hundred thousands, millions.",
            "- 25,306 is read: twenty-five thousand, three hundred and six.",
            "- A zero holds a place. In 25,306 there are no tens.",
          ],
          questions: [
            { q: "What is the value of 7 in 4,720?", options: ["7", "70", "700", "7,000"], answer: 2, why: "The 7 is in the hundreds place, so it is worth 700." },
            { q: "Which number is five thousand and twelve?", options: ["512", "5,012", "5,120", "50,012"], answer: 1, why: "5 thousands, 0 hundreds, 1 ten, 2 ones = 5,012." },
            { q: "Which is the biggest number?", options: ["9,099", "9,909", "9,990", "9,009"], answer: 2, why: "All start with 9 thousand; 9,990 has the most hundreds (9)." },
            { q: "How many tens are in 340?", options: ["3", "4", "34", "40"], answer: 2, why: "340 ÷ 10 = 34 tens." },
            { q: "Write 6,000 + 300 + 5 as one number.", options: ["635", "6,305", "6,350", "63,005"], answer: 1, why: "6 thousands, 3 hundreds, 0 tens, 5 ones = 6,305." },
          ],
        },
        {
          id: "fractions",
          title: "Fractions",
          lesson: [
            "A fraction is part of a whole. In 3/4 the bottom number (denominator) says how many equal parts the whole is cut into. The top number (numerator) says how many parts we take.",
            "## Equal fractions",
            "- 1/2 = 2/4 = 3/6. Multiply or divide the top and bottom by the same number.",
            "## Adding fractions with the same bottom number",
            "- Add the tops, keep the bottom: 2/7 + 3/7 = 5/7.",
          ],
          questions: [
            { q: "What fraction of a pizza is left if 3 of 8 equal slices are eaten?", options: ["3/8", "5/8", "3/5", "8/3"], answer: 1, why: "8 − 3 = 5 slices left, so 5/8." },
            { q: "Which fraction equals 1/2?", options: ["2/3", "3/6", "1/4", "2/5"], answer: 1, why: "3/6 divided top and bottom by 3 is 1/2." },
            { q: "2/9 + 4/9 = ?", options: ["6/18", "6/9", "8/9", "2/3 of 9"], answer: 1, why: "Add the tops: 2 + 4 = 6. Keep the bottom 9. So 6/9." },
            { q: "Which is the biggest?", options: ["1/2", "1/3", "1/4", "1/8"], answer: 0, why: "The smaller the bottom number (for the same top), the bigger the piece." },
            { q: "In 5/6, what is the denominator?", options: ["5", "6", "11", "1"], answer: 1, why: "The denominator is the bottom number." },
          ],
        },
        {
          id: "money-time",
          title: "Money and time",
          lesson: [
            "Sierra Leone uses the leone (SLE). We add, subtract and share money the same way as other numbers.",
            "## Time",
            "- 60 seconds = 1 minute; 60 minutes = 1 hour; 24 hours = 1 day; 7 days = 1 week.",
            "- Half past 3 is 3:30. Quarter to 5 is 4:45.",
            "## Change",
            "- Change = money given − price. If you pay Le 20 for something that costs Le 13, your change is Le 7.",
          ],
          questions: [
            { q: "You pay Le 50 for a book costing Le 35. How much change?", options: ["Le 5", "Le 15", "Le 25", "Le 85"], answer: 1, why: "50 − 35 = 15." },
            { q: "How many minutes are in 2 hours?", options: ["60", "100", "120", "200"], answer: 2, why: "2 × 60 = 120." },
            { q: "What time is a quarter to 5?", options: ["5:15", "4:15", "4:45", "5:45"], answer: 2, why: "A quarter to 5 means 15 minutes before 5:00, which is 4:45." },
            { q: "How many days are in 3 weeks?", options: ["14", "21", "24", "30"], answer: 1, why: "3 × 7 = 21." },
            { q: "4 pens cost Le 12 each. Total cost?", options: ["Le 16", "Le 36", "Le 48", "Le 124"], answer: 2, why: "4 × 12 = 48." },
          ],
        },
      ],
    },
    {
      id: "english",
      title: "English",
      emoji: "📖",
      topics: [
        {
          id: "parts-of-speech",
          title: "Nouns, verbs and adjectives",
          lesson: [
            "Words have jobs. A noun names a person, place or thing (Freetown, teacher, rice). A verb shows action or being (run, is, eat). An adjective describes a noun (big, red, tasty).",
            "## Example",
            "- The hungry boy eats rice. — hungry = adjective, boy = noun, eats = verb, rice = noun.",
            "## Singular and plural",
            "- Most nouns add -s (book → books). Some change: child → children, man → men, leaf → leaves.",
          ],
          questions: [
            { q: "Which word is a verb? 'The girl sings loudly.'", options: ["girl", "sings", "loudly", "The"], answer: 1, why: "'sings' is the action." },
            { q: "Which word is an adjective? 'A tall tree'", options: ["A", "tall", "tree", "None"], answer: 1, why: "'tall' describes the noun 'tree'." },
            { q: "What is the plural of 'child'?", options: ["childs", "childes", "children", "childrens"], answer: 2, why: "'Child' has an irregular plural: children." },
            { q: "Choose the noun: ", options: ["quickly", "happy", "market", "jump"], answer: 2, why: "A market is a place, so it is a noun." },
            { q: "Fill in: Musa ___ to school every day.", options: ["go", "goes", "going", "gone"], answer: 1, why: "A singular subject (Musa) takes 'goes'." },
          ],
        },
        {
          id: "punctuation",
          title: "Capital letters and punctuation",
          lesson: [
            "Sentences start with a capital letter and end with a full stop (.), question mark (?) or exclamation mark (!).",
            "## Capital letters are also used for",
            "- Names of people and places: Fatmata, Bo, Sierra Leone.",
            "- Days and months: Monday, April.",
            "- The word I.",
            "## Commas",
            "- Commas separate items in a list: We bought rice, fish, onions and pepper.",
          ],
          questions: [
            { q: "Which sentence is written correctly?", options: ["my name is aminata.", "My name is Aminata.", "my name is Aminata.", "My Name Is Aminata"], answer: 1, why: "Begin with a capital letter, capitalise the name, and end with a full stop." },
            { q: "Which punctuation ends a question?", options: [".", "!", "?", ","], answer: 2, why: "A question mark ends a question." },
            { q: "Which needs a capital letter?", options: ["river", "kenema", "table", "teacher"], answer: 1, why: "Kenema is the name of a place." },
            { q: "Where do commas go? 'We sell mangoes oranges and pineapples'", options: ["after We", "after mangoes", "after oranges", "after sell"], answer: 1, why: "Items in a list are separated by commas: mangoes, oranges and pineapples." },
            { q: "Choose the correct sentence.", options: ["what time is it", "What time is it?", "what time is it?", "What time is it."], answer: 1, why: "A question starts with a capital letter and ends with a question mark." },
          ],
        },
      ],
    },
    {
      id: "science",
      title: "Integrated Science",
      emoji: "🔬",
      topics: [
        {
          id: "living-things",
          title: "Living and non-living things",
          lesson: [
            "Living things move, grow, feed, breathe, reproduce, sense their surroundings and get rid of waste. Plants and animals are living things. Stones and water are non-living.",
            "## Plants make their own food",
            "- Green plants use sunlight, water and air (carbon dioxide) to make food. This is called photosynthesis.",
            "## Animals eat plants or other animals",
          ],
          questions: [
            { q: "Which is a living thing?", options: ["Stone", "Tree", "Water", "Chair"], answer: 1, why: "A tree grows, feeds and reproduces." },
            { q: "What do green plants need to make food?", options: ["Sunlight, water and air", "Only soil", "Only meat", "Darkness"], answer: 0, why: "Photosynthesis uses sunlight, water and carbon dioxide." },
            { q: "An animal that eats only plants is a…", options: ["carnivore", "herbivore", "omnivore", "predator"], answer: 1, why: "Herbivores eat plants (goats, cows)." },
            { q: "Which is NOT a sign of life?", options: ["Growing", "Breathing", "Reproducing", "Being very big"], answer: 3, why: "Size does not decide whether something is alive." },
            { q: "Which part of the plant takes in water from the soil?", options: ["Leaf", "Flower", "Root", "Fruit"], answer: 2, why: "Roots absorb water and minerals." },
          ],
        },
        {
          id: "health-hygiene",
          title: "Health and hygiene",
          lesson: [
            "Good hygiene stops disease from spreading. Wash your hands with soap and clean water after using the toilet and before eating.",
            "## Preventing malaria",
            "- Malaria is spread by the female Anopheles mosquito.",
            "- Sleep under a treated mosquito net, remove standing water, and go to the clinic quickly if you have a fever.",
            "## Safe water",
            "- Drink clean, safe water. Boil or treat water if you are unsure about it.",
          ],
          questions: [
            { q: "What spreads malaria?", options: ["Houseflies", "Female Anopheles mosquito", "Cockroaches", "Dust"], answer: 1, why: "Malaria parasites are carried by female Anopheles mosquitoes." },
            { q: "When should you wash hands with soap?", options: ["Only on Sundays", "After using the toilet and before eating", "Never", "Only when you see dirt"], answer: 1, why: "These are the key moments that stop germs spreading." },
            { q: "Best way to avoid mosquito bites at night?", options: ["Sleep under a treated net", "Leave water standing", "Sleep outside", "Open all the windows"], answer: 0, why: "Treated nets block mosquitoes while you sleep." },
            { q: "Where do mosquitoes lay eggs?", options: ["Dry sand", "Standing water", "Fire", "Cold ice"], answer: 1, why: "Remove standing water to reduce mosquitoes." },
            { q: "How can you make doubtful water safer to drink?", options: ["Boil it", "Add sand", "Leave it in the sun for a minute", "Stir it"], answer: 0, why: "Boiling kills most germs." },
          ],
        },
      ],
    },
    {
      id: "social",
      title: "Social Studies",
      emoji: "🌍",
      topics: [
        {
          id: "our-country",
          title: "Sierra Leone: our country",
          lesson: [
            "Sierra Leone is in West Africa. Its capital city is Freetown. We became independent from Britain on 27 April 1961.",
            "## Neighbours",
            "- Guinea in the north and east, Liberia in the south-east, and the Atlantic Ocean in the west.",
            "## Our national colours",
            "- The flag has three stripes: green (agriculture, mountains), white (unity and justice) and blue (the sea and the harbour at Freetown).",
            "## Official language",
            "- English is the official language. Krio is widely spoken across the country.",
          ],
          questions: [
            { q: "What is the capital of Sierra Leone?", options: ["Bo", "Freetown", "Kenema", "Makeni"], answer: 1, why: "Freetown is the capital." },
            { q: "On which date did Sierra Leone gain independence?", options: ["27 April 1961", "1 January 1960", "4 July 1776", "15 May 1970"], answer: 0, why: "Independence Day is 27 April." },
            { q: "Which country borders Sierra Leone?", options: ["Ghana", "Guinea", "Nigeria", "Mali"], answer: 1, why: "Guinea and Liberia are the two land neighbours." },
            { q: "What does the blue stripe on the flag stand for?", options: ["The sea and harbour", "Farming", "Peace only", "Gold"], answer: 0, why: "Blue represents the sea and Freetown's harbour." },
            { q: "Which is the widely spoken language that connects Sierra Leoneans?", options: ["Krio", "French", "Swahili", "Hausa"], answer: 0, why: "Krio is the lingua franca." },
          ],
        },
      ],
    },
  ],
};

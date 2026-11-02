/**
 * English Skills Hub - Curriculum & Lesson Data
 * Model: Grades 1–6 with custom editorial palettes (Primary, Tint, Border)
 */
const CURRICULUM_DATA = {
  // GRADE 1: Warm Terracotta / Clay
  1: [
    {
      id: "g1-u1",
      title: "My School Day",
      type: "First Words & Sentences",
      skill: "Identify Characters",
      writingGoal: "Simple Sentences (Noun + Verb)",
      theme: {
        primary: "#9a3412",
        tint: "#ffedd5",
        border: "#fed7aa"
      },
      lines: [
        { speaker: "Leo", text: "Hello! My name is Leo. I have a red pencil and a blue book." },
        { speaker: "Teacher", text: "Welcome to class, Leo! Please sit down." }
      ],
      vocab: [
        { word: "pencil", part: "noun", def: "A tool used for writing or drawing." },
        { word: "book", part: "noun", def: "Sheets of paper with words or pictures bound together." }
      ],
      exercises: [
        {
          question: "What color is Leo's pencil?",
          correct: "Red",
          options: ["Blue", "Yellow"],
          tip: "Check line 1: Leo talks about his pencil."
        }
      ]
    },
    {
      id: "g1-u2",
      title: "Our Pets",
      type: "Descriptive List",
      skill: "Classify Animals",
      writingGoal: "Color Adjectives",
      theme: {
        primary: "#9a3412",
        tint: "#ffedd5",
        border: "#fed7aa"
      },
      lines: [
        { speaker: "Mia", text: "I have a small cat. Her name is Luna." },
        { speaker: "Sam", text: "I have a big brown dog named Max." }
      ],
      vocab: [
        { word: "cat", part: "noun", def: "A small furry animal often kept as a pet." },
        { word: "dog", part: "noun", def: "A domesticated animal known as human's best friend." }
      ],
      exercises: [
        {
          question: "Who has a big brown dog?",
          correct: "Sam",
          options: ["Mia", "Leo"],
          tip: "Read line 2 carefully."
        }
      ]
    }
  ],

  // GRADE 2: Deep Sage / Forest Green
  2: [
    {
      id: "g2-u1",
      title: "Community Helpers",
      type: "Informational Text",
      skill: "Main Idea",
      writingGoal: "Job Descriptions",
      theme: {
        primary: "#166534",
        tint: "#dcfce7",
        border: "#bbf7d0"
      },
      lines: [
        { speaker: "Narrator", text: "Firefighters protect our community from dangerous fires." },
        { speaker: "Narrator", text: "Doctors and nurses help us stay healthy when we are sick." }
      ],
      vocab: [
        { word: "community", part: "noun", def: "A group of people living in the same place." },
        { word: "protect", part: "verb", def: "To keep safe from harm." }
      ],
      exercises: [
        {
          question: "What do firefighters do?",
          correct: "Protect our community from fires",
          options: ["Bake bread", "Fly airplanes"],
          tip: "Look at the first statement."
        }
      ]
    }
  ],

  // GRADE 3: Deep Slate / Indigo
  3: [
    {
      id: "g3-u1",
      title: "Weather & Seasons",
      type: "Science Article",
      skill: "Cause and Effect",
      writingGoal: "Sequential Words (First, Next, Finally)",
      theme: {
        primary: "#312e81",
        tint: "#e0e7ff",
        border: "#c7d2fe"
      },
      lines: [
        { speaker: "Narrator", text: "In autumn, the temperature drops and leaves turn bright orange." },
        { speaker: "Narrator", text: "Because winter brings snow, many animals hibernate." }
      ],
      vocab: [
        { word: "temperature", part: "noun", def: "How hot or cold something is." },
        { word: "hibernate", part: "verb", def: "To sleep through the winter season." }
      ],
      exercises: [
        {
          question: "Why do animals hibernate?",
          correct: "Because winter brings snow and cold",
          options: ["Because they want to play", "Because it is hot"],
          tip: "Look for the cause word 'Because'."
        }
      ]
    }
  ],

  // GRADE 4: Muted Plum / Burgundy
  4: [
    {
      id: "g4-u1",
      title: "Habitats Around the World",
      type: "Comparative Study",
      skill: "Compare and Contrast",
      writingGoal: "Comparative Adjectives",
      theme: {
        primary: "#831843",
        tint: "#fce7f3",
        border: "#fbcfe8"
      },
      lines: [
        { speaker: "Explorer", text: "The rainforest is much wetter than the dry savannah." },
        { speaker: "Explorer", text: "However, both habitats support an incredible variety of wildlife." }
      ],
      vocab: [
        { word: "habitat", part: "noun", def: "The natural home or environment of an animal or plant." },
        { word: "wildlife", part: "noun", def: "Wild animals and plants collectively." }
      ],
      exercises: [
        {
          question: "Which habitat is wetter?",
          correct: "The rainforest",
          options: ["The savannah", "The desert"],
          tip: "Line 1 contrasts the rainforest and savannah."
        }
      ]
    }
  ],

  // GRADE 5: Classic Ochre / Amber
  5: [
    {
      id: "g5-u1",
      title: "From Wheat to Bread",
      type: "Interview",
      skill: "Paraphrase",
      writingGoal: "Explanatory Text",
      theme: {
        primary: "#854d0e",
        tint: "#fef9c3",
        border: "#fde047"
      },
      lines: [
        { speaker: "Host", text: "Today we visit Mr. Okafor, who makes fresh bread daily." },
        { speaker: "Mr. Okafor", text: "Bread needs time. The dough must rest for two hours to rise properly." },
        { speaker: "Student", text: "What goes into the dough?" },
        { speaker: "Mr. Okafor", text: "Only four things: flour, water, salt, and yeast. Yeast is a tiny living thing that makes the dough rise." }
      ],
      vocab: [
        { word: "dough", part: "noun", def: "A thick mixture of flour and liquid before baking." },
        { word: "rise", part: "verb", def: "To expand or get larger due to yeast fermentation." },
        { word: "yeast", part: "noun", def: "A tiny living thing that makes dough rise." },
        { word: "flour", part: "noun", def: "A fine powder made from wheat, used for bread." }
      ],
      exercises: [
        {
          question: "Which sentence best paraphrases 'Bread needs time'?",
          correct: "Good bread cannot be made in a rush.",
          options: ["Bread is always late.", "Bakers have no watches."],
          tip: "Paraphrasing keeps the meaning identical using fresh words."
        },
        {
          question: "Why does the dough rest for two hours?",
          correct: "So the yeast can make it rise",
          options: ["To cool down", "To dry completely"],
          tip: "Look at Mr. Okafor's explanation about yeast and time."
        }
      ]
    },
    {
      id: "g5-u2",
      title: "The Missing Pancakes",
      type: "Fiction Story",
      skill: "Use the 5 Ws",
      writingGoal: "Narrative Arc",
      theme: {
        primary: "#854d0e",
        tint: "#fef9c3",
        border: "#fde047"
      },
      lines: [
        { speaker: "Narrator", text: "On Sunday morning, Lucy woke up to a wonderful smell of pancakes." },
        { speaker: "Dad", text: "I made twelve, but only crumbs are left on the plate." },
        { speaker: "Narrator", text: "Under the apple tree sat Biscuit, the family dog, with syrup on his nose." }
      ],
      vocab: [
        { word: "crumbs", part: "noun", def: "Tiny pieces that fall from bread or cake." },
        { word: "syrup", part: "noun", def: "A thick, sweet liquid poured over pancakes." }
      ],
      exercises: [
        {
          question: "Who took the pancakes?",
          correct: "Biscuit, the family dog",
          options: ["Lucy", "Dad"],
          tip: "Line 3 reveals the dog under the tree with syrup."
        }
      ]
    }
  ],

  // GRADE 6: Petrol Blue / Dark Teal
  6: [
    {
      id: "g6-u1",
      title: "Deep Sea Exploration",
      type: "Scientific Journal",
      skill: "Making Inferences",
      writingGoal: "Research Report",
      theme: {
        primary: "#115e59",
        tint: "#ccfbf1",
        border: "#99f6e4"
      },
      lines: [
        { speaker: "Researcher", text: "At 3,000 meters below sea level, sunlight ceases to penetrate." },
        { speaker: "Researcher", text: "Creatures here generate their own light through bioluminescence." }
      ],
      vocab: [
        { word: "penetrate", part: "verb", def: "To go into or through something." },
        { word: "bioluminescence", part: "noun", def: "The biochemical emission of light by living organisms." }
      ],
      exercises: [
        {
          question: "What can you infer about deep-sea creatures?",
          correct: "They have adapted uniquely to living in complete darkness.",
          options: ["They prefer bright sunny water.", "They cannot see anything at all."],
          tip: "Connect the absence of sunlight with their ability to glow."
        }
      ]
    }
  ]
};
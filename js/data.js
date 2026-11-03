/**
 * English Skills Hub - Enriched Curriculum & Lesson Data (v3)
 * Model: Grades 1–6 with custom editorial palettes (Primary, Tint, Border)
 * Grade 5 & Grade 6 aligned with Oxford Skills World: Reading with Writing (Units 1–12)
 * Every unit includes:
 *  - 15+ dialogue or story/narrative lines
 *  - 10 contextual key vocabulary words
 *  - 10 multiple-choice comprehension questions with pedagogical tips
 */
const CURRICULUM_DATA = {
  "1": [
    {
      "id": "g1-u1",
      "title": "My School Day",
      "type": "Dialogue · First Words & Classroom Routine",
      "skill": "Identify Characters and Setting",
      "writingGoal": "Simple Sentences (Subject + Verb + Object)",
      "theme": {
        "primary": "#9a3412",
        "tint": "#ffedd5",
        "border": "#fed7aa"
      },
      "lines": [
        {
          "speaker": "Leo",
          "text": "Good morning, Miss Clark! I have my new backpack ready for our first school day."
        },
        {
          "speaker": "Teacher",
          "text": "Welcome to our bright classroom, Leo! Please hang your coat on the hook by the door."
        },
        {
          "speaker": "Mia",
          "text": "Hello, Leo! Look at my yellow pencil and my thick drawing book on the table."
        },
        {
          "speaker": "Leo",
          "text": "Those look great, Mia! I brought a box of colorful crayons and a clean eraser."
        },
        {
          "speaker": "Teacher",
          "text": "Everyone, please sit down quietly at your wooden desk so we can begin."
        },
        {
          "speaker": "Sam",
          "text": "Miss Clark, what will we learn on the big green chalkboard this morning?"
        },
        {
          "speaker": "Teacher",
          "text": "First, we will practice the alphabet and sing a cheerful morning song together."
        },
        {
          "speaker": "Mia",
          "text": "I love singing! Can I point to the letters with the wooden pointer?"
        },
        {
          "speaker": "Teacher",
          "text": "Yes, Mia. After our song, we will read a funny story about a friendly frog."
        },
        {
          "speaker": "Leo",
          "text": "I can see the frog picture on the cover! He is jumping over a small puddle."
        },
        {
          "speaker": "Sam",
          "text": "Look, the school bell is ringing for our morning recess in the sunny playground."
        },
        {
          "speaker": "Teacher",
          "text": "Please line up neatly by the door and remember to bring your water bottle."
        },
        {
          "speaker": "Mia",
          "text": "Let's share the red ball and take turns on the tall slide outside."
        },
        {
          "speaker": "Leo",
          "text": "After recess, we will paint a picture of our family on white paper."
        },
        {
          "speaker": "Teacher",
          "text": "You are all wonderful students, and we are going to have a happy year together!"
        }
      ],
      "vocab": [
        {
          "word": "backpack",
          "part": "noun",
          "def": "A bag with shoulder straps used to carry school books and supplies."
        },
        {
          "word": "classroom",
          "part": "noun",
          "def": "A room in a school where students learn with their teacher."
        },
        {
          "word": "pencil",
          "part": "noun",
          "def": "A wooden tool used for writing or drawing."
        },
        {
          "word": "book",
          "part": "noun",
          "def": "Sheets of paper with stories or pictures bound together."
        },
        {
          "word": "crayons",
          "part": "noun",
          "def": "Colored wax sticks used by children for drawing."
        },
        {
          "word": "eraser",
          "part": "noun",
          "def": "A soft piece of rubber used to rub out pencil marks."
        },
        {
          "word": "desk",
          "part": "noun",
          "def": "A small table in school where a student sits to read and write."
        },
        {
          "word": "chalkboard",
          "part": "noun",
          "def": "A large smooth dark board on the wall that teachers write on."
        },
        {
          "word": "alphabet",
          "part": "noun",
          "def": "All the letters from A to Z used to write words."
        },
        {
          "word": "playground",
          "part": "noun",
          "def": "An outdoor area at school where children play during recess."
        }
      ],
      "exercises": [
        {
          "question": "Who is the teacher in this classroom dialogue?",
          "correct": "Miss Clark",
          "options": [
            "Mrs. Green",
            "Mr. Baker"
          ],
          "tip": "Look at how Leo and Sam greet their teacher in lines 1 and 6."
        },
        {
          "question": "Where does Miss Clark ask Leo to hang his coat?",
          "correct": "On the hook by the door",
          "options": [
            "Inside his wooden desk",
            "Out in the playground"
          ],
          "tip": "Read line 2 carefully."
        },
        {
          "question": "What color is Mia's pencil?",
          "correct": "Yellow",
          "options": [
            "Blue",
            "Purple"
          ],
          "tip": "Check Mia's words in line 3."
        },
        {
          "question": "What two items did Leo bring in his box?",
          "correct": "Colorful crayons and a clean eraser",
          "options": [
            "A toy car and a drum",
            "Two apples and a spoon"
          ],
          "tip": "Read line 4 where Leo describes what he brought."
        },
        {
          "question": "Where do the students sit down quietly?",
          "correct": "At their wooden desk",
          "options": [
            "On the hallway stairs",
            "Under the big tree"
          ],
          "tip": "Look at the teacher's instruction in line 5."
        },
        {
          "question": "What will the class practice first on the green chalkboard?",
          "correct": "The alphabet and a cheerful morning song",
          "options": [
            "How to ride a bicycle",
            "How to bake a cake"
          ],
          "tip": "Read line 7."
        },
        {
          "question": "What animal is in the funny story they will read?",
          "correct": "A friendly frog",
          "options": [
            "A sleepy bear",
            "A tiny mouse"
          ],
          "tip": "Check lines 9 and 10."
        },
        {
          "question": "What is the frog doing on the book cover?",
          "correct": "Jumping over a small puddle",
          "options": [
            "Sleeping on a leaf",
            "Eating a carrot"
          ],
          "tip": "Look at Leo's observation in line 10."
        },
        {
          "question": "Where do the children go when the school bell rings?",
          "correct": "To the sunny playground for morning recess",
          "options": [
            "Home for dinner",
            "To the city library"
          ],
          "tip": "Check Sam's statement in line 11."
        },
        {
          "question": "What will the students paint after recess?",
          "correct": "A picture of their family on white paper",
          "options": [
            "The classroom door",
            "Their school shoes"
          ],
          "tip": "Read line 14."
        }
      ]
    },
    {
      "id": "g1-u2",
      "title": "Our Pets",
      "type": "Story · Animal Friends at Home",
      "skill": "Classify Animals and Describe Details",
      "writingGoal": "Color and Size Adjectives",
      "theme": {
        "primary": "#9a3412",
        "tint": "#ffedd5",
        "border": "#fed7aa"
      },
      "lines": [
        {
          "speaker": "Storyteller",
          "text": "On Saturday morning, the neighborhood children gathered in the green garden to show their favorite pets."
        },
        {
          "speaker": "Storyteller",
          "text": "First, Mia opened a woven basket and lifted out a small kitten named Luna."
        },
        {
          "speaker": "Mia",
          "text": "Luna has soft white fur, pink ears, and she loves to drink warm milk from a bowl."
        },
        {
          "speaker": "Storyteller",
          "text": "When Luna purred softly, her tiny whiskers tickled Mia's hand."
        },
        {
          "speaker": "Sam",
          "text": "Look at my big brown puppy named Max! He has floppy ears and a wagging tail."
        },
        {
          "speaker": "Storyteller",
          "text": "Max barked happily and began to chase a bouncy red ball across the grass."
        },
        {
          "speaker": "Elena",
          "text": "My pet does not have fur at all; I brought my green parrot named Kiwi in his shiny cage."
        },
        {
          "speaker": "Storyteller",
          "text": "Kiwi flapped his bright feathers and whistled a sweet tune for all the children."
        },
        {
          "speaker": "Noah",
          "text": "Inside this clear glass tank, you can see my slow turtle named Shelly."
        },
        {
          "speaker": "Storyteller",
          "text": "Shelly hid her head inside her hard shell and then peeked out at a crisp lettuce leaf."
        },
        {
          "speaker": "Mia",
          "text": "Look at Toby's pet rabbit! He has long ears and hops gently on the clover."
        },
        {
          "speaker": "Toby",
          "text": "Barnaby is a gentle rabbit, and he crunches on an orange carrot every afternoon."
        },
        {
          "speaker": "Storyteller",
          "text": "All the children poured fresh water into clean dishes so the animals could drink."
        },
        {
          "speaker": "Sam",
          "text": "Even though our pets look very different, each animal needs love, food, and a safe shelter."
        },
        {
          "speaker": "Storyteller",
          "text": "As the sun began to set, the happy friends promised to meet in the garden again next week."
        }
      ],
      "vocab": [
        {
          "word": "garden",
          "part": "noun",
          "def": "A piece of ground near a house where grass, flowers, and trees grow."
        },
        {
          "word": "kitten",
          "part": "noun",
          "def": "A very young cat."
        },
        {
          "word": "whiskers",
          "part": "noun",
          "def": "Long stiff hairs growing near the mouth of a cat, mouse, or rabbit."
        },
        {
          "word": "puppy",
          "part": "noun",
          "def": "A young dog."
        },
        {
          "word": "chase",
          "part": "verb",
          "def": "To run after something quickly in order to catch it."
        },
        {
          "word": "parrot",
          "part": "noun",
          "def": "A tropical bird with curved beak and colorful feathers that can copy sounds."
        },
        {
          "word": "feathers",
          "part": "noun",
          "def": "The soft light parts that cover a bird's body and wings."
        },
        {
          "word": "turtle",
          "part": "noun",
          "def": "A slow-moving reptile with a strong protective shell on its back."
        },
        {
          "word": "rabbit",
          "part": "noun",
          "def": "A small furry mammal with long ears and strong back legs for hopping."
        },
        {
          "word": "shelter",
          "part": "noun",
          "def": "A safe place that protects animals or people from bad weather and danger."
        }
      ],
      "exercises": [
        {
          "question": "Where did the neighborhood children meet on Saturday morning?",
          "correct": "In the green garden",
          "options": [
            "At the supermarket",
            "On the school bus"
          ],
          "tip": "Check line 1."
        },
        {
          "question": "What is the name of Mia's small kitten?",
          "correct": "Luna",
          "options": [
            "Max",
            "Kiwi"
          ],
          "tip": "Read lines 2 and 3."
        },
        {
          "question": "What part of Luna tickled Mia's hand when she purred?",
          "correct": "Her tiny whiskers",
          "options": [
            "Her sharp claws",
            "Her long tail"
          ],
          "tip": "Look at line 4."
        },
        {
          "question": "How does Sam describe his puppy Max?",
          "correct": "A big brown puppy with floppy ears and a wagging tail",
          "options": [
            "A tiny white dog that sleeps all day",
            "A black cat with green eyes"
          ],
          "tip": "Check line 5."
        },
        {
          "question": "What did Max chase across the grass?",
          "correct": "A bouncy red ball",
          "options": [
            "A yellow butterfly",
            "A paper airplane"
          ],
          "tip": "Read line 6."
        },
        {
          "question": "Which pet has bright feathers and whistles a sweet tune?",
          "correct": "Elena's green parrot named Kiwi",
          "options": [
            "Noah's turtle Shelly",
            "Toby's rabbit Barnaby"
          ],
          "tip": "Look at lines 7 and 8."
        },
        {
          "question": "How does Shelly the turtle protect herself?",
          "correct": "She hides her head inside her hard shell",
          "options": [
            "She flies into a tree",
            "She runs behind a fence"
          ],
          "tip": "Read line 10."
        },
        {
          "question": "What food does Shelly peek out to eat?",
          "correct": "A crisp lettuce leaf",
          "options": [
            "Warm milk",
            "Dog biscuits"
          ],
          "tip": "Check the end of line 10."
        },
        {
          "question": "What does Toby's rabbit Barnaby crunch on every afternoon?",
          "correct": "An orange carrot",
          "options": [
            "A green apple",
            "A piece of bread"
          ],
          "tip": "Look at line 12."
        },
        {
          "question": "According to Sam in line 14, what three things does every pet need?",
          "correct": "Love, food, and a safe shelter",
          "options": [
            "Toys, shoes, and hats",
            "Cages, leashes, and bells"
          ],
          "tip": "Read Sam's conclusion in line 14."
        }
      ]
    }
  ],
  "2": [
    {
      "id": "g2-u1",
      "title": "Community Helpers",
      "type": "Dialogue · Civic Tour of Our Town",
      "skill": "Identify Main Idea and Supporting Details",
      "writingGoal": "Job Descriptions and Action Verbs",
      "theme": {
        "primary": "#166534",
        "tint": "#dcfce7",
        "border": "#bbf7d0"
      },
      "lines": [
        {
          "speaker": "Mr. Rivera",
          "text": "Good morning, Grade 2! Today our class is walking through Oakville to meet the workers who help our community."
        },
        {
          "speaker": "Hannah",
          "text": "Look at the bright red truck outside the station! The firefighters are polishing their shiny helmets."
        },
        {
          "speaker": "Chief Brooks",
          "text": "Hello, students! My team works day and night to protect homes and families from dangerous fires."
        },
        {
          "speaker": "Lucas",
          "text": "Why do you wear such heavy jackets and tall boots, Chief Brooks?"
        },
        {
          "speaker": "Chief Brooks",
          "text": "Our special gear keeps us safe from heat and smoke when we rescue people in an emergency."
        },
        {
          "speaker": "Mr. Rivera",
          "text": "Next, let's cross the street safely at the crosswalk where Officer Kim is directing traffic."
        },
        {
          "speaker": "Officer Kim",
          "text": "I blow my whistle and hold up my stop sign so children and parents can walk across the road safely."
        },
        {
          "speaker": "Hannah",
          "text": "Across from the park is the town clinic where doctors and nurses care for sick patients."
        },
        {
          "speaker": "Dr. Lin",
          "text": "We check your heartbeat with a stethoscope and give medicine so you can stay healthy and strong."
        },
        {
          "speaker": "Lucas",
          "text": "Who is driving that big green truck early in the morning, Mr. Rivera?"
        },
        {
          "speaker": "Mr. Rivera",
          "text": "Those are sanitation workers! They collect trash and recycling to keep our streets clean and fresh."
        },
        {
          "speaker": "Hannah",
          "text": "And look at the mail carrier putting letters and packages into the blue mailbox."
        },
        {
          "speaker": "Ms. Davis",
          "text": "Rain or shine, I deliver postcards and birthday parcels to every house in the neighborhood."
        },
        {
          "speaker": "Mr. Rivera",
          "text": "Finally, here is the public library, where librarians organize thousands of books on tall shelves."
        },
        {
          "speaker": "Lucas",
          "text": "Every helper has a special job, and together they make our town a wonderful place to live!"
        }
      ],
      "vocab": [
        {
          "word": "community",
          "part": "noun",
          "def": "A group of people living and working together in the same town or area."
        },
        {
          "word": "firefighters",
          "part": "noun",
          "def": "Brave workers whose job is to put out fires and save people."
        },
        {
          "word": "protect",
          "part": "verb",
          "def": "To keep someone or something safe from harm or injury."
        },
        {
          "word": "emergency",
          "part": "noun",
          "def": "A sudden serious event that needs immediate action and help."
        },
        {
          "word": "crosswalk",
          "part": "noun",
          "def": "A marked part of a road where pedestrians can cross safely."
        },
        {
          "word": "patients",
          "part": "noun",
          "def": "People who are receiving medical care from a doctor or nurse."
        },
        {
          "word": "medicine",
          "part": "noun",
          "def": "A substance used by doctors to treat illness and help people recover."
        },
        {
          "word": "recycling",
          "part": "noun",
          "def": "Turning used paper, plastic, and glass into new useful items."
        },
        {
          "word": "neighborhood",
          "part": "noun",
          "def": "The area of a town that surrounds someone's home."
        },
        {
          "word": "organize",
          "part": "verb",
          "def": "To arrange books or objects neatly in a clear order."
        }
      ],
      "exercises": [
        {
          "question": "What is the main idea of this class walking tour?",
          "correct": "Many different workers do important jobs to help our community.",
          "options": [
            "Red fire trucks are faster than green trucks.",
            "Only doctors work during the day."
          ],
          "tip": "Look at how line 1 and line 15 frame the whole passage."
        },
        {
          "question": "What were the firefighters doing outside the station when the class arrived?",
          "correct": "Polishing their shiny helmets",
          "options": [
            "Sleeping in the truck",
            "Planting flowers"
          ],
          "tip": "Check Hannah's observation in line 2."
        },
        {
          "question": "Why do firefighters wear heavy jackets and tall boots?",
          "correct": "To stay safe from heat and smoke during an emergency",
          "options": [
            "Because it is snowing in summer",
            "To run faster in races"
          ],
          "tip": "Read Chief Brooks's explanation in line 5."
        },
        {
          "question": "How does Officer Kim help people at the crosswalk?",
          "correct": "She directs traffic with her whistle and stop sign so people can cross safely",
          "options": [
            "She sells bus tickets",
            "She paints the sidewalk"
          ],
          "tip": "Check lines 6 and 7."
        },
        {
          "question": "Where do doctors and nurses care for sick patients in Oakville?",
          "correct": "At the town clinic across from the park",
          "options": [
            "Inside the post office",
            "At the fire station"
          ],
          "tip": "Look at line 8."
        },
        {
          "question": "What tool does Dr. Lin use to check a patient's heartbeat?",
          "correct": "A stethoscope",
          "options": [
            "A thermometer",
            "A microscope"
          ],
          "tip": "Read line 9."
        },
        {
          "question": "What is the job of the sanitation workers in the big green truck?",
          "correct": "They collect trash and recycling to keep streets clean",
          "options": [
            "They deliver birthday cakes",
            "They repair bicycles"
          ],
          "tip": "Read line 11."
        },
        {
          "question": "What does Ms. Davis the mail carrier deliver in every kind of weather?",
          "correct": "Letters, postcards, and birthday parcels",
          "options": [
            "Fire helmets and boots",
            "Library shelves"
          ],
          "tip": "Check lines 12 and 13."
        },
        {
          "question": "What do librarians do at the public library?",
          "correct": "Organize thousands of books on tall shelves",
          "options": [
            "Direct cars at the crosswalk",
            "Drive the recycling truck"
          ],
          "tip": "Look at line 14."
        },
        {
          "question": "What conclusion does Lucas reach at the end of the tour?",
          "correct": "Every helper has a special job that makes the town a wonderful place to live.",
          "options": [
            "Only adults can visit the library.",
            "Walking tours are too tiring."
          ],
          "tip": "Read line 15."
        }
      ]
    },
    {
      "id": "g2-u2",
      "title": "A Seed's Journey",
      "type": "Story · Nature & Plant Life Cycle",
      "skill": "Sequence of Events",
      "writingGoal": "Time-Order Words (First, Next, Then, Finally)",
      "theme": {
        "primary": "#166534",
        "tint": "#dcfce7",
        "border": "#bbf7d0"
      },
      "lines": [
        {
          "speaker": "Storyteller",
          "text": "In early spring, Maya and her grandfather walked into the backyard with a packet of striped sunflower seeds."
        },
        {
          "speaker": "Grandpa",
          "text": "Every giant sunflower begins its life inside one of these tiny shells, Maya."
        },
        {
          "speaker": "Storyteller",
          "text": "First, Maya used a small metal trowel to dig a neat row of holes in the dark soil."
        },
        {
          "speaker": "Maya",
          "text": "How deep should I drop each seed, Grandpa?"
        },
        {
          "speaker": "Grandpa",
          "text": "Push each seed one inch down, and then pat the warm earth gently over the top."
        },
        {
          "speaker": "Storyteller",
          "text": "Next, Maya tipped her green watering can so cool drops of moisture soaked into the ground."
        },
        {
          "speaker": "Storyteller",
          "text": "For five quiet days, nothing showed above the dirt, but something amazing was happening underground."
        },
        {
          "speaker": "Grandpa",
          "text": "Beneath the surface, the seed coat softens and white roots push downward to anchor the plant."
        },
        {
          "speaker": "Storyteller",
          "text": "On the seventh morning, a curved green sprout poked bravely through the damp crust of earth."
        },
        {
          "speaker": "Maya",
          "text": "Look, Grandpa! Two baby leaves are unfolding toward the golden sunlight!"
        },
        {
          "speaker": "Storyteller",
          "text": "Week after week, the sturdy stem grew taller than Maya's knees, then taller than her shoulders."
        },
        {
          "speaker": "Grandpa",
          "text": "The broad leaves act like little kitchens, using sunshine and air to make food for the plant."
        },
        {
          "speaker": "Storyteller",
          "text": "In July, a round green bud formed at the very top of the stalk."
        },
        {
          "speaker": "Storyteller",
          "text": "Finally, the bud opened its bright yellow petals like a crown facing the summer sky."
        },
        {
          "speaker": "Maya",
          "text": "Bees are visiting our flower for nectar, and soon it will make brand-new seeds for next spring!"
        }
      ],
      "vocab": [
        {
          "word": "trowel",
          "part": "noun",
          "def": "A small hand tool with a curved scoop used for digging in a garden."
        },
        {
          "word": "soil",
          "part": "noun",
          "def": "The top layer of earth in which plants grow."
        },
        {
          "word": "moisture",
          "part": "noun",
          "def": "Water or liquid diffused in a small quantity through the ground or air."
        },
        {
          "word": "underground",
          "part": "adverb",
          "def": "Beneath the surface of the earth."
        },
        {
          "word": "roots",
          "part": "noun",
          "def": "The parts of a plant that grow downward into the dirt to take in water."
        },
        {
          "word": "sprout",
          "part": "noun",
          "def": "A new green shoot that has just begun to grow from a seed."
        },
        {
          "word": "sunlight",
          "part": "noun",
          "def": "Light and warmth that comes directly from the sun."
        },
        {
          "word": "stem",
          "part": "noun",
          "def": "The main upright stalk of a plant that supports the leaves and flower."
        },
        {
          "word": "petals",
          "part": "noun",
          "def": "The colorful outer parts of a flower head."
        },
        {
          "word": "nectar",
          "part": "noun",
          "def": "A sweet liquid produced inside flowers that bees and birds drink."
        }
      ],
      "exercises": [
        {
          "question": "When did Maya and her grandfather go into the backyard to plant seeds?",
          "correct": "In early spring",
          "options": [
            "In the middle of winter",
            "Late in autumn"
          ],
          "tip": "Check line 1."
        },
        {
          "question": "What tool did Maya use first to dig holes in the dark soil?",
          "correct": "A small metal trowel",
          "options": [
            "A wooden spoon",
            "A plastic bucket"
          ],
          "tip": "Read line 3."
        },
        {
          "question": "How deep did Grandpa tell Maya to push each sunflower seed?",
          "correct": "One inch down",
          "options": [
            "Ten feet deep",
            "On top of a rock"
          ],
          "tip": "Look at line 5."
        },
        {
          "question": "What did Maya do right after covering the seeds with warm earth?",
          "correct": "She watered the ground with her green watering can",
          "options": [
            "She picked yellow petals",
            "She cut the stem"
          ],
          "tip": "Check line 6."
        },
        {
          "question": "What happened underground during the first five days?",
          "correct": "The seed coat softened and white roots pushed downward",
          "options": [
            "Bees made honey in the soil",
            "Snow froze the seeds"
          ],
          "tip": "Read lines 7 and 8."
        },
        {
          "question": "What appeared on the seventh morning?",
          "correct": "A curved green sprout poked through the earth",
          "options": [
            "A tall oak tree",
            "A basket of apples"
          ],
          "tip": "Look at line 9."
        },
        {
          "question": "According to Grandpa, how do the broad leaves help the plant?",
          "correct": "They use sunshine and air to make food for the plant",
          "options": [
            "They chase away birds",
            "They keep the roots dry"
          ],
          "tip": "Check line 12."
        },
        {
          "question": "What formed at the top of the stalk in July?",
          "correct": "A round green bud",
          "options": [
            "A red berry",
            "A white snowflake"
          ],
          "tip": "Read line 13."
        },
        {
          "question": "What happened finally when the bud opened?",
          "correct": "Bright yellow petals opened like a crown facing the sky",
          "options": [
            "The leaves turned brown and fell",
            "The plant shrank into the ground"
          ],
          "tip": "Look at line 14."
        },
        {
          "question": "Why are bees visiting Maya's sunflower at the end of the story?",
          "correct": "To drink sweet nectar",
          "options": [
            "To dig holes with a trowel",
            "To hide from the sun"
          ],
          "tip": "Read Maya's final line (line 15)."
        }
      ]
    }
  ],
  "3": [
    {
      "id": "g3-u1",
      "title": "Weather & Seasons",
      "type": "Dialogue · Science Club Investigation",
      "skill": "Identify Cause and Effect",
      "writingGoal": "Sequential & Cause-Effect Sentences",
      "theme": {
        "primary": "#312e81",
        "tint": "#e0e7ff",
        "border": "#c7d2fe"
      },
      "lines": [
        {
          "speaker": "Ms. Chen",
          "text": "Welcome to Science Club! Today we are exploring why Earth experiences four changing seasons."
        },
        {
          "speaker": "Liam",
          "text": "Ms. Chen, why does the weather change so much between July and January?"
        },
        {
          "speaker": "Ms. Chen",
          "text": "Because Earth tilts as it orbits the sun, different parts of our planet receive more direct sunlight at different times."
        },
        {
          "speaker": "Sofia",
          "text": "In autumn, the air temperature drops, and the days become shorter and cooler."
        },
        {
          "speaker": "Ms. Chen",
          "text": "That's right! Because there is less daylight in autumn, green leaves turn bright orange, red, and gold before falling."
        },
        {
          "speaker": "Liam",
          "text": "What happens to woodland animals when the chilly autumn wind begins to blow?"
        },
        {
          "speaker": "Sofia",
          "text": "Squirrels gather acorns and bury them underground so they have enough food for the freezing months ahead."
        },
        {
          "speaker": "Ms. Chen",
          "text": "Meanwhile, flocks of geese migrate south in a V-shape to find warmer lakes and plentiful food."
        },
        {
          "speaker": "Liam",
          "text": "Then winter arrives! Heavy snow clouds form when cold air freezes water vapor high in the atmosphere."
        },
        {
          "speaker": "Ms. Chen",
          "text": "Because winter brings deep snow and scarce food, bears and hedgehogs hibernate in cozy dens until spring."
        },
        {
          "speaker": "Sofia",
          "text": "How do their bodies survive while they hibernate for so many weeks?"
        },
        {
          "speaker": "Ms. Chen",
          "text": "Their breathing and heartbeat slow way down, so their bodies use very little stored energy."
        },
        {
          "speaker": "Liam",
          "text": "When spring arrives in March, warm sunshine melts the icy snowpacks on the mountains."
        },
        {
          "speaker": "Sofia",
          "text": "As a result, melting snow fills the rivers with fresh water, and wildflowers blossom across the meadows."
        },
        {
          "speaker": "Ms. Chen",
          "text": "Finally, summer brings long sunny days and warm thunderstorms that help crops ripen on the farms!"
        }
      ],
      "vocab": [
        {
          "word": "orbits",
          "part": "verb",
          "def": "Moves in a curved path around a star or planet."
        },
        {
          "word": "temperature",
          "part": "noun",
          "def": "A measure of how hot or cold the air or an object is."
        },
        {
          "word": "daylight",
          "part": "noun",
          "def": "The natural light of the sun during the day."
        },
        {
          "word": "migrate",
          "part": "verb",
          "def": "To travel from one region to another when the seasons change."
        },
        {
          "word": "arrives",
          "part": "verb",
          "def": "Reaches a place or begins to happen."
        },
        {
          "word": "atmosphere",
          "part": "noun",
          "def": "The layer of gases and air surrounding the planet Earth."
        },
        {
          "word": "scarce",
          "part": "adjective",
          "def": "Hard to find; not enough in supply."
        },
        {
          "word": "hibernate",
          "part": "verb",
          "def": "To spend the winter in a deep sleep to save energy."
        },
        {
          "word": "blossom",
          "part": "verb",
          "def": "To produce flowers and open up in spring."
        },
        {
          "word": "ripen",
          "part": "verb",
          "def": "To become fully grown, sweet, and ready to harvest or eat."
        }
      ],
      "exercises": [
        {
          "question": "What causes different parts of Earth to receive different amounts of sunlight during the year?",
          "correct": "Earth tilts as it orbits the sun",
          "options": [
            "The sun turns off in winter",
            "The moon blocks the clouds"
          ],
          "tip": "Read Ms. Chen's explanation in line 3."
        },
        {
          "question": "What happens to the air temperature and days in autumn?",
          "correct": "The temperature drops and the days become shorter and cooler",
          "options": [
            "The temperature rises above 100 degrees",
            "Days become twenty-four hours long"
          ],
          "tip": "Check Sofia's statement in line 4."
        },
        {
          "question": "Why do green leaves turn orange, red, and gold in autumn?",
          "correct": "Because there is less daylight and cooler air",
          "options": [
            "Because squirrels paint them",
            "Because summer rain washes the green away"
          ],
          "tip": "Look at line 5."
        },
        {
          "question": "Why do squirrels bury acorns underground in autumn?",
          "correct": "So they have enough food for the freezing months ahead",
          "options": [
            "To build a house in the river",
            "To hide them from geese"
          ],
          "tip": "Check line 7."
        },
        {
          "question": "What is the effect of cold weather on flocks of geese?",
          "correct": "They migrate south in a V-shape to find warmer lakes",
          "options": [
            "They hibernate under the snow",
            "They lose all their feathers"
          ],
          "tip": "Read line 8."
        },
        {
          "question": "How do heavy snow clouds form in winter?",
          "correct": "Cold air freezes water vapor high in the atmosphere",
          "options": [
            "Wind blows sand from the desert",
            "Rivers boil into steam"
          ],
          "tip": "Look at Liam's explanation in line 9."
        },
        {
          "question": "Why do bears and hedgehogs hibernate in cozy dens?",
          "correct": "Because winter brings deep snow and scarce food",
          "options": [
            "Because they dislike sunshine",
            "Because spring is too noisy"
          ],
          "tip": "Check line 10."
        },
        {
          "question": "How does a hibernating animal save energy during the winter?",
          "correct": "Its breathing and heartbeat slow way down",
          "options": [
            "It runs around the forest at night",
            "It drinks hot soup"
          ],
          "tip": "Read line 12."
        },
        {
          "question": "What is the effect of melting mountain snow in spring?",
          "correct": "It fills the rivers with fresh water and helps wildflowers blossom",
          "options": [
            "It causes leaves to fall off trees",
            "It makes the rivers freeze solid"
          ],
          "tip": "Look at lines 13 and 14."
        },
        {
          "question": "How does summer weather help farms?",
          "correct": "Long sunny days and warm thunderstorms help crops ripen",
          "options": [
            "Ice storms preserve the apples",
            "Frost covers the wheat fields"
          ],
          "tip": "Check the final line of the passage."
        }
      ]
    },
    {
      "id": "g3-u2",
      "title": "The Night Sky Lantern",
      "type": "Story · Japanese Mountain Folktale",
      "skill": "Analyze Character Motivation and Trait",
      "writingGoal": "Descriptive Story Paragraph",
      "theme": {
        "primary": "#312e81",
        "tint": "#e0e7ff",
        "border": "#c7d2fe"
      },
      "lines": [
        {
          "speaker": "Storyteller",
          "text": "Long ago, in a quiet valley surrounded by steep mountains, lived a curious boy named Kenji."
        },
        {
          "speaker": "Storyteller",
          "text": "Every afternoon, thick gray fog rolled in from the sea and hid the winding footpath to the village."
        },
        {
          "speaker": "Storyteller",
          "text": "One evening, Kenji saw tired merchants and woodcutters stumbling in the darkness near the bamboo bridge."
        },
        {
          "speaker": "Kenji",
          "text": "Grandmother, why do travelers lose their way so often on the mountain trail?"
        },
        {
          "speaker": "Grandmother",
          "text": "When the mist covers the moon and stars, Kenji, there is no beacon to guide them home."
        },
        {
          "speaker": "Storyteller",
          "text": "Kenji had a generous heart, and he decided to build something that could shine through the thickest fog."
        },
        {
          "speaker": "Storyteller",
          "text": "The next morning, he split slender strips of bamboo and wove them into a sturdy frame."
        },
        {
          "speaker": "Storyteller",
          "text": "Carefully, he pasted oiled mulberry paper around the frame to craft a large windproof lantern."
        },
        {
          "speaker": "Kenji",
          "text": "If I place a tall beeswax candle inside this lantern, the wind will not blow out the flame."
        },
        {
          "speaker": "Storyteller",
          "text": "Before dusk, Kenji tied the lantern to a long cedar pole and climbed up to the highest rocky ridge."
        },
        {
          "speaker": "Storyteller",
          "text": "Although the evening breeze was cold and his arms grew weary, Kenji held the glowing pole high."
        },
        {
          "speaker": "Traveler",
          "text": "Look up on the ridge! A warm golden light is shining above the bamboo bridge!"
        },
        {
          "speaker": "Storyteller",
          "text": "Following Kenji's steady light, the merchants and woodcutters crossed the narrow bridge safely."
        },
        {
          "speaker": "Grandmother",
          "text": "Your kindness and determination turned a dark mountain into a safe path for everyone, Kenji."
        },
        {
          "speaker": "Storyteller",
          "text": "Inspired by the boy, the grateful villagers built a permanent stone lighthouse on that very peak."
        }
      ],
      "vocab": [
        {
          "word": "valley",
          "part": "noun",
          "def": "A low area of land between hills or mountains, often with a river."
        },
        {
          "word": "curious",
          "part": "adjective",
          "def": "Eager to learn, ask questions, and understand how things work."
        },
        {
          "word": "merchants",
          "part": "noun",
          "def": "People who buy and sell goods and travel to trade them."
        },
        {
          "word": "beacon",
          "part": "noun",
          "def": "A bright light placed in a high spot to warn or guide travelers."
        },
        {
          "word": "generous",
          "part": "adjective",
          "def": "Kind and willing to give time and effort to help others."
        },
        {
          "word": "lantern",
          "part": "noun",
          "def": "A lamp with a protective case around the flame so it can be carried outdoors."
        },
        {
          "word": "ridge",
          "part": "noun",
          "def": "A long narrow hilltop or upper edge of a mountain."
        },
        {
          "word": "weary",
          "part": "adjective",
          "def": "Very tired after working hard for a long time."
        },
        {
          "word": "determination",
          "part": "noun",
          "def": "Firmness of purpose; not giving up even when a task is difficult."
        },
        {
          "word": "grateful",
          "part": "adjective",
          "def": "Feeling or showing warm thanks for help received."
        }
      ],
      "exercises": [
        {
          "question": "Where did the boy named Kenji live?",
          "correct": "In a quiet valley surrounded by steep mountains",
          "options": [
            "On a sandy desert island",
            "In a busy modern city"
          ],
          "tip": "Check line 1."
        },
        {
          "question": "What problem made the winding footpath dangerous every afternoon?",
          "correct": "Thick gray fog rolled in and hid the path",
          "options": [
            "A dragon blocked the road",
            "The bridge was washed away by a flood"
          ],
          "tip": "Read line 2."
        },
        {
          "question": "Who did Kenji see stumbling in the darkness near the bamboo bridge?",
          "correct": "Tired merchants and woodcutters",
          "options": [
            "Sailors in a wooden boat",
            "Soldiers on horses"
          ],
          "tip": "Look at line 3."
        },
        {
          "question": "According to Grandmother, why did travelers lose their way?",
          "correct": "The mist covered the moon and stars, leaving no beacon to guide them",
          "options": [
            "They forgot to bring their maps",
            "They walked with their eyes closed"
          ],
          "tip": "Read line 5."
        },
        {
          "question": "What character trait motivated Kenji to help the travelers?",
          "correct": "He had a generous heart",
          "options": [
            "He wanted to earn gold coins",
            "He was afraid of his grandmother"
          ],
          "tip": "Check line 6."
        },
        {
          "question": "What materials did Kenji use to build his windproof lantern?",
          "correct": "Slender strips of bamboo and oiled mulberry paper",
          "options": [
            "Heavy iron bars and glass bottles",
            "Clay bricks and wool cloth"
          ],
          "tip": "Read lines 7 and 8."
        },
        {
          "question": "Why did Kenji put oiled paper around the bamboo frame?",
          "correct": "So the mountain wind would not blow out the candle flame",
          "options": [
            "To make the lantern heavier",
            "To hide the light from the village"
          ],
          "tip": "Look at lines 8 and 9."
        },
        {
          "question": "Where did Kenji carry his lantern before dusk?",
          "correct": "Up to the highest rocky ridge",
          "options": [
            "Down to the bottom of a cave",
            "Inside the village bakery"
          ],
          "tip": "Check line 10."
        },
        {
          "question": "How did Kenji show determination on the mountain ridge?",
          "correct": "Even though the breeze was cold and his arms grew weary, he held the light high",
          "options": [
            "He left the lantern on the ground and went to sleep",
            "He shouted at the clouds"
          ],
          "tip": "Read lines 11 and 14."
        },
        {
          "question": "What did the grateful villagers do after being inspired by Kenji?",
          "correct": "They built a permanent stone lighthouse on that peak",
          "options": [
            "They moved away from the valley",
            "They tore down the bamboo bridge"
          ],
          "tip": "Check the final sentence in line 15."
        }
      ]
    }
  ],
  "4": [
    {
      "id": "g4-u1",
      "title": "Habitats Around the World",
      "type": "Dialogue · Wildlife Documentary Expedition",
      "skill": "Compare and Contrast",
      "writingGoal": "Comparative & Contrastive Paragraphs",
      "theme": {
        "primary": "#831843",
        "tint": "#fce7f3",
        "border": "#fbcfe8"
      },
      "lines": [
        {
          "speaker": "Dr. Vance",
          "text": "Welcome to our global expedition! Today we are comparing two famous tropical habitats: the Amazon rainforest and the African savannah."
        },
        {
          "speaker": "Maya",
          "text": "Dr. Vance, both regions are near the equator, so why do they look so different?"
        },
        {
          "speaker": "Dr. Vance",
          "text": "The biggest difference is rainfall! The rainforest is much wetter and receives heavy rain almost every single day."
        },
        {
          "speaker": "Leo",
          "text": "In contrast, the savannah has a long dry season when very little rain falls for months."
        },
        {
          "speaker": "Dr. Vance",
          "text": "Exactly, Leo. Because of the constant moisture, rainforest trees grow closely together and form a dense canopy."
        },
        {
          "speaker": "Maya",
          "text": "How does that high leafy canopy affect the plants on the forest floor?"
        },
        {
          "speaker": "Dr. Vance",
          "text": "The canopy blocks most sunlight, so the forest floor is shady, humid, and covered in ferns and moss."
        },
        {
          "speaker": "Leo",
          "text": "On the other hand, the savannah has wide open grasslands with only scattered acacia trees."
        },
        {
          "speaker": "Maya",
          "text": "That means the animals in each habitat must have very different adaptations to survive!"
        },
        {
          "speaker": "Dr. Vance",
          "text": "Spot on! In the rainforest, spider monkeys and tree frogs spend their whole lives climbing high in the branches."
        },
        {
          "speaker": "Leo",
          "text": "Meanwhile, the open savannah is home to large grazing herds like zebras, gazelles, and elephants."
        },
        {
          "speaker": "Maya",
          "text": "Predators hunt differently too! Jaguars ambush prey among thick rainforest vines, whereas cheetahs sprint across open plains."
        },
        {
          "speaker": "Dr. Vance",
          "text": "Despite these differences, how are the rainforest and the savannah similar?"
        },
        {
          "speaker": "Leo",
          "text": "Both habitats have warm temperatures all year round and support an incredible variety of wildlife."
        },
        {
          "speaker": "Dr. Vance",
          "text": "And both ecosystems are vital to our planet and need conservation to protect endangered species."
        }
      ],
      "vocab": [
        {
          "word": "habitat",
          "part": "noun",
          "def": "The natural home or environment where a plant or animal lives."
        },
        {
          "word": "equator",
          "part": "noun",
          "def": "An imaginary line around the middle of the Earth where the climate is warm."
        },
        {
          "word": "canopy",
          "part": "noun",
          "def": "The high leafy roof formed by the tops of tall rainforest trees."
        },
        {
          "word": "humid",
          "part": "adjective",
          "def": "Having a high amount of water vapor and moisture in the air."
        },
        {
          "word": "grasslands",
          "part": "noun",
          "def": "Large open areas of country covered with wild grass rather than dense trees."
        },
        {
          "word": "adaptations",
          "part": "noun",
          "def": "Special features or behaviors that help a living thing survive in its environment."
        },
        {
          "word": "grazing",
          "part": "adjective",
          "def": "Feeding on growing grass in open fields or plains."
        },
        {
          "word": "predators",
          "part": "noun",
          "def": "Animals that naturally hunt and eat other animals."
        },
        {
          "word": "wildlife",
          "part": "noun",
          "def": "Wild animals, birds, and plants living in their natural environment."
        },
        {
          "word": "conservation",
          "part": "noun",
          "def": "The careful protection and preservation of natural environments and animals."
        }
      ],
      "exercises": [
        {
          "question": "Which two tropical habitats are being compared in this expedition?",
          "correct": "The Amazon rainforest and the African savannah",
          "options": [
            "The Arctic tundra and the Sahara desert",
            "The Pacific ocean and a mountain lake"
          ],
          "tip": "Check line 1."
        },
        {
          "question": "How are the locations of the Amazon rainforest and African savannah similar?",
          "correct": "Both regions are located near the equator and stay warm all year",
          "options": [
            "Both are located at the South Pole",
            "Both are high on icy mountains"
          ],
          "tip": "Read lines 2 and 14."
        },
        {
          "question": "What is the biggest climate difference between the rainforest and the savannah?",
          "correct": "The rainforest receives heavy rain almost every day, while the savannah has a long dry season",
          "options": [
            "The savannah snows every winter",
            "The rainforest has no rain at all"
          ],
          "tip": "Check lines 3 and 4."
        },
        {
          "question": "What do the tall rainforest trees form high above the ground?",
          "correct": "A dense leafy canopy",
          "options": [
            "A sandy beach",
            "An underground tunnel"
          ],
          "tip": "Read line 5."
        },
        {
          "question": "Why is the rainforest floor shady and covered in ferns and moss?",
          "correct": "Because the dense canopy blocks most of the sunlight",
          "options": [
            "Because there are no trees in the rainforest",
            "Because elephants eat all the grass"
          ],
          "tip": "Look at line 7."
        },
        {
          "question": "How does the plant life of the savannah differ from the rainforest?",
          "correct": "It has wide open grasslands with only scattered acacia trees",
          "options": [
            "It is completely covered in thick pine forests",
            "It has only underwater seaweed"
          ],
          "tip": "Read line 8."
        },
        {
          "question": "Which animals are adapted to live high in the rainforest branches?",
          "correct": "Spider monkeys and tree frogs",
          "options": [
            "Zebras and giraffes",
            "Polar bears and seals"
          ],
          "tip": "Check line 10."
        },
        {
          "question": "What kind of animals live on the open grasslands of the savannah?",
          "correct": "Large grazing herds like zebras, gazelles, and elephants",
          "options": [
            "Whales and dolphins",
            "Penguins and walruses"
          ],
          "tip": "Look at line 11."
        },
        {
          "question": "How do jaguars and cheetahs hunt differently in their habitats?",
          "correct": "Jaguars ambush prey among thick vines, whereas cheetahs sprint across open plains",
          "options": [
            "Cheetahs climb tall vines, while jaguars swim in the ocean",
            "Both animals only eat grass"
          ],
          "tip": "Read Maya's comparison in line 12."
        },
        {
          "question": "Why do both ecosystems need conservation according to Dr. Vance?",
          "correct": "To protect their incredible wildlife and endangered species",
          "options": [
            "To turn them into parking lots",
            "To stop rain from falling"
          ],
          "tip": "Check lines 14 and 15."
        }
      ]
    },
    {
      "id": "g4-u2",
      "title": "Inventions That Changed Communication",
      "type": "Story · Historical Narrative & Timeline",
      "skill": "Chronological Order",
      "writingGoal": "Cause & Effect Historical Paragraph",
      "theme": {
        "primary": "#831843",
        "tint": "#fce7f3",
        "border": "#fbcfe8"
      },
      "lines": [
        {
          "speaker": "Historian",
          "text": "For thousands of years, sending a message to a distant city was a slow and exhausting journey."
        },
        {
          "speaker": "Historian",
          "text": "In ancient times, messengers carried handwritten scrolls on foot, on horseback, or aboard wooden sailing ships."
        },
        {
          "speaker": "Historian",
          "text": "If a storm blocked the road or the sea, a single letter could take months to reach its destination."
        },
        {
          "speaker": "Historian",
          "text": "In the 1440s, Johannes Gutenberg invented the movable-type printing press in Germany."
        },
        {
          "speaker": "Historian",
          "text": "Because the printing press could produce hundreds of pages quickly, books and newspapers became available to ordinary citizens."
        },
        {
          "speaker": "Historian",
          "text": "Four centuries later, in the 1830s, Samuel Morse developed the electric telegraph and Morse code."
        },
        {
          "speaker": "Historian",
          "text": "For the first time in history, operators could tap pulses of electricity along copper wires to send news in minutes."
        },
        {
          "speaker": "Historian",
          "text": "In 1866, engineers laid a massive telegraph cable across the floor of the Atlantic Ocean to connect continents."
        },
        {
          "speaker": "Historian",
          "text": "Just ten years later, in 1876, Alexander Graham Bell spoke the first clear words through a telephone."
        },
        {
          "speaker": "Bell",
          "text": "Mr. Watson, come here, I want to see you!"
        },
        {
          "speaker": "Historian",
          "text": "Instead of reading dots and dashes, families could now hear the actual voice of a loved one far away."
        },
        {
          "speaker": "Historian",
          "text": "At the turn of the twentieth century, Guglielmo Marconi proved that radio waves could travel through the air without wires."
        },
        {
          "speaker": "Historian",
          "text": "Ships at sea used wireless radio broadcasts to call for rescue and receive weather warnings."
        },
        {
          "speaker": "Historian",
          "text": "In the late twentieth century, orbiting satellites and fiber-optic cables linked computers into the global Internet."
        },
        {
          "speaker": "Historian",
          "text": "Today, a student can transmit text, voice, and video instantly to a friend on the other side of the globe!"
        }
      ],
      "vocab": [
        {
          "word": "messengers",
          "part": "noun",
          "def": "People whose job is to carry important letters or news from one place to another."
        },
        {
          "word": "destination",
          "part": "noun",
          "def": "The final place to which someone or something is being sent."
        },
        {
          "word": "citizens",
          "part": "noun",
          "def": "People who live in a town, city, or country."
        },
        {
          "word": "telegraph",
          "part": "noun",
          "def": "A device that sends messages over long distances using electrical signals in wires."
        },
        {
          "word": "electricity",
          "part": "noun",
          "def": "A form of energy that flows through wires to power lights and machines."
        },
        {
          "word": "continents",
          "part": "noun",
          "def": "The world's main huge expanses of land, such as Europe, Asia, and Africa."
        },
        {
          "word": "telephone",
          "part": "noun",
          "def": "An invention that converts sound into electrical signals so people can talk far apart."
        },
        {
          "word": "broadcasts",
          "part": "noun",
          "def": "Programs or messages sent out by radio or television."
        },
        {
          "word": "satellites",
          "part": "noun",
          "def": "Spacecraft sent into orbit around the Earth to relay communication signals."
        },
        {
          "word": "transmit",
          "part": "verb",
          "def": "To send or pass a message, signal, or picture from one place to another."
        }
      ],
      "exercises": [
        {
          "question": "How were messages carried in ancient times before modern machines?",
          "correct": "By messengers on foot, on horseback, or on wooden sailing ships",
          "options": [
            "By electric copper wires",
            "Through orbiting satellites"
          ],
          "tip": "Check line 2."
        },
        {
          "question": "Why could a letter take months to reach its destination in ancient times?",
          "correct": "Because storms could block the roads or the sea",
          "options": [
            "Because people did not know how to write",
            "Because horses refused to run"
          ],
          "tip": "Read line 3."
        },
        {
          "question": "What did Johannes Gutenberg invent in the 1440s?",
          "correct": "The movable-type printing press",
          "options": [
            "The electric telegraph",
            "The wireless radio"
          ],
          "tip": "Look at line 4."
        },
        {
          "question": "What was the effect of Gutenberg's printing press?",
          "correct": "Books and newspapers became available to ordinary citizens",
          "options": [
            "People stopped reading books",
            "Ships sailed faster across the ocean"
          ],
          "tip": "Check line 5."
        },
        {
          "question": "What invention did Samuel Morse develop in the 1830s?",
          "correct": "The electric telegraph and Morse code",
          "options": [
            "The fiber-optic computer",
            "The printing press"
          ],
          "tip": "Read line 6."
        },
        {
          "question": "How did the telegraph send messages so quickly?",
          "correct": "Operators tapped pulses of electricity along copper wires",
          "options": [
            "Pigeons carried the wires",
            "Runners shouted into a tube"
          ],
          "tip": "Look at line 7."
        },
        {
          "question": "What historic engineering feat happened in 1866?",
          "correct": "A massive telegraph cable was laid across the floor of the Atlantic Ocean",
          "options": [
            "The first satellite was launched into space",
            "The first newspaper was printed"
          ],
          "tip": "Check line 8."
        },
        {
          "question": "How was Alexander Graham Bell's 1876 telephone different from the telegraph?",
          "correct": "People could hear the actual human voice instead of reading dots and dashes",
          "options": [
            "It only worked underwater",
            "It printed books automatically"
          ],
          "tip": "Read lines 9 and 11."
        },
        {
          "question": "How did Marconi's wireless radio broadcasts help ships at sea?",
          "correct": "Ships could call for rescue and receive weather warnings without wires",
          "options": [
            "Ships could fly through the air",
            "Sailors could print books on deck"
          ],
          "tip": "Check lines 12 and 13."
        },
        {
          "question": "Which technologies allow us to transmit video and text instantly across the globe today?",
          "correct": "Orbiting satellites, fiber-optic cables, and the global Internet",
          "options": [
            "Scrolls and horseback riders",
            "Steam engines and lanterns"
          ],
          "tip": "Read lines 14 and 15."
        }
      ]
    }
  ],
  "5": [
    {
      "id": "g5-u1",
      "title": "Healthy Foods, Healthy Bodies",
      "type": "Interview · Topic 1: Let's Eat! (Health)",
      "skill": "Paraphrase",
      "writingGoal": "Explanatory Text — Transitions (also, in fact, as well)",
      "theme": {
        "primary": "#854d0e",
        "tint": "#fef9c3",
        "border": "#fde047"
      },
      "lines": [
        {
          "speaker": "Host Maya",
          "text": "Welcome to Student Health Radio! Today we are speaking with nutritionist Dr. Patel about how food fuels our growing bodies."
        },
        {
          "speaker": "Dr. Patel",
          "text": "Thank you, Maya! Every meal we eat is like fuel for an engine, so choosing balanced meals gives us steady energy all day."
        },
        {
          "speaker": "Host Maya",
          "text": "Many fifth graders rush out the door in the morning. Why is breakfast such an important meal?"
        },
        {
          "speaker": "Dr. Patel",
          "text": "After eight hours of sleep, your brain and muscles need carbohydrates from whole grains like oatmeal or brown toast."
        },
        {
          "speaker": "Host Maya",
          "text": "So if we eat whole grains in the morning, we can concentrate better during math and reading class?"
        },
        {
          "speaker": "Dr. Patel",
          "text": "Exactly! You just paraphrased my point perfectly. Whole grains release energy slowly instead of causing a sudden sugar crash."
        },
        {
          "speaker": "Host Maya",
          "text": "What about colorful fruits and vegetables on our lunch tray?"
        },
        {
          "speaker": "Dr. Patel",
          "text": "Spinach, carrots, and berries are packed with essential vitamins and minerals that strengthen your immune system."
        },
        {
          "speaker": "Host Maya",
          "text": "How do proteins like eggs, beans, chicken, and fish help active students?"
        },
        {
          "speaker": "Dr. Patel",
          "text": "Protein repairs your muscles after sports practice and helps your bones and tissues grow stronger every week."
        },
        {
          "speaker": "Host Maya",
          "text": "Also, we hear a lot about calcium. Which foods provide enough calcium for our bones?"
        },
        {
          "speaker": "Dr. Patel",
          "text": "Dairy products like yogurt, milk, and cheese are rich in calcium, and leafy green vegetables provide it as well."
        },
        {
          "speaker": "Host Maya",
          "text": "What should students choose when they feel hungry for an afternoon snack?"
        },
        {
          "speaker": "Dr. Patel",
          "text": "Instead of candy or soda, grab a handful of almonds or crisp apple slices, which are nutritious and filling."
        },
        {
          "speaker": "Host Maya",
          "text": "Finally, Dr. Patel, why do coaches always remind us to carry a water bottle?"
        },
        {
          "speaker": "Dr. Patel",
          "text": "In fact, water makes up more than half of your body! Staying hydrated regulates your temperature and aids digestion as well."
        }
      ],
      "vocab": [
        {
          "word": "nutritionist",
          "part": "noun",
          "def": "An expert who studies food and how it affects the health of our bodies."
        },
        {
          "word": "balanced",
          "part": "adjective",
          "def": "Containing different food groups in the right proportions for good health."
        },
        {
          "word": "carbohydrates",
          "part": "noun",
          "def": "Substances in foods like bread, pasta, and grains that give the body energy."
        },
        {
          "word": "concentrate",
          "part": "verb",
          "def": "To focus all of your attention and mental effort on what you are doing."
        },
        {
          "word": "vitamins",
          "part": "noun",
          "def": "Natural substances in food that are necessary for normal growth and health."
        },
        {
          "word": "immune",
          "part": "adjective",
          "def": "Protected against infections and sicknesses by the body's natural defenses."
        },
        {
          "word": "protein",
          "part": "noun",
          "def": "A nutrient found in meat, beans, and eggs that builds and repairs muscles."
        },
        {
          "word": "calcium",
          "part": "noun",
          "def": "A mineral found in milk and leafy greens that keeps bones and teeth strong."
        },
        {
          "word": "nutritious",
          "part": "adjective",
          "def": "Efficient as food; nourishing and full of healthy nutrients."
        },
        {
          "word": "digestion",
          "part": "noun",
          "def": "The process in the stomach and intestines of breaking down food for the body to use."
        }
      ],
      "exercises": [
        {
          "question": "Who is the guest being interviewed on Student Health Radio?",
          "correct": "Dr. Patel, a nutritionist",
          "options": [
            "Coach Miller, a soccer referee",
            "Chef Marco, a bakery owner"
          ],
          "tip": "Check Host Maya's introduction in line 1."
        },
        {
          "question": "To what does Dr. Patel compare every meal we eat?",
          "correct": "Fuel for an engine",
          "options": [
            "Paint on a canvas",
            "Bricks in a wall"
          ],
          "tip": "Look at line 2."
        },
        {
          "question": "Why do our brain and muscles need carbohydrates at breakfast?",
          "correct": "Because the body has just gone eight hours without food during sleep",
          "options": [
            "Because carbohydrates help us fall asleep",
            "Because breakfast is the last meal of the day"
          ],
          "tip": "Read line 4."
        },
        {
          "question": "Which sentence best paraphrases 'Whole grains release energy slowly'?",
          "correct": "Foods like oatmeal give your body steady power over several hours.",
          "options": [
            "Candy bars are the fastest way to get energy.",
            "You should skip breakfast before math class."
          ],
          "tip": "Check lines 5 and 6 for the meaning of paraphrasing."
        },
        {
          "question": "How do vitamins and minerals in spinach, carrots, and berries help you?",
          "correct": "They strengthen your immune system against illness",
          "options": [
            "They make you run twice as fast",
            "They turn your hair curly"
          ],
          "tip": "Look at line 8."
        },
        {
          "question": "What is the main job of protein in the body?",
          "correct": "It repairs muscles and helps bones and tissues grow stronger",
          "options": [
            "It cools down body temperature",
            "It sweetens sour foods"
          ],
          "tip": "Read line 10."
        },
        {
          "question": "Which foods are good sources of calcium according to Dr. Patel?",
          "correct": "Yogurt, milk, cheese, and leafy green vegetables",
          "options": [
            "Soda and potato chips",
            "White sugar and butter"
          ],
          "tip": "Check line 12."
        },
        {
          "question": "Which transition phrase does Dr. Patel use at the end of line 12 to add another source of calcium?",
          "correct": "as well",
          "options": [
            "however",
            "on the contrary"
          ],
          "tip": "Look at the last two words of line 12."
        },
        {
          "question": "What nutritious afternoon snacks does Dr. Patel recommend instead of candy or soda?",
          "correct": "A handful of almonds or crisp apple slices",
          "options": [
            "Chocolate cake and ice cream",
            "French fries and ketchup"
          ],
          "tip": "Read line 14."
        },
        {
          "question": "Why is staying hydrated with water essential for the body?",
          "correct": "It regulates body temperature and aids digestion",
          "options": [
            "It replaces the need for sleep",
            "It provides all your daily protein"
          ],
          "tip": "Check line 16."
        }
      ]
    },
    {
      "id": "g5-u2",
      "title": "Our Class Party",
      "type": "Story · Topic 1: Let's Eat! (Health)",
      "skill": "Use the 5 Ws (Who, What, When, Where, Why)",
      "writingGoal": "Explanatory Text — Transitions (also, in fact, as well)",
      "theme": {
        "primary": "#854d0e",
        "tint": "#fef9c3",
        "border": "#fde047"
      },
      "lines": [
        {
          "speaker": "Narrator",
          "text": "On Friday afternoon at two o'clock, the fifth-grade students gathered in the school gymnasium."
        },
        {
          "speaker": "Narrator",
          "text": "They organized an international harvest festival to celebrate finishing their autumn science projects."
        },
        {
          "speaker": "Narrator",
          "text": "Earlier that week, their teacher Mr. Gomez had asked every student to bring a wholesome dish from home."
        },
        {
          "speaker": "Emma",
          "text": "Look at these long banquet tables! We covered them with bright paper tablecloths and name cards."
        },
        {
          "speaker": "Narrator",
          "text": "Emma placed a chilled glass bowl of fruit salad near the center of the first table."
        },
        {
          "speaker": "Emma",
          "text": "My grandmother and I chopped strawberries, kiwi, mango, and pineapple so everyone could enjoy a sweet treat without added sugar."
        },
        {
          "speaker": "Carlos",
          "text": "Next to your salad, I set down a warm platter of whole-wheat quesadillas stuffed with black beans and corn."
        },
        {
          "speaker": "Narrator",
          "text": "Carlos explained that beans and corn are traditional ingredients in Mexico and provide plenty of fiber."
        },
        {
          "speaker": "Aisha",
          "text": "I brought homemade chickpea hummus and crunchy vegetable sticks like celery, bell peppers, and cucumbers!"
        },
        {
          "speaker": "Narrator",
          "text": "Also, Mr. Gomez blended fresh oranges, bananas, and yogurt to pour cold smoothies into paper cups."
        },
        {
          "speaker": "Mr. Gomez",
          "text": "Before we eat, let's check our allergy labels so every classmate stays completely safe."
        },
        {
          "speaker": "Narrator",
          "text": "In fact, each recipe card listed every single ingredient clearly at the front of the dish."
        },
        {
          "speaker": "Narrator",
          "text": "Music played softly from a speaker while the students sampled foods from six different countries."
        },
        {
          "speaker": "Carlos",
          "text": "Healthy food is not boring at all; these colorful dishes are delicious and give us energy as well!"
        },
        {
          "speaker": "Narrator",
          "text": "At three-thirty, the students wiped the tables clean and compiled their recipes into a class cookbook."
        }
      ],
      "vocab": [
        {
          "word": "gymnasium",
          "part": "noun",
          "def": "A large room in a school equipped for indoor sports, games, and assemblies."
        },
        {
          "word": "festival",
          "part": "noun",
          "def": "A special day or gathering of celebration with food, music, and activities."
        },
        {
          "word": "wholesome",
          "part": "adjective",
          "def": "Good for your physical health and well-being; natural and nourishing."
        },
        {
          "word": "banquet",
          "part": "noun",
          "def": "An elaborate and formal meal prepared for many people."
        },
        {
          "word": "platter",
          "part": "noun",
          "def": "A large flat dish or plate used for serving food to a group."
        },
        {
          "word": "ingredients",
          "part": "noun",
          "def": "The individual foods or substances that are combined to make a particular dish."
        },
        {
          "word": "fiber",
          "part": "noun",
          "def": "Part of plant foods that helps move food smoothly through the digestive system."
        },
        {
          "word": "allergy",
          "part": "noun",
          "def": "A medical condition that causes someone to become sick after eating a specific food."
        },
        {
          "word": "sampled",
          "part": "verb",
          "def": "Tried or tasted small amounts of different foods."
        },
        {
          "word": "compiled",
          "part": "verb",
          "def": "Collected information or recipes from different people and put them together in a book."
        }
      ],
      "exercises": [
        {
          "question": "WHO organized the international harvest festival?",
          "correct": "The fifth-grade students and their teacher Mr. Gomez",
          "options": [
            "The school bus drivers",
            "The first-grade soccer team"
          ],
          "tip": "Use the 'Who' question from the 5 Ws in lines 1–3."
        },
        {
          "question": "WHEN did the class party begin?",
          "correct": "On Friday afternoon at two o'clock",
          "options": [
            "On Monday morning at eight o'clock",
            "On Sunday evening at seven o'clock"
          ],
          "tip": "Use the 'When' question in line 1."
        },
        {
          "question": "WHERE did the students gather for the celebration?",
          "correct": "In the school gymnasium",
          "options": [
            "In the science laboratory",
            "At the city park"
          ],
          "tip": "Use the 'Where' question in line 1."
        },
        {
          "question": "WHY did the class hold the harvest festival?",
          "correct": "To celebrate finishing their autumn science projects",
          "options": [
            "Because it was Mr. Gomez's birthday",
            "To raise money for new uniforms"
          ],
          "tip": "Use the 'Why' question in line 2."
        },
        {
          "question": "WHAT did Emma and her grandmother prepare for the party?",
          "correct": "A chilled bowl of fruit salad with strawberries, kiwi, mango, and pineapple",
          "options": [
            "A chocolate birthday cake",
            "A pot of spicy noodle soup"
          ],
          "tip": "Check lines 5 and 6."
        },
        {
          "question": "What wholesome dish did Carlos bring on a warm platter?",
          "correct": "Whole-wheat quesadillas stuffed with black beans and corn",
          "options": [
            "Cheese pizza and french fries",
            "Roasted turkey sandwiches"
          ],
          "tip": "Read line 7."
        },
        {
          "question": "What nutrient do black beans and corn provide according to Carlos?",
          "correct": "Plenty of fiber",
          "options": [
            "Artificial food coloring",
            "Refined sugar"
          ],
          "tip": "Look at line 8."
        },
        {
          "question": "What did Aisha bring to dip crunchy vegetable sticks into?",
          "correct": "Homemade chickpea hummus",
          "options": [
            "Melted caramel sauce",
            "Strawberry jam"
          ],
          "tip": "Check line 9."
        },
        {
          "question": "Why did Mr. Gomez ask everyone to check the recipe cards before eating?",
          "correct": "To check the allergy labels so every classmate stayed safe",
          "options": [
            "To grade their handwriting",
            "To see which dish cost the most money"
          ],
          "tip": "Read lines 11 and 12."
        },
        {
          "question": "What did the fifth graders do with their recipe cards at the end of the party?",
          "correct": "They compiled them into a class cookbook",
          "options": [
            "They threw them in the recycling bin",
            "They mailed them to another school"
          ],
          "tip": "Check the final sentence in line 15."
        }
      ]
    },
    {
      "id": "g5-u3",
      "title": "Now You See Them, Now You Don't",
      "type": "Article & Dialogue · Topic 2: The Animal Kingdom (Science)",
      "skill": "Make Connections (Text-to-Self, Text-to-World)",
      "writingGoal": "Report — Organizing with Headings",
      "theme": {
        "primary": "#854d0e",
        "tint": "#fef9c3",
        "border": "#fde047"
      },
      "lines": [
        {
          "speaker": "Ranger Cole",
          "text": "Heading 1: Masters of Disguise. Welcome to our forest trail! Have you ever played hide-and-seek in the woods?"
        },
        {
          "speaker": "Nora",
          "text": "Yes! When I wear a dark green jacket near pine trees, my friends walk right past me without noticing."
        },
        {
          "speaker": "Ranger Cole",
          "text": "You just made a great connection, Nora! In nature, animals use camouflage every single day to survive."
        },
        {
          "speaker": "Ben",
          "text": "Look closely at that oak branch—is that a dry twig or a living insect?"
        },
        {
          "speaker": "Ranger Cole",
          "text": "That is a walking stick insect! Its body mimics the shape, bark texture, and brown color of a real twig."
        },
        {
          "speaker": "Nora",
          "text": "Why does the walking stick insect need to blend into the tree branch so carefully?"
        },
        {
          "speaker": "Ranger Cole",
          "text": "Hungry birds scan the branches for food, so blending into the background keeps the insect hidden from predators."
        },
        {
          "speaker": "Ben",
          "text": "Heading 2: Changing Colors. Do some animals change their color when the seasons or surroundings change?"
        },
        {
          "speaker": "Ranger Cole",
          "text": "Indeed! In summer, the Arctic fox has brown and gray fur that matches the rocky tundra soil."
        },
        {
          "speaker": "Nora",
          "text": "What happens to the Arctic fox when winter snow covers the ground?"
        },
        {
          "speaker": "Ranger Cole",
          "text": "Its coat turns pure white, allowing it to sneak up on prey and hide from polar bears in the snowdrifts."
        },
        {
          "speaker": "Ben",
          "text": "I saw a documentary about octopuses and cuttlefish in the ocean! They can change color in less than a second."
        },
        {
          "speaker": "Ranger Cole",
          "text": "Heading 3: Patterns and Stripes. Even large animals use patterns! Think about a zebra's black-and-white stripes."
        },
        {
          "speaker": "Nora",
          "text": "When a herd of zebras stands together, their stripes dazzle a lion's eyes so it cannot single out one animal."
        },
        {
          "speaker": "Ranger Cole",
          "text": "And a leopard's spotted coat breaks up its outline in the dappled shadows of tall grass and trees!"
        }
      ],
      "vocab": [
        {
          "word": "disguise",
          "part": "noun",
          "def": "An appearance or coloring that hides the true identity or presence of something."
        },
        {
          "word": "camouflage",
          "part": "noun",
          "def": "The natural coloring or shape of an animal that allows it to blend in with its surroundings."
        },
        {
          "word": "mimics",
          "part": "verb",
          "def": "Closely imitates or copies the look, sound, or behavior of something else."
        },
        {
          "word": "texture",
          "part": "noun",
          "def": "The way a surface feels or looks, such as rough, smooth, or bumpy."
        },
        {
          "word": "background",
          "part": "noun",
          "def": "The scenery or ground behind the main object or animal."
        },
        {
          "word": "predators",
          "part": "noun",
          "def": "Animals that hunt and catch other animals for food."
        },
        {
          "word": "surroundings",
          "part": "noun",
          "def": "The environment and objects around a person or animal."
        },
        {
          "word": "tundra",
          "part": "noun",
          "def": "A vast, flat, treeless Arctic region where the subsoil is permanently frozen."
        },
        {
          "word": "prey",
          "part": "noun",
          "def": "An animal that is hunted and killed by another animal for food."
        },
        {
          "word": "dazzle",
          "part": "verb",
          "def": "To confuse or overwhelm someone's sight with bright light or moving patterns."
        }
      ],
      "exercises": [
        {
          "question": "How does Nora connect the idea of animal camouflage to her own life?",
          "correct": "She remembers wearing a dark green jacket during hide-and-seek near pine trees",
          "options": [
            "She remembers visiting a zoo in winter",
            "She talks about painting her bedroom blue"
          ],
          "tip": "Check lines 1–3 for Nora's text-to-self connection."
        },
        {
          "question": "Why do animals use camouflage in the wild?",
          "correct": "To survive by hiding from predators or sneaking up on prey",
          "options": [
            "To entertain tourists in the forest",
            "To stay warm during rainstorms"
          ],
          "tip": "Read lines 3, 7, and 11."
        },
        {
          "question": "How does a walking stick insect disguise itself on an oak branch?",
          "correct": "Its body mimics the shape, bark texture, and brown color of a real twig",
          "options": [
            "It builds a house out of stones",
            "It glows bright yellow in the dark"
          ],
          "tip": "Check line 5."
        },
        {
          "question": "From which predators is the walking stick insect hiding?",
          "correct": "Hungry birds scanning the branches",
          "options": [
            "Sharks in the ocean",
            "Polar bears on the ice"
          ],
          "tip": "Look at line 7."
        },
        {
          "question": "What color is the Arctic fox's fur during the summer months?",
          "correct": "Brown and gray to match the rocky tundra soil",
          "options": [
            "Bright orange like autumn leaves",
            "Pure white like snow"
          ],
          "tip": "Read line 9."
        },
        {
          "question": "How does the Arctic fox's coat change when winter arrives?",
          "correct": "It turns pure white to blend into the snowdrifts",
          "options": [
            "It develops black and white stripes",
            "It falls off completely"
          ],
          "tip": "Check line 11."
        },
        {
          "question": "What text-to-world connection does Ben make in line 12?",
          "correct": "He connects forest camouflage to octopuses and cuttlefish changing color in the ocean",
          "options": [
            "He talks about his pet dog barking",
            "He asks about mountain climbing gear"
          ],
          "tip": "Read line 12."
        },
        {
          "question": "Under which heading does Ranger Cole explain zebras and leopards?",
          "correct": "Heading 3: Patterns and Stripes",
          "options": [
            "Heading 1: Masters of Disguise",
            "Heading 2: Changing Colors"
          ],
          "tip": "Look at line 13."
        },
        {
          "question": "How do a zebra's black-and-white stripes protect it when standing in a herd?",
          "correct": "The stripes dazzle a lion's eyes so it cannot single out one zebra",
          "options": [
            "The stripes make the zebra invisible at night",
            "The stripes scare away rain clouds"
          ],
          "tip": "Read line 14."
        },
        {
          "question": "How does a leopard's spotted coat help it in tall grass and trees?",
          "correct": "It breaks up the leopard's outline in the dappled shadows",
          "options": [
            "It helps the leopard swim faster",
            "It warns birds to fly away"
          ],
          "tip": "Check the final sentence in line 15."
        }
      ]
    },
    {
      "id": "g5-u4",
      "title": "The Big Race",
      "type": "Story · Topic 2: The Animal Kingdom (Science)",
      "skill": "Classify and Categorize",
      "writingGoal": "Report — Organizing with Headings",
      "theme": {
        "primary": "#854d0e",
        "tint": "#fef9c3",
        "border": "#fde047"
      },
      "lines": [
        {
          "speaker": "Narrator",
          "text": "Every summer, creatures from across the valley gathered at Silver Lake for the Great Animal Kingdom Relay."
        },
        {
          "speaker": "Referee Owl",
          "text": "Welcome, athletes! Last year's race was chaotic because birds, fish, and land animals all raced on the same track."
        },
        {
          "speaker": "Narrator",
          "text": "To make the competition fair, Referee Owl used a giant chart to classify every contestant into scientific categories."
        },
        {
          "speaker": "Referee Owl",
          "text": "Division One is for warm-blooded mammals that have fur or hair and breathe air with lungs!"
        },
        {
          "speaker": "Cheetah",
          "text": "That's our group! The gazelle, the red fox, and I will sprint across the grassy meadow course."
        },
        {
          "speaker": "Dolphin",
          "text": "Wait a minute, Referee Owl! Whales and dolphins live in the water, but we are warm-blooded mammals too!"
        },
        {
          "speaker": "Referee Owl",
          "text": "You are completely right, Dolphin! Marine mammals will race in the deep-water channel alongside the bay."
        },
        {
          "speaker": "Narrator",
          "text": "Next, Referee Owl pointed his wing toward the sandy shore where creatures with dry, scaly skin were stretching."
        },
        {
          "speaker": "Sea Turtle",
          "text": "We are cold-blooded reptiles! The green iguana, the desert lizard, and I warm our bodies in the morning sun."
        },
        {
          "speaker": "Tree Frog",
          "text": "Excuse me! Frogs, toads, and salamanders are cold-blooded too, but we have smooth, moist skin instead of scales."
        },
        {
          "speaker": "Referee Owl",
          "text": "Correct! You belong in the amphibians category because you begin life in the water with gills and grow lungs as adults."
        },
        {
          "speaker": "Narrator",
          "text": "High in the pine branches, eagles, falcons, and hummingbirds ruffled their feathers for the sky relay."
        },
        {
          "speaker": "Falcon",
          "text": "All birds have feathers, two wings, and hollow bones that make us lightweight for flying!"
        },
        {
          "speaker": "Narrator",
          "text": "Finally, salmon and trout lined up underwater, flexing their fins and breathing oxygen through their gills."
        },
        {
          "speaker": "Referee Owl",
          "text": "Now that every vertebrate is in the proper category—On your marks, get set, GO!"
        }
      ],
      "vocab": [
        {
          "word": "chaotic",
          "part": "adjective",
          "def": "In a state of complete confusion and disorder."
        },
        {
          "word": "classify",
          "part": "verb",
          "def": "To arrange animals or things into groups according to their shared characteristics."
        },
        {
          "word": "categories",
          "part": "noun",
          "def": "Distinct groups or divisions of things that have similar features."
        },
        {
          "word": "mammals",
          "part": "noun",
          "def": "Warm-blooded vertebrates with hair or fur whose females produce milk for their young."
        },
        {
          "word": "reptiles",
          "part": "noun",
          "def": "Cold-blooded vertebrates with dry scaly skin, such as snakes, lizards, and turtles."
        },
        {
          "word": "scales",
          "part": "noun",
          "def": "Small, thin, overlapping plates that protect the skin of fish and reptiles."
        },
        {
          "word": "amphibians",
          "part": "noun",
          "def": "Cold-blooded animals like frogs that live both in water and on land and have moist skin."
        },
        {
          "word": "gills",
          "part": "noun",
          "def": "The respiratory organs that fish and young amphibians use to breathe oxygen underwater."
        },
        {
          "word": "hollow",
          "part": "adjective",
          "def": "Having an empty space inside rather than being solid, which reduces weight."
        },
        {
          "word": "vertebrate",
          "part": "noun",
          "def": "An animal that has a backbone or spinal column, including mammals, birds, reptiles, amphibians, and fish."
        }
      ],
      "exercises": [
        {
          "question": "Why was the previous year's race at Silver Lake chaotic?",
          "correct": "Because birds, fish, and land animals all raced on the same track",
          "options": [
            "Because a thunderstorm flooded the meadow",
            "Because Referee Owl forgot his whistle"
          ],
          "tip": "Check line 2."
        },
        {
          "question": "How did Referee Owl make the competition fair this year?",
          "correct": "He classified every contestant into scientific categories",
          "options": [
            "He only allowed birds to compete",
            "He made the race ten miles long"
          ],
          "tip": "Read line 3."
        },
        {
          "question": "What are the key characteristics of mammals in Division One?",
          "correct": "They are warm-blooded, have fur or hair, and breathe air with lungs",
          "options": [
            "They are cold-blooded and covered in feathers",
            "They breathe underwater with gills"
          ],
          "tip": "Check line 4."
        },
        {
          "question": "Why did Dolphin remind Referee Owl about whales and dolphins?",
          "correct": "Even though they live in water, they are warm-blooded mammals too",
          "options": [
            "Because dolphins have feathers",
            "Because dolphins are amphibians"
          ],
          "tip": "Read lines 6 and 7."
        },
        {
          "question": "Which animals belong to the reptiles category?",
          "correct": "The sea turtle, green iguana, and desert lizard",
          "options": [
            "The cheetah, gazelle, and red fox",
            "The eagle, falcon, and hummingbird"
          ],
          "tip": "Look at lines 8 and 9."
        },
        {
          "question": "How do reptiles warm their cold-blooded bodies?",
          "correct": "By basking in the morning sun",
          "options": [
            "By wearing wool sweaters",
            "By hibernating in ice caves"
          ],
          "tip": "Check Sea Turtle's explanation in line 9."
        },
        {
          "question": "How is a tree frog's skin different from a reptile's skin?",
          "correct": "It has smooth, moist skin instead of dry scales",
          "options": [
            "It is covered in thick fur",
            "It is covered in hollow feathers"
          ],
          "tip": "Read line 10."
        },
        {
          "question": "Why do frogs, toads, and salamanders belong in the amphibians category?",
          "correct": "They begin life in water with gills and grow lungs as adults",
          "options": [
            "They spend their whole lives flying in the sky",
            "They have warm blood and fur"
          ],
          "tip": "Look at line 11."
        },
        {
          "question": "What special bone structure helps birds stay lightweight for flying?",
          "correct": "Hollow bones",
          "options": [
            "Solid iron bones",
            "Cartilage shells"
          ],
          "tip": "Check Falcon's statement in line 13."
        },
        {
          "question": "How do salmon and trout breathe underwater?",
          "correct": "Through their gills",
          "options": [
            "Through blowholes on their backs",
            "Through their feathers"
          ],
          "tip": "Read line 14."
        }
      ]
    },
    {
      "id": "g5-u5",
      "title": "Daniel Learns a Lesson",
      "type": "Story · Topic 3: Around the House (Social Studies)",
      "skill": "Identify the Theme",
      "writingGoal": "Essay — Conclusion Phrases (in conclusion, to sum it up)",
      "theme": {
        "primary": "#854d0e",
        "tint": "#fef9c3",
        "border": "#fde047"
      },
      "lines": [
        {
          "speaker": "Narrator",
          "text": "At the beginning of the school week, Daniel's parents posted a household schedule on the kitchen refrigerator."
        },
        {
          "speaker": "Mom",
          "text": "In our house, everyone has daily chores so that our home stays clean, organized, and comfortable."
        },
        {
          "speaker": "Narrator",
          "text": "Daniel's sister Maya swept the porch every afternoon and folded the clean laundry from the dryer."
        },
        {
          "speaker": "Narrator",
          "text": "Daniel's job was to tidy his bedroom, put dirty clothes in the hamper, and pack his backpack before bedtime."
        },
        {
          "speaker": "Daniel",
          "text": "Cleaning up is boring! I would rather play video games now and worry about my messy room later."
        },
        {
          "speaker": "Narrator",
          "text": "On Tuesday and Wednesday, Daniel tossed his jacket, comic books, and clean laundry onto a giant heap on his floor."
        },
        {
          "speaker": "Dad",
          "text": "Daniel, if you neglect your responsibilities today, you will create a bigger problem for yourself tomorrow."
        },
        {
          "speaker": "Narrator",
          "text": "Daniel shrugged and left his wet soccer cleats and shin guards buried beneath a pile of unfolded blankets."
        },
        {
          "speaker": "Narrator",
          "text": "On Saturday morning, the championship soccer tournament arrived, and the team bus honked outside at eight o'clock."
        },
        {
          "speaker": "Daniel",
          "text": "Oh no! Where is my blue team jersey, and where is my left shin guard?"
        },
        {
          "speaker": "Narrator",
          "text": "In a panic, Daniel dug through the cluttered mountain of books, wrappers, and tangled clothes, but he could not find his gear."
        },
        {
          "speaker": "Maya",
          "text": "Here is your jersey under the desk, Daniel, but it is wrinkled and covered in cookie crumbs!"
        },
        {
          "speaker": "Narrator",
          "text": "By the time Daniel found his missing cleat, the team bus had already pulled away, and Dad had to drive him late."
        },
        {
          "speaker": "Coach",
          "text": "Because you arrived late, Daniel, you will have to sit on the bench during the first half of the match."
        },
        {
          "speaker": "Daniel",
          "text": "To sum it up, I learned that taking responsibility and staying organized every day saves time and prevents stress!"
        }
      ],
      "vocab": [
        {
          "word": "schedule",
          "part": "noun",
          "def": "A plan or chart that lists tasks and the times when they should be done."
        },
        {
          "word": "chores",
          "part": "noun",
          "def": "Routine jobs or tasks done regularly around the house, like sweeping or washing dishes."
        },
        {
          "word": "laundry",
          "part": "noun",
          "def": "Clothes, towels, and sheets that need to be washed or have just been washed."
        },
        {
          "word": "hamper",
          "part": "noun",
          "def": "A large basket with a lid used for holding dirty clothes until wash day."
        },
        {
          "word": "neglect",
          "part": "verb",
          "def": "To fail to care for or fail to do something that is your duty."
        },
        {
          "word": "responsibilities",
          "part": "noun",
          "def": "Duties or tasks that you are expected and trusted to take care of."
        },
        {
          "word": "tournament",
          "part": "noun",
          "def": "A sports competition involving many teams playing a series of games for a prize."
        },
        {
          "word": "cluttered",
          "part": "adjective",
          "def": "Crowded and untidy with too many messy objects scattered around."
        },
        {
          "word": "wrinkled",
          "part": "adjective",
          "def": "Having many small creases and folds because it was not folded or hung up."
        },
        {
          "word": "organized",
          "part": "adjective",
          "def": "Arranged neatly and systematically so you can find things easily."
        }
      ],
      "exercises": [
        {
          "question": "What did Daniel's parents post on the kitchen refrigerator at the start of the week?",
          "correct": "A household schedule of daily chores",
          "options": [
            "A map of the soccer stadium",
            "A restaurant dinner menu"
          ],
          "tip": "Check lines 1 and 2."
        },
        {
          "question": "How did Daniel's sister Maya help around the house?",
          "correct": "She swept the porch and folded the clean laundry",
          "options": [
            "She repaired the family car",
            "She mowed the neighbor's lawn"
          ],
          "tip": "Read line 3."
        },
        {
          "question": "What were Daniel's three household responsibilities?",
          "correct": "Tidy his bedroom, put dirty clothes in the hamper, and pack his backpack",
          "options": [
            "Cook dinner, wash the car, and paint the fence",
            "Walk the dog, water the trees, and vacuum"
          ],
          "tip": "Look at line 4."
        },
        {
          "question": "Why did Daniel neglect his chores on Tuesday and Wednesday?",
          "correct": "He thought cleaning was boring and wanted to play video games instead",
          "options": [
            "He had a broken arm",
            "He was visiting his grandparents"
          ],
          "tip": "Check line 5."
        },
        {
          "question": "What warning did Dad give Daniel in line 7?",
          "correct": "If you neglect your responsibilities today, you will create a bigger problem tomorrow.",
          "options": [
            "Video games will break the television.",
            "Soccer practice is canceled on Saturday."
          ],
          "tip": "Read Dad's words in line 7."
        },
        {
          "question": "What happened on Saturday morning at eight o'clock?",
          "correct": "The team bus honked outside for the championship soccer tournament",
          "options": [
            "Daniel's alarm clock broke",
            "It started snowing heavily"
          ],
          "tip": "Look at line 9."
        },
        {
          "question": "Why couldn't Daniel get ready on time when the bus arrived?",
          "correct": "He could not find his jersey and shin guard in his cluttered room",
          "options": [
            "The bathroom door was locked",
            "His sister hid his shoes"
          ],
          "tip": "Check lines 10 and 11."
        },
        {
          "question": "In what condition did Maya find Daniel's blue jersey under the desk?",
          "correct": "Wrinkled and covered in cookie crumbs",
          "options": [
            "Freshly ironed and folded",
            "Soaking wet from the rain"
          ],
          "tip": "Read line 12."
        },
        {
          "question": "What was the consequence of Daniel arriving late to the tournament?",
          "correct": "He had to sit on the bench during the first half of the match",
          "options": [
            "The referee canceled the whole game",
            "His team won without playing"
          ],
          "tip": "Check line 14."
        },
        {
          "question": "What is the central theme (moral lesson) of 'Daniel Learns a Lesson'?",
          "correct": "Taking daily responsibility and staying organized prevents stress and problems later.",
          "options": [
            "Soccer is too difficult to play on Saturdays.",
            "Siblings should do all your household chores for you."
          ],
          "tip": "Read Daniel's reflection in line 15."
        }
      ]
    },
    {
      "id": "g5-u6",
      "title": "Visiting an Ice Hotel",
      "type": "Magazine Article · Topic 3: Around the House (Social Studies)",
      "skill": "Identify Cause and Effect",
      "writingGoal": "Essay — Conclusion Phrases (in conclusion, to sum it up)",
      "theme": {
        "primary": "#854d0e",
        "tint": "#fef9c3",
        "border": "#fde047"
      },
      "lines": [
        {
          "speaker": "Travel Writer",
          "text": "Every winter in northern Sweden, architects and sculptors gather beside the frozen Torne River to build a remarkable hotel."
        },
        {
          "speaker": "Architect Elsa",
          "text": "Because winter temperatures drop far below freezing near the Arctic Circle, we can construct an entire building out of snow and ice!"
        },
        {
          "speaker": "Travel Writer",
          "text": "Where do you get such massive blocks of crystal-clear ice for the walls and pillars?"
        },
        {
          "speaker": "Architect Elsa",
          "text": "In March, we harvest two thousand tons of pure river ice and store it in cold warehouses until construction begins in November."
        },
        {
          "speaker": "Travel Writer",
          "text": "How do the builders keep the ceilings and archways from collapsing?"
        },
        {
          "speaker": "Architect Elsa",
          "text": "We spray a mixture of snow and water called 'snice' onto steel molds; because it freezes rock-solid, it forms strong vaulted roofs."
        },
        {
          "speaker": "Travel Writer",
          "text": "Inside the hotel, artists carve sparkling chandeliers, furniture, and animal sculptures directly into the ice."
        },
        {
          "speaker": "Guest Liam",
          "text": "When I walked into our bedroom suite, I was amazed to see that even the bed frame is carved from a giant block of ice!"
        },
        {
          "speaker": "Travel Writer",
          "text": "Because the room stays at minus five degrees Celsius, how do guests sleep comfortably without freezing?"
        },
        {
          "speaker": "Architect Elsa",
          "text": "We cover the ice beds with thick reindeer hides and give every guest a thermal expedition sleeping bag."
        },
        {
          "speaker": "Guest Liam",
          "text": "Since thick ice walls absorb sound, the bedrooms inside the hotel are extraordinarily quiet and peaceful."
        },
        {
          "speaker": "Travel Writer",
          "text": "Why aren't there any metal heaters or fireplaces inside the ice bedrooms?"
        },
        {
          "speaker": "Architect Elsa",
          "text": "If we installed heaters inside the rooms, the walls and furniture would melt immediately!"
        },
        {
          "speaker": "Travel Writer",
          "text": "What happens to this magnificent structure when warm spring sunshine returns in April?"
        },
        {
          "speaker": "Architect Elsa",
          "text": "In conclusion, the entire hotel slowly melts back into the Torne River, so we design a brand-new hotel every single winter!"
        }
      ],
      "vocab": [
        {
          "word": "architects",
          "part": "noun",
          "def": "People who design buildings and supervise their construction."
        },
        {
          "word": "sculptors",
          "part": "noun",
          "def": "Artists who make statues and forms by carving ice, stone, or wood."
        },
        {
          "word": "construct",
          "part": "verb",
          "def": "To build or put together a large structure such as a building or bridge."
        },
        {
          "word": "harvest",
          "part": "verb",
          "def": "To gather and collect a natural resource or crop for use."
        },
        {
          "word": "vaulted",
          "part": "adjective",
          "def": "Built in the shape of a high, curved arch to support a roof."
        },
        {
          "word": "chandeliers",
          "part": "noun",
          "def": "Large decorative light fixtures that hang from the ceiling."
        },
        {
          "word": "thermal",
          "part": "adjective",
          "def": "Designed to keep body heat in and protect against extreme cold."
        },
        {
          "word": "absorb",
          "part": "verb",
          "def": "To soak up or take in sound, liquid, or energy."
        },
        {
          "word": "extraordinarily",
          "part": "adverb",
          "def": "To a very unusual, remarkable, or extreme degree."
        },
        {
          "word": "magnificent",
          "part": "adjective",
          "def": "Impressively beautiful, grand, and elaborate."
        }
      ],
      "exercises": [
        {
          "question": "CAUSE & EFFECT: Why is it possible to construct an entire hotel out of snow and ice in northern Sweden?",
          "correct": "Because winter temperatures near the Arctic Circle drop far below freezing",
          "options": [
            "Because it never rains or snows in Sweden",
            "Because giant freezers are placed in the forest"
          ],
          "tip": "Check Architect Elsa's explanation in line 2."
        },
        {
          "question": "Where do the builders harvest the crystal-clear ice for the hotel?",
          "correct": "From the frozen Torne River",
          "options": [
            "From the top of a volcano",
            "From the Atlantic Ocean"
          ],
          "tip": "Read lines 1 and 4."
        },
        {
          "question": "How do the builders keep the river ice from melting between March and November?",
          "correct": "They store it in cold warehouses",
          "options": [
            "They wrap it in wool blankets",
            "They bury it under desert sand"
          ],
          "tip": "Check line 4."
        },
        {
          "question": "What is 'snice' and why do builders spray it onto steel molds?",
          "correct": "A mixture of snow and water that freezes rock-solid to form strong vaulted roofs",
          "options": [
            "A type of paint that glows in the dark",
            "Warm glue made from tree sap"
          ],
          "tip": "Look at line 6."
        },
        {
          "question": "What do sculptors and artists carve inside the ice hotel?",
          "correct": "Sparkling chandeliers, furniture, bed frames, and animal sculptures",
          "options": [
            "Wooden tables and brick chimneys",
            "Plastic chairs and glass windows"
          ],
          "tip": "Read lines 7 and 8."
        },
        {
          "question": "What is the temperature inside the ice hotel bedrooms?",
          "correct": "Around minus five degrees Celsius",
          "options": [
            "Twenty-five degrees Celsius",
            "Plus fifty degrees Celsius"
          ],
          "tip": "Check line 9."
        },
        {
          "question": "CAUSE & EFFECT: How do guests stay warm while sleeping on a block of ice?",
          "correct": "The beds are covered with reindeer hides and guests use thermal sleeping bags",
          "options": [
            "Electric heaters warm the ice beds",
            "Guests build a campfire in the room"
          ],
          "tip": "Read line 10."
        },
        {
          "question": "Why are the bedrooms inside the ice hotel extraordinarily quiet?",
          "correct": "Because the thick ice walls absorb sound",
          "options": [
            "Because guests are not allowed to speak",
            "Because there are no doors on the rooms"
          ],
          "tip": "Check Guest Liam's observation in line 11."
        },
        {
          "question": "What would happen if builders installed metal heaters or fireplaces inside the ice bedrooms?",
          "correct": "The ice walls and furniture would melt immediately",
          "options": [
            "The ice would become even harder",
            "The river would freeze faster"
          ],
          "tip": "Read lines 12 and 13."
        },
        {
          "question": "What happens to the ice hotel in April when warm spring sunshine returns?",
          "correct": "It slowly melts back into the Torne River, so a new one is built next winter",
          "options": [
            "It is shipped to another country by boat",
            "It stays frozen all summer"
          ],
          "tip": "Check line 15."
        }
      ]
    },
    {
      "id": "g5-u7",
      "title": "Our Family Camping Trip",
      "type": "Story · Topic 4: The Four Seasons (Science)",
      "skill": "Skim for Gist",
      "writingGoal": "Opinion Essay — Comma + Conjunctions (and, but, so)",
      "theme": {
        "primary": "#854d0e",
        "tint": "#fef9c3",
        "border": "#fde047"
      },
      "lines": [
        {
          "speaker": "Narrator",
          "text": "In mid-October, the Miller family packed their camping gear into the station wagon and drove up to Pine Ridge National Park."
        },
        {
          "speaker": "Leo",
          "text": "Summer camping is too hot and crowded, so autumn is my favorite season to explore the mountains!"
        },
        {
          "speaker": "Narrator",
          "text": "Along the winding mountain road, maple and birch trees formed a blazing canopy of crimson, amber, and gold."
        },
        {
          "speaker": "Mom",
          "text": "Look at the crisp foliage on the trail! The air smells like pine needles, woodsmoke, and damp earth."
        },
        {
          "speaker": "Narrator",
          "text": "Before sunset, the family cleared pinecones from a flat campsite, and they pitched their canvas tent near a bubbling stream."
        },
        {
          "speaker": "Dad",
          "text": "Mountain weather changes quickly in October, so we must fasten the rainfly tightly over our tent poles."
        },
        {
          "speaker": "Hannah",
          "text": "The afternoon sun felt warm during our hike, but now a brisk breeze is blowing down from the peaks!"
        },
        {
          "speaker": "Narrator",
          "text": "Everyone zipped up their fleece jackets, pulled on woolen hats, and gathered dry twigs for the stone fire ring."
        },
        {
          "speaker": "Dad",
          "text": "I brought a kettle of vegetable stew, and Mom packed whole-grain rolls to warm over the campfire embers."
        },
        {
          "speaker": "Narrator",
          "text": "As twilight deepened into night, thousands of glittering stars appeared in the cloudless autumn sky."
        },
        {
          "speaker": "Leo",
          "text": "Look through the binoculars! You can see the craters on the moon, and Orion's belt is rising above the ridge."
        },
        {
          "speaker": "Narrator",
          "text": "Inside the tent, the children crawled into insulated sleeping bags while an owl hooted softly in the distance."
        },
        {
          "speaker": "Narrator",
          "text": "When they unzipped the tent flap at dawn, a delicate layer of silver frost sparkled on every blade of grass."
        },
        {
          "speaker": "Hannah",
          "text": "Our fingers are chilly this morning, but drinking hot cocoa by the campfire warms us right up!"
        },
        {
          "speaker": "Narrator",
          "text": "Before driving home, the family made sure the fire was completely out, and they left the campsite spotless."
        }
      ],
      "vocab": [
        {
          "word": "foliage",
          "part": "noun",
          "def": "The leaves of trees and plants collectively, especially when colorful in autumn."
        },
        {
          "word": "campsite",
          "part": "noun",
          "def": "A cleared area of ground used for pitching a tent and camping outdoors."
        },
        {
          "word": "pitched",
          "part": "verb",
          "def": "Set up and fastened a tent firmly in place."
        },
        {
          "word": "brisk",
          "part": "adjective",
          "def": "Cold, fresh, and lively, like an energizing autumn wind."
        },
        {
          "word": "fleece",
          "part": "noun",
          "def": "A soft, warm fabric used to line jackets and outdoor clothing."
        },
        {
          "word": "embers",
          "part": "noun",
          "def": "Small pieces of glowing coal or wood in a dying fire that give steady heat."
        },
        {
          "word": "twilight",
          "part": "noun",
          "def": "The soft glowing light from the sky when the sun is just below the horizon."
        },
        {
          "word": "binoculars",
          "part": "noun",
          "def": "An optical instrument with lenses for both eyes, used for viewing distant objects."
        },
        {
          "word": "insulated",
          "part": "adjective",
          "def": "Lined with special material to prevent heat from escaping."
        },
        {
          "word": "frost",
          "part": "noun",
          "def": "A thin layer of tiny ice crystals that forms on cold surfaces overnight."
        }
      ],
      "exercises": [
        {
          "question": "SKIM FOR GIST: What is this story mainly about?",
          "correct": "A family enjoying the sights, weather, and activities of an autumn mountain camping trip",
          "options": [
            "How to build a log cabin in the middle of winter",
            "A summer swimming competition at the beach"
          ],
          "tip": "Skim the beginning, middle, and end to capture the overall gist."
        },
        {
          "question": "When and where did the Miller family go camping?",
          "correct": "In mid-October at Pine Ridge National Park",
          "options": [
            "In July at the city swimming pool",
            "In January at an indoor hotel"
          ],
          "tip": "Check line 1."
        },
        {
          "question": "Why does Leo prefer autumn camping over summer camping?",
          "correct": "Because summer camping is too hot and crowded",
          "options": [
            "Because it rains every day in summer",
            "Because tents only work in October"
          ],
          "tip": "Read line 2."
        },
        {
          "question": "What colors did the autumn foliage display along the mountain road?",
          "correct": "Crimson, amber, and gold",
          "options": [
            "Purple, blue, and pink",
            "Solid dark green"
          ],
          "tip": "Look at lines 3 and 4."
        },
        {
          "question": "Where did the family pitch their canvas tent before sunset?",
          "correct": "On a flat campsite near a bubbling stream",
          "options": [
            "On top of a rocky cliff",
            "Inside a dark cave"
          ],
          "tip": "Check line 5."
        },
        {
          "question": "Why did Dad insist on fastening the rainfly tightly over the tent poles?",
          "correct": "Because mountain weather changes quickly in October",
          "options": [
            "To keep squirrels from eating the poles",
            "To block out the morning sunlight"
          ],
          "tip": "Read line 6."
        },
        {
          "question": "Which conjunction with a comma does Hannah use in line 7 to show contrast?",
          "correct": ", but",
          "options": [
            ", so",
            ", or"
          ],
          "tip": "Check how Hannah contrasts the warm afternoon sun with the brisk evening breeze."
        },
        {
          "question": "What did the family heat over the campfire embers for dinner?",
          "correct": "A kettle of vegetable stew and whole-grain rolls",
          "options": [
            "Frozen pizza and soda",
            "Raw fish from the stream"
          ],
          "tip": "Look at line 9."
        },
        {
          "question": "What did the family discover on the grass when they unzipped the tent flap at dawn?",
          "correct": "A delicate layer of silver frost",
          "options": [
            "Three feet of heavy snow",
            "A puddle of mud"
          ],
          "tip": "Read line 13."
        },
        {
          "question": "What responsible action did the family take before driving home?",
          "correct": "They made sure the fire was completely out and left the campsite spotless",
          "options": [
            "They left their tent behind for other campers",
            "They chopped down maple trees"
          ],
          "tip": "Check the final sentence in line 15."
        }
      ]
    },
    {
      "id": "g5-u8",
      "title": "Antarctic Expedition",
      "type": "Journal · Topic 4: The Four Seasons (Science)",
      "skill": "Draw Conclusions",
      "writingGoal": "Opinion Essay — Comma + Conjunctions (and, but, so)",
      "theme": {
        "primary": "#854d0e",
        "tint": "#fef9c3",
        "border": "#fde047"
      },
      "lines": [
        {
          "speaker": "Journal — Dec 1",
          "text": "Our research vessel finally broke through the floating pack ice and anchored near the Antarctic coast."
        },
        {
          "speaker": "Journal — Dec 2",
          "text": "It is December, which is winter in the Northern Hemisphere, but here at the South Pole it is the middle of summer!"
        },
        {
          "speaker": "Journal — Dec 3",
          "text": "Even at midnight, the sun never dips below the horizon, so we must tape dark curtains over our cabin portholes to sleep."
        },
        {
          "speaker": "Journal — Dec 5",
          "text": "Before stepping outside onto the glacier, every scientist must put on thermal boots, windproof goggles, and three layers of coats."
        },
        {
          "speaker": "Journal — Dec 6",
          "text": "Today the thermometer reads minus fifteen degrees Celsius, and a fierce gale is whipping snow across the ice shelf."
        },
        {
          "speaker": "Journal — Dec 8",
          "text": "Our team used a hollow metal drill to extract a cylinder of ancient ice from deep beneath the surface."
        },
        {
          "speaker": "Journal — Dec 9",
          "text": "Tiny air bubbles are trapped inside these ice cores, so they preserve samples of Earth's atmosphere from thousands of years ago."
        },
        {
          "speaker": "Journal — Dec 11",
          "text": "This afternoon, we hiked toward a rocky peninsula where a colony of Adélie penguins was nesting."
        },
        {
          "speaker": "Journal — Dec 12",
          "text": "There are no trees or grass anywhere on this frozen continent, so the penguins build their nests out of small round pebbles."
        },
        {
          "speaker": "Journal — Dec 14",
          "text": "We stayed five meters away from the penguin chicks, and we spoke in whispers so we would not disturb the flock."
        },
        {
          "speaker": "Journal — Dec 16",
          "text": "Out in the icy bay, a pod of killer whales surfaced beside a massive tabular iceberg."
        },
        {
          "speaker": "Journal — Dec 18",
          "text": "A sudden blizzard struck our camp at noon, and visibility dropped so low that we could not see our own boots."
        },
        {
          "speaker": "Journal — Dec 19",
          "text": "Thankfully, we had tied orange safety ropes between the laboratory tent and the main station, so everyone returned safely."
        },
        {
          "speaker": "Journal — Dec 21",
          "text": "Our radio operator sent our climate measurements by satellite to universities around the world."
        },
        {
          "speaker": "Journal — Dec 23",
          "text": "Antarctica is the coldest, windiest place on Earth, but studying its glaciers helps us understand our planet's future!"
        }
      ],
      "vocab": [
        {
          "word": "vessel",
          "part": "noun",
          "def": "A large ship or boat built for ocean voyages and scientific research."
        },
        {
          "word": "hemisphere",
          "part": "noun",
          "def": "Half of the Earth, usually divided into the Northern and Southern halves by the equator."
        },
        {
          "word": "horizon",
          "part": "noun",
          "def": "The line where the earth's surface or sea appears to meet the sky."
        },
        {
          "word": "glacier",
          "part": "noun",
          "def": "A huge, slow-moving mass of ice formed from compacted snow over many centuries."
        },
        {
          "word": "gale",
          "part": "noun",
          "def": "A very strong, powerful wind."
        },
        {
          "word": "extract",
          "part": "verb",
          "def": "To remove or take something out using careful effort or a special machine."
        },
        {
          "word": "peninsula",
          "part": "noun",
          "def": "A long piece of land that sticks out into the sea and is almost surrounded by water."
        },
        {
          "word": "colony",
          "part": "noun",
          "def": "A large group of birds or animals of the same kind living closely together."
        },
        {
          "word": "blizzard",
          "part": "noun",
          "def": "A severe snowstorm with fierce winds and very low visibility."
        },
        {
          "word": "visibility",
          "part": "noun",
          "def": "The distance one can see clearly depending on weather and light conditions."
        }
      ],
      "exercises": [
        {
          "question": "DRAW CONCLUSIONS: Why do the scientists have to tape dark curtains over their cabin portholes in December?",
          "correct": "Because during the Antarctic summer, the sun shines 24 hours a day and never sets at midnight",
          "options": [
            "Because penguins peek through the windows at night",
            "Because the ship has no electricity"
          ],
          "tip": "Combine the clues in Dec 2 and Dec 3."
        },
        {
          "question": "Why is December summertime in Antarctica?",
          "correct": "Because Antarctica is in the Southern Hemisphere at the South Pole",
          "options": [
            "Because Antarctica is right on the equator",
            "Because warm ocean currents heat the land to 30 degrees"
          ],
          "tip": "Check the entry for Dec 2."
        },
        {
          "question": "What can you conclude about the Antarctic summer weather from Dec 5 and Dec 6?",
          "correct": "Even in summer, Antarctica is freezing cold and windy, requiring heavy protective gear",
          "options": [
            "Scientists can wear shorts and sandals in December",
            "It never snows during December"
          ],
          "tip": "Look at the temperature (-15°C) and clothing required."
        },
        {
          "question": "What tool did the scientists use on Dec 8 to collect ancient ice?",
          "correct": "A hollow metal drill",
          "options": [
            "A wooden garden trowel",
            "A pair of kitchen scissors"
          ],
          "tip": "Read the entry for Dec 8."
        },
        {
          "question": "Why are ancient ice cores so valuable to climate scientists?",
          "correct": "Tiny trapped air bubbles preserve samples of Earth's atmosphere from thousands of years ago",
          "options": [
            "They contain gold coins andgems",
            "They are used to keep food cold in the kitchen"
          ],
          "tip": "Check the entry for Dec 9."
        },
        {
          "question": "DRAW CONCLUSIONS: Why do Adélie penguins build their nests out of small pebbles instead of twigs and grass?",
          "correct": "Because there are no trees or grass anywhere on the frozen continent",
          "options": [
            "Because pebbles are softer than feathers",
            "Because pebbles float on water"
          ],
          "tip": "Read the entry for Dec 12."
        },
        {
          "question": "What can you conclude about the scientists' rules for observing wildlife on Dec 14?",
          "correct": "They are careful to respect and protect animals without frightening them",
          "options": [
            "They try to catch penguin chicks as pets",
            "They make loud noises to scatter the flock"
          ],
          "tip": "Check how far away they stood and how they spoke on Dec 14."
        },
        {
          "question": "What dangerous weather event struck the camp at noon on Dec 18?",
          "correct": "A sudden blizzard that reduced visibility so they could not see their boots",
          "options": [
            "A tropical hurricane with warm rain",
            "A desert sandstorm"
          ],
          "tip": "Read Dec 18."
        },
        {
          "question": "How did the scientists find their way back to the main station during the blizzard?",
          "correct": "They followed orange safety ropes tied between the laboratory tent and the station",
          "options": [
            "They followed a penguin back to camp",
            "They waited until April for the snow to stop"
          ],
          "tip": "Check Dec 19."
        },
        {
          "question": "How did the research team share their climate measurements with universities around the world?",
          "correct": "Their radio operator sent the data by satellite",
          "options": [
            "A mail carrier picked up their letters",
            "They sent messages in glass bottles"
          ],
          "tip": "Look at Dec 21."
        }
      ]
    },
    {
      "id": "g5-u9",
      "title": "Baking Cookies with Grandma",
      "type": "Story · Topic 5: Our Five Senses (Health & Science)",
      "skill": "Scan for Details (Numbers & Amounts)",
      "writingGoal": "Descriptive Essay — Sensory Words",
      "theme": {
        "primary": "#854d0e",
        "tint": "#fef9c3",
        "border": "#fde047"
      },
      "lines": [
        {
          "speaker": "Narrator",
          "text": "On rainy Sunday afternoons, ten-year-old Clara loved visiting her grandmother's cozy kitchen to bake oatmeal cinnamon cookies."
        },
        {
          "speaker": "Grandma Rose",
          "text": "Great baking uses all five of our senses, Clara, plus careful measurement of every ingredient!"
        },
        {
          "speaker": "Narrator",
          "text": "First, Clara preheated the electric oven to 350 degrees Fahrenheit and lined 2 metal baking sheets with parchment paper."
        },
        {
          "speaker": "Clara",
          "text": "Grandma, I am scanning your handwritten recipe card now—how much flour and oats do we need?"
        },
        {
          "speaker": "Grandma Rose",
          "text": "Please measure 2 cups of whole-wheat flour, 3 cups of rolled oats, and 1 teaspoon of baking soda into the large ceramic bowl."
        },
        {
          "speaker": "Narrator",
          "text": "Clara ran her fingers through the dry oats and felt their rough, flaky texture against her skin."
        },
        {
          "speaker": "Clara",
          "text": "Next, the recipe calls for 2 teaspoons of ground cinnamon and half a teaspoon of grated nutmeg!"
        },
        {
          "speaker": "Narrator",
          "text": "As soon as Clara opened the spice jars, a warm, woody aroma filled the kitchen and made her nose tingle."
        },
        {
          "speaker": "Grandma Rose",
          "text": "In the second bowl, let's whisk 2 farm eggs, 1 cup of brown sugar, and 1 teaspoon of sweet vanilla extract."
        },
        {
          "speaker": "Narrator",
          "text": "Clara folded in 1 cup of tart dried cranberries and 1 cup of dark chocolate chips with a wooden spoon."
        },
        {
          "speaker": "Narrator",
          "text": "She scooped 24 rounded tablespoons of sticky dough onto the trays, spacing them 2 inches apart."
        },
        {
          "speaker": "Grandma Rose",
          "text": "Set the brass kitchen timer for 12 minutes, and listen closely as the butter sizzles softly in the oven."
        },
        {
          "speaker": "Narrator",
          "text": "Through the glass oven door, Clara watched the pale mounds of dough turn a rich golden-brown color."
        },
        {
          "speaker": "Narrator",
          "text": "When the timer dinged brightly, Grandma lifted the trays out and let the cookies cool on a wire rack for 5 minutes."
        },
        {
          "speaker": "Clara",
          "text": "They are crispy on the outside, chewy on the inside, and the sweet cinnamon flavor dances on my tongue!"
        }
      ],
      "vocab": [
        {
          "word": "preheated",
          "part": "verb",
          "def": "Heated an oven to a specific temperature before putting food inside to bake."
        },
        {
          "word": "parchment",
          "part": "noun",
          "def": "Heavy, heat-resistant paper used in baking to keep food from sticking to pans."
        },
        {
          "word": "ceramic",
          "part": "adjective",
          "def": "Made of clay that has been shaped and hardened by high heat."
        },
        {
          "word": "flaky",
          "part": "adjective",
          "def": "Consisting of or breaking easily into small, thin, flat pieces."
        },
        {
          "word": "aroma",
          "part": "noun",
          "def": "A pleasant, noticeable smell, especially from spices, coffee, or baking food."
        },
        {
          "word": "whisk",
          "part": "verb",
          "def": "To beat eggs or liquids briskly with a wire tool to blend them smoothly."
        },
        {
          "word": "tart",
          "part": "adjective",
          "def": "Having a sharp, sour-sweet flavor like cranberries or lemons."
        },
        {
          "word": "sizzles",
          "part": "verb",
          "def": "Makes a hissing or crackling sound when frying or baking in heat."
        },
        {
          "word": "crispy",
          "part": "adjective",
          "def": "Firm, dry, and making a pleasant crunching sound when bitten."
        },
        {
          "word": "chewy",
          "part": "adjective",
          "def": "Soft and needing to be chewed several times before swallowing."
        }
      ],
      "exercises": [
        {
          "question": "SCAN FOR NUMBERS: How old is Clara in this story?",
          "correct": "Ten years old",
          "options": [
            "Eight years old",
            "Twelve years old"
          ],
          "tip": "Scan line 1 for a hyphenated age."
        },
        {
          "question": "To what temperature did Clara preheat the electric oven?",
          "correct": "350 degrees Fahrenheit",
          "options": [
            "200 degrees Fahrenheit",
            "450 degrees Fahrenheit"
          ],
          "tip": "Scan line 3 for the three-digit number."
        },
        {
          "question": "How many metal baking sheets did Clara line with parchment paper?",
          "correct": "2 metal baking sheets",
          "options": [
            "4 metal baking sheets",
            "1 metal baking sheet"
          ],
          "tip": "Scan line 3."
        },
        {
          "question": "How many cups of whole-wheat flour and rolled oats did Grandma Rose ask Clara to measure?",
          "correct": "2 cups of whole-wheat flour and 3 cups of rolled oats",
          "options": [
            "5 cups of flour and 1 cup of oats",
            "1 cup of flour and 6 cups of oats"
          ],
          "tip": "Scan line 5 for the exact cup amounts."
        },
        {
          "question": "Which sense did Clara use when she felt the rough, flaky texture of the dry oats?",
          "correct": "The sense of touch",
          "options": [
            "The sense of hearing",
            "The sense of sight"
          ],
          "tip": "Check line 6."
        },
        {
          "question": "How many teaspoons of ground cinnamon does the recipe call for?",
          "correct": "2 teaspoons",
          "options": [
            "5 teaspoons",
            "Half a teaspoon"
          ],
          "tip": "Scan line 7."
        },
        {
          "question": "Which sensory word in line 8 describes the pleasant smell of the spices?",
          "correct": "aroma",
          "options": [
            "parchment",
            "ceramic"
          ],
          "tip": "Read line 8."
        },
        {
          "question": "How many rounded tablespoons of dough did Clara scoop onto the trays, and how far apart?",
          "correct": "24 rounded tablespoons, spaced 2 inches apart",
          "options": [
            "10 tablespoons, spaced 5 inches apart",
            "50 tablespoons, spaced 1 inch apart"
          ],
          "tip": "Scan line 11 for the numbers 24 and 2."
        },
        {
          "question": "For how many minutes did Grandma set the brass kitchen timer?",
          "correct": "12 minutes",
          "options": [
            "30 minutes",
            "45 minutes"
          ],
          "tip": "Scan line 12."
        },
        {
          "question": "How long did the cookies cool on the wire rack before Clara tasted their crispy and chewy texture?",
          "correct": "5 minutes",
          "options": [
            "20 minutes",
            "1 hour"
          ],
          "tip": "Scan line 14."
        }
      ]
    },
    {
      "id": "g5-u10",
      "title": "Musical Instruments: Brass",
      "type": "Article & Workshop · Topic 5: Our Five Senses (Music)",
      "skill": "Visualize (Sensory Details)",
      "writingGoal": "Descriptive Essay — Sensory Words",
      "theme": {
        "primary": "#854d0e",
        "tint": "#fef9c3",
        "border": "#fde047"
      },
      "lines": [
        {
          "speaker": "Maestro Diaz",
          "text": "Welcome to the Symphony Instrument Workshop! Close your eyes for a moment and visualize a gleaming golden horn under stage lights."
        },
        {
          "speaker": "Lucas",
          "text": "I can picture the polished metal reflecting the spotlights like a mirror!"
        },
        {
          "speaker": "Maestro Diaz",
          "text": "Today we are exploring the brass family, which includes the trumpet, French horn, trombone, and tuba."
        },
        {
          "speaker": "Aria",
          "text": "How does a musician actually produce a sound inside a hollow brass tube?"
        },
        {
          "speaker": "Maestro Diaz",
          "text": "Unlike woodwinds that use a wooden reed, a brass player presses their lips against a cup-shaped metal mouthpiece and buzzes!"
        },
        {
          "speaker": "Lucas",
          "text": "When I buzz my lips into the mouthpiece, I can feel a tickling vibration right on my fingertips."
        },
        {
          "speaker": "Maestro Diaz",
          "text": "That buzzing vibration travels through the coiled brass tubing and echoes out of the wide, flared bell at the end."
        },
        {
          "speaker": "Aria",
          "text": "Listen to the trumpet! Its notes sound bright, piercing, and triumphant, like a royal fanfare at a castle."
        },
        {
          "speaker": "Maestro Diaz",
          "text": "How does a trumpet player change the pitch from a low note to a high note?"
        },
        {
          "speaker": "Lucas",
          "text": "By tightening their lips and pressing down the three smooth piston valves on top of the trumpet!"
        },
        {
          "speaker": "Maestro Diaz",
          "text": "Now look at the trombone: instead of valves, the player pushes and pulls a long U-shaped slide to lengthen the tube."
        },
        {
          "speaker": "Aria",
          "text": "When you slide it outward, the sound glides smoothly downward like a laughing voice!"
        },
        {
          "speaker": "Maestro Diaz",
          "text": "Next, visualize the French horn—its narrow tubing is coiled into a circle and produces a mellow, velvety tone."
        },
        {
          "speaker": "Lucas",
          "text": "And what about that enormous tuba resting on the chair at the end of the row?"
        },
        {
          "speaker": "Maestro Diaz",
          "text": "Because the tuba has the longest and widest tubing, it rumbles with deep, booming bass notes that you can feel in your chest!"
        }
      ],
      "vocab": [
        {
          "word": "visualize",
          "part": "verb",
          "def": "To form a clear mental picture of something in your mind."
        },
        {
          "word": "gleaming",
          "part": "adjective",
          "def": "Shining brightly and cleanly from polished metal or light."
        },
        {
          "word": "mouthpiece",
          "part": "noun",
          "def": "The cup-shaped metal part of a wind instrument that a player places against their lips."
        },
        {
          "word": "vibration",
          "part": "noun",
          "def": "A rapid back-and-forth movement or quivering that creates sound waves."
        },
        {
          "word": "coiled",
          "part": "adjective",
          "def": "Wound or looped into a series of circles or spirals."
        },
        {
          "word": "triumphant",
          "part": "adjective",
          "def": "Joyful, bold, and sounding like a celebration of victory."
        },
        {
          "word": "pitch",
          "part": "noun",
          "def": "How high or low a musical note sounds."
        },
        {
          "word": "valves",
          "part": "noun",
          "def": "Buttons on a brass instrument that redirect air through extra tubing to change notes."
        },
        {
          "word": "mellow",
          "part": "adjective",
          "def": "Soft, rich, warm, and pleasant to hear, without harshness."
        },
        {
          "word": "booming",
          "part": "adjective",
          "def": "Making a loud, deep, resonant sound that echoes."
        }
      ],
      "exercises": [
        {
          "question": "VISUALIZE: What mental image does Maestro Diaz ask the students to picture in lines 1 and 2?",
          "correct": "A gleaming golden horn reflecting the stage spotlights like a mirror",
          "options": [
            "A wooden violin covered in dust",
            "A black piano in a dark room"
          ],
          "tip": "Check lines 1 and 2."
        },
        {
          "question": "Which four instruments belong to the brass family introduced in this workshop?",
          "correct": "The trumpet, French horn, trombone, and tuba",
          "options": [
            "The flute, clarinet, oboe, and bassoon",
            "The drum, cymbal, triangle, and xylophone"
          ],
          "tip": "Read line 3."
        },
        {
          "question": "How does a musician initiate sound in a brass instrument?",
          "correct": "By pressing their lips against a metal mouthpiece and buzzing",
          "options": [
            "By plucking metal strings with a pick",
            "By striking the bell with a wooden mallet"
          ],
          "tip": "Check line 5."
        },
        {
          "question": "What sensory detail does Lucas feel when he buzzes into the mouthpiece?",
          "correct": "A tickling vibration on his lips and fingertips",
          "options": [
            "An icy breeze on his ears",
            "A sweet taste on his tongue"
          ],
          "tip": "Look at line 6."
        },
        {
          "question": "Where does the sound exit a brass instrument after traveling through the coiled tubing?",
          "correct": "Out of the wide, flared bell at the end",
          "options": [
            "Out of the music stand",
            "Through a hole in the floor"
          ],
          "tip": "Read line 7."
        },
        {
          "question": "How does Aria describe the sound of the trumpet in line 8?",
          "correct": "Bright, piercing, and triumphant, like a royal fanfare",
          "options": [
            "Quiet, sleepy, andwhispering",
            "Scratchy and out of tune"
          ],
          "tip": "Check line 8."
        },
        {
          "question": "What two actions allow a trumpet player to change the pitch of a note?",
          "correct": "Tightening their lips and pressing down the three piston valves",
          "options": [
            "Blowing water through the tube",
            "Spinning the trumpet in a circle"
          ],
          "tip": "Read line 10."
        },
        {
          "question": "How is a trombone different from a trumpet when changing notes?",
          "correct": "Instead of valves, it uses a long U-shaped slide to lengthen the tube",
          "options": [
            "It uses wooden keys like a piano",
            "It can only play one single note"
          ],
          "tip": "Look at line 11."
        },
        {
          "question": "Which sensory adjectives describe the tone of the circular French horn?",
          "correct": "Mellow and velvety",
          "options": [
            "Harsh and squeaky",
            "Silent and flat"
          ],
          "tip": "Check line 13."
        },
        {
          "question": "Why does the tuba produce deep, booming bass notes that you can feel in your chest?",
          "correct": "Because it is the largest brass instrument with the longest and widest tubing",
          "options": [
            "Because it has an electric amplifier inside",
            "Because it is made of heavy stone"
          ],
          "tip": "Read lines 14 and 15."
        }
      ]
    },
    {
      "id": "g5-u11",
      "title": "Our Trip to Egypt",
      "type": "Essay · Topic 6: See the World! (Social Studies)",
      "skill": "Take Notes",
      "writingGoal": "Story — Pronouns to Avoid Repetition (he, she, they)",
      "theme": {
        "primary": "#854d0e",
        "tint": "#fef9c3",
        "border": "#fde047"
      },
      "lines": [
        {
          "speaker": "Paragraph 1",
          "text": "Last spring, my parents and I flew to Cairo, the bustling capital of Egypt, and I carried a pocket notebook to take notes."
        },
        {
          "speaker": "Paragraph 2",
          "text": "Our local guide was an archaeologist named Nadia; she knew thousands of fascinating facts about ancient pharaohs."
        },
        {
          "speaker": "Paragraph 3",
          "text": "On our first morning, Nadia drove us to the Giza Plateau on the edge of the Sahara Desert."
        },
        {
          "speaker": "Paragraph 4",
          "text": "Rising above the golden sand stood the Great Pyramid of Khufu, which builders constructed over 4,500 years ago."
        },
        {
          "speaker": "Paragraph 5",
          "text": "I wrote in my notebook that the ancient workers stacked more than two million limestone blocks, and they did it without modern cranes!"
        },
        {
          "speaker": "Paragraph 6",
          "text": "Nearby, we admired the Great Sphinx, a colossal monument with the body of a lion and the carved head of a king."
        },
        {
          "speaker": "Paragraph 7",
          "text": "My father took photographs of the Sphinx's weathered face, while he shaded his eyes from the desert glare."
        },
        {
          "speaker": "Paragraph 8",
          "text": "In the afternoon, we visited the Egyptian Museum to examine artifacts rescued from royal tombs."
        },
        {
          "speaker": "Paragraph 9",
          "text": "Nadia pointed to a stone tablet covered in hieroglyphics, the picture symbols that ancient scribes used to record history."
        },
        {
          "speaker": "Paragraph 10",
          "text": "She also showed us sheets of papyrus, a strong paper that Egyptians made from tall reeds growing along the Nile River."
        },
        {
          "speaker": "Paragraph 11",
          "text": "On our third day, we boarded a traditional wooden sailboat called a felucca to sail down the Nile River."
        },
        {
          "speaker": "Paragraph 12",
          "text": "Although vast deserts cover most of Egypt, the land beside the Nile is fertile and green because the river provides fresh water."
        },
        {
          "speaker": "Paragraph 13",
          "text": "Farmers waved to us from the riverbanks as they irrigated rows of date palms, wheat, and cotton."
        },
        {
          "speaker": "Paragraph 14",
          "text": "In the evening, we walked through the Khan el-Khalili bazaar, where merchants sold brass lanterns and fragrant spices."
        },
        {
          "speaker": "Paragraph 15",
          "text": "Reviewing my travel notes on the flight home, I realized how Egypt's ancient civilization still inspires the modern world today."
        }
      ],
      "vocab": [
        {
          "word": "archaeologist",
          "part": "noun",
          "def": "A scientist who studies human history by excavating ancient buildings and objects."
        },
        {
          "word": "pharaohs",
          "part": "noun",
          "def": "The supreme rulers and kings of ancient Egypt."
        },
        {
          "word": "limestone",
          "part": "noun",
          "def": "A hard, cream-colored sedimentary rock often cut into blocks for building."
        },
        {
          "word": "colossal",
          "part": "adjective",
          "def": "Extremely large, grand, or monumental in size."
        },
        {
          "word": "monument",
          "part": "noun",
          "def": "A statue or structure built to honor an important person or historical event."
        },
        {
          "word": "artifacts",
          "part": "noun",
          "def": "Tools, jewelry, or objects made by humans long ago that have historical value."
        },
        {
          "word": "hieroglyphics",
          "part": "noun",
          "def": "The ancient Egyptian system of writing that uses pictures and symbols instead of letters."
        },
        {
          "word": "papyrus",
          "part": "noun",
          "def": "A tall water reed from the Nile used by ancient Egyptians to make sheets for writing."
        },
        {
          "word": "fertile",
          "part": "adjective",
          "def": "Capable of producing abundant crops and green plants because the soil is rich."
        },
        {
          "word": "civilization",
          "part": "noun",
          "def": "An advanced society with its own cities, writing system, art, and government."
        }
      ],
      "exercises": [
        {
          "question": "TAKE NOTES: What is the capital city of Egypt where the family landed?",
          "correct": "Cairo",
          "options": [
            "Alexandria",
            "Oaxaca"
          ],
          "tip": "Check Paragraph 1."
        },
        {
          "question": "Who was Nadia, and what pronoun is used in Paragraph 2 to avoid repeating her name?",
          "correct": "She was an archaeologist and local guide ('she')",
          "options": [
            "He was the airplane pilot ('he')",
            "They were museum guards ('they')"
          ],
          "tip": "Read Paragraph 2."
        },
        {
          "question": "Where is the Great Pyramid of Khufu located, and how old is it?",
          "correct": "On the Giza Plateau, constructed over 4,500 years ago",
          "options": [
            "In the center of Rome, built 500 years ago",
            "On an island in the Red Sea, built 100 years ago"
          ],
          "tip": "Check Paragraphs 3 and 4."
        },
        {
          "question": "How many limestone blocks did ancient workers stack to build the Great Pyramid?",
          "correct": "More than two million limestone blocks",
          "options": [
            "Five hundred bricks",
            "Ten thousand wooden logs"
          ],
          "tip": "Look at the narrator's notes in Paragraph 5."
        },
        {
          "question": "How is the Great Sphinx described in Paragraph 6?",
          "correct": "A colossal monument with the body of a lion and the head of a king",
          "options": [
            "A tall tower with a golden bell",
            "A stone statue of an eagle"
          ],
          "tip": "Read Paragraph 6."
        },
        {
          "question": "What did the family examine at the Egyptian Museum in the afternoon?",
          "correct": "Ancient artifacts, hieroglyphics, and sheets of papyrus",
          "options": [
            "Space rockets and moon rocks",
            "Dinosaur skeletons"
          ],
          "tip": "Check Paragraphs 8–10."
        },
        {
          "question": "What are hieroglyphics?",
          "correct": "Picture symbols that ancient Egyptian scribes used to record history",
          "options": [
            "Wooden boats used on the Nile",
            "Spices sold in the market"
          ],
          "tip": "Look at Paragraph 9."
        },
        {
          "question": "From what plant did ancient Egyptians make papyrus paper?",
          "correct": "Tall reeds growing along the Nile River",
          "options": [
            "Pine trees in the mountains",
            "Cactus plants in the Sahara"
          ],
          "tip": "Read Paragraph 10."
        },
        {
          "question": "Why is the land right beside the Nile River so fertile and green?",
          "correct": "Because the Nile River provides fresh water for irrigating crops",
          "options": [
            "Because it snows there every week",
            "Because there is no sunshine"
          ],
          "tip": "Check Paragraphs 12 and 13."
        },
        {
          "question": "In Paragraph 13, who does the pronoun 'they' refer to?",
          "correct": "The farmers on the riverbanks",
          "options": [
            "The ancient pharaohs",
            "The museum tourists"
          ],
          "tip": "Look at the subject of Paragraph 13."
        }
      ]
    },
    {
      "id": "g5-u12",
      "title": "Adventure in Oaxaca",
      "type": "Story · Topic 6: See the World! (Social Studies)",
      "skill": "Identify Characters, Setting, and Plot",
      "writingGoal": "Story — Pronouns to Avoid Repetition (he, she, they)",
      "theme": {
        "primary": "#854d0e",
        "tint": "#fef9c3",
        "border": "#fde047"
      },
      "lines": [
        {
          "speaker": "Narrator",
          "text": "On a sunny Saturday morning, Mateo and his cousin Lucia walked into the bustling central plaza of Oaxaca, Mexico."
        },
        {
          "speaker": "Narrator",
          "text": "Colorful paper banners fluttered above the cobblestone streets while marimba music echoed from the town bandstand."
        },
        {
          "speaker": "Mateo",
          "text": "Today is my mother's birthday, Lucia, and we promised to bring home the fresh chocolate bread from Baker Don Pedro's stall!"
        },
        {
          "speaker": "Lucia",
          "text": "The market is enormous, Mateo, and hundreds of shoppers are crowding the aisles—how will we find him?"
        },
        {
          "speaker": "Narrator",
          "text": "Near the fountain, they spotted Weaver Sofia, an artisan who was spinning dyed wool into bright Zapotec rugs."
        },
        {
          "speaker": "Weaver Sofia",
          "text": "Don Pedro moved his bakery stall this morning because workers were repairing the roof in the north hall."
        },
        {
          "speaker": "Narrator",
          "text": "She pointed toward the spice aisle and told the cousins to follow the scent of roasted cinnamon and cocoa beans."
        },
        {
          "speaker": "Narrator",
          "text": "As Mateo and Lucia hurried past stacks of clay pottery and carved wooden animals called alebrijes, a sudden problem arose."
        },
        {
          "speaker": "Narrator",
          "text": "An elderly vendor named Señor Ramos accidentally bumped his wooden cart, and dozens of ripe avocados rolled across the stones!"
        },
        {
          "speaker": "Mateo",
          "text": "Wait, Lucia! Even though we are in a hurry, we cannot leave Señor Ramos to pick up all his fruit alone."
        },
        {
          "speaker": "Narrator",
          "text": "The two cousins knelt on the cobblestones, gathered every single avocado into reed baskets, and lifted them onto his cart."
        },
        {
          "speaker": "Señor Ramos",
          "text": "Thank you both for your kindness! If you are looking for Don Pedro, he is right behind that archway, and he has one loaf left!"
        },
        {
          "speaker": "Narrator",
          "text": "Mateo and Lucia sprinted through the stone archway just as Don Pedro was wrapping his final loaf of warm pan de yema."
        },
        {
          "speaker": "Don Pedro",
          "text": "Señor Ramos waved to me to save this last loaf for two helpful children—here it is, fresh from the brick oven!"
        },
        {
          "speaker": "Lucia",
          "text": "Helping someone in need didn't slow us down at all; in fact, it helped us succeed in our quest!"
        }
      ],
      "vocab": [
        {
          "word": "plaza",
          "part": "noun",
          "def": "A public square or open marketplace in the center of a town or city."
        },
        {
          "word": "cobblestone",
          "part": "noun",
          "def": "Rounded stones used in traditional towns to pave streets and courtyards."
        },
        {
          "word": "aisles",
          "part": "noun",
          "def": "Narrow walkways between rows of market stalls or shelves."
        },
        {
          "word": "artisan",
          "part": "noun",
          "def": "A skilled craftsperson who makes traditional items like rugs or pottery by hand."
        },
        {
          "word": "pottery",
          "part": "noun",
          "def": "Bowls, plates, and vases shaped from wet clay and hardened by heat."
        },
        {
          "word": "vendor",
          "part": "noun",
          "def": "A person who sells goods or fresh food at a market stall or cart."
        },
        {
          "word": "archway",
          "part": "noun",
          "def": "A curved stone entrance or passage beneath an arch."
        },
        {
          "word": "loaf",
          "part": "noun",
          "def": "A shaped mass of bread that is baked in one piece and sliced before eating."
        },
        {
          "word": "oven",
          "part": "noun",
          "def": "An enclosed chamber of brick or metal used for baking bread and roasting food."
        },
        {
          "word": "quest",
          "part": "noun",
          "def": "A determined search or journey made to achieve an important goal."
        }
      ],
      "exercises": [
        {
          "question": "SETTING: Where and when does this story take place?",
          "correct": "On a sunny Saturday morning in the central plaza and market of Oaxaca, Mexico",
          "options": [
            "On a snowy night in a mountain cabin",
            "On a Tuesday morning inside a science laboratory"
          ],
          "tip": "Check lines 1 and 2."
        },
        {
          "question": "CHARACTERS: Who are the two main characters on a quest in the market?",
          "correct": "Mateo and his cousin Lucia",
          "options": [
            "Daniel and his sister Maya",
            "Kenji and his grandmother"
          ],
          "tip": "Read line 1."
        },
        {
          "question": "PLOT (GOAL): Why did Mateo and Lucia come to the market?",
          "correct": "To buy fresh chocolate bread from Don Pedro's stall for Mateo's mother's birthday",
          "options": [
            "To sell woven rugs to tourists",
            "To repair the roof of the north hall"
          ],
          "tip": "Check line 3."
        },
        {
          "question": "PLOT (CONFLICT 1): Why wasn't Don Pedro at his usual spot in the north hall?",
          "correct": "He moved his stall because workers were repairing the roof",
          "options": [
            "He closed his bakery for the summer",
            "He went on a fishing trip"
          ],
          "tip": "Read Weaver Sofia's explanation in line 6."
        },
        {
          "question": "What clue did Weaver Sofia give the cousins to find Don Pedro's new location?",
          "correct": "Follow the scent of roasted cinnamon and cocoa beans toward the spice aisle",
          "options": [
            "Listen for the sound of a trumpet",
            "Look for a blue flag on the roof"
          ],
          "tip": "Check line 7."
        },
        {
          "question": "In line 7, who does the pronoun 'She' refer to?",
          "correct": "Weaver Sofia",
          "options": [
            "Mateo's mother",
            "Don Pedro"
          ],
          "tip": "Look back at line 5 and 6 to see who was speaking."
        },
        {
          "question": "PLOT (CONFLICT 2): What unexpected event happened while the cousins were hurrying through the market?",
          "correct": "Señor Ramos bumped his cart and dozens of ripe avocados rolled across the stones",
          "options": [
            "A rainstorm flooded the plaza",
            "Mateo lost his wallet in the fountain"
          ],
          "tip": "Read line 9."
        },
        {
          "question": "How did Mateo and Lucia respond when they saw Señor Ramos's spilled avocados?",
          "correct": "They stopped to gather every avocado into reed baskets and lifted them onto his cart",
          "options": [
            "They stepped over the fruit and kept running",
            "They laughed and took photos"
          ],
          "tip": "Check lines 10 and 11."
        },
        {
          "question": "PLOT (CLIMAX): How did helping Señor Ramos actually help Mateo and Lucia?",
          "correct": "Señor Ramos directed them through the archway and signaled Don Pedro to save the last loaf",
          "options": [
            "Señor Ramos baked a cake for them",
            "Señor Ramos drove them home in his truck"
          ],
          "tip": "Read lines 12–14."
        },
        {
          "question": "PLOT (RESOLUTION): What lesson does Lucia state at the end of the story?",
          "correct": "Helping someone in need helped them succeed in their quest",
          "options": [
            "Never visit a busy market on Saturday",
            "Avocados are better than birthday bread"
          ],
          "tip": "Check line 15."
        }
      ]
    }
  ],
  "6": [
    {
      "id": "g6-u1",
      "title": "A Visit to the Aquarium",
      "type": "Story · Topic 1: What's in the Water? (Science)",
      "skill": "Identify the Point of View (1st vs. 3rd Person)",
      "writingGoal": "Detailed Description — Sequencers (first, next, then, finally)",
      "theme": {
        "primary": "#115e59",
        "tint": "#ccfbf1",
        "border": "#99f6e4"
      },
      "lines": [
        {
          "speaker": "Lucas (1st Person)",
          "text": "First, I stepped through the revolving doors of the Monterey Bay Aquarium with my sketchpad tucked under my arm."
        },
        {
          "speaker": "Lucas (1st Person)",
          "text": "Above my head, life-sized fiberglass models of humpback whales hung suspended from the high ceiling."
        },
        {
          "speaker": "Lucas (1st Person)",
          "text": "Next, my science partner Elena and I walked into the Kelp Forest gallery, where a three-story window towered before us."
        },
        {
          "speaker": "Lucas (1st Person)",
          "text": "Through the thick acrylic glass, I watched giant fronds of golden kelp swaying gently in the artificial ocean currents."
        },
        {
          "speaker": "Lucas (1st Person)",
          "text": "Silvery sardines swam in a tightly synchronized school, darting left and right as if they shared a single brain."
        },
        {
          "speaker": "Lucas (1st Person)",
          "text": "Then, we followed the blue floor arrows into a dimly lit acrylic tunnel that curved right across the shark lagoon."
        },
        {
          "speaker": "Lucas (1st Person)",
          "text": "I held my breath as a spotted leopard shark and a giant manta ray glided effortlessly just inches above my hair!"
        },
        {
          "speaker": "Lucas (1st Person)",
          "text": "With its wide pectoral fins stretched out like wings, the manta ray looked like a silent underwater eagle."
        },
        {
          "speaker": "Lucas (1st Person)",
          "text": "In the adjacent hall, glowing jellyfish pulsed rhythmically inside circular tanks lit with sapphire blue lights."
        },
        {
          "speaker": "Lucas (1st Person)",
          "text": "I carefully sketched their translucent bells and trailing tentacles in my notebook for our marine biology report."
        },
        {
          "speaker": "Lucas (1st Person)",
          "text": "Afterward, an aquarium biologist invited our group to the rocky intertidal touch pool."
        },
        {
          "speaker": "Lucas (1st Person)",
          "text": "Before dipping my fingers into the chilled saltwater, I washed my hands at the sink to protect the delicate creatures."
        },
        {
          "speaker": "Lucas (1st Person)",
          "text": "I gently touched the bumpy, spiny skin of a purple sea star and felt a hermit crab tickle my palm."
        },
        {
          "speaker": "Lucas (1st Person)",
          "text": "Finally, we gathered on the outdoor observation deck to watch playful sea otters floating on their backs in the bay."
        },
        {
          "speaker": "Lucas (1st Person)",
          "text": "Seeing these diverse marine ecosystems with my own eyes made me determined to help protect our oceans from plastic pollution."
        }
      ],
      "vocab": [
        {
          "word": "aquarium",
          "part": "noun",
          "def": "A building with large transparent tanks where aquatic plants and animals are exhibited."
        },
        {
          "word": "suspended",
          "part": "adjective",
          "def": "Hung from above so that it is supported without touching the ground."
        },
        {
          "word": "currents",
          "part": "noun",
          "def": "Continuous, directed movements of water flowing through an ocean or tank."
        },
        {
          "word": "synchronized",
          "part": "adjective",
          "def": "Moving or occurring at the exact same time and speed in harmony."
        },
        {
          "word": "glided",
          "part": "verb",
          "def": "Moved smoothly, continuously, and effortlessly through water or air."
        },
        {
          "word": "pectoral",
          "part": "adjective",
          "def": "Relating to the chest or breast area, such as the side fins of a fish or ray."
        },
        {
          "word": "translucent",
          "part": "adjective",
          "def": "Allowing light to pass through partially so objects behind are faintly visible."
        },
        {
          "word": "tentacles",
          "part": "noun",
          "def": "Slender, flexible limbs around the mouth or body of invertebrates like jellyfish and octopuses."
        },
        {
          "word": "marine",
          "part": "adjective",
          "def": "Relating to, found in, or produced by the sea or ocean."
        },
        {
          "word": "intertidal",
          "part": "adjective",
          "def": "Relating to the rocky shore area that is above water at low tide and underwater at high tide."
        }
      ],
      "exercises": [
        {
          "question": "POINT OF VIEW: From which point of view is 'A Visit to the Aquarium' narrated, and how can you tell?",
          "correct": "First-person point of view, because the narrator Lucas uses pronouns like 'I', 'my', 'we', and 'us'",
          "options": [
            "Third-person point of view, because an outside narrator only uses 'he' and 'she'",
            "Second-person point of view, because every sentence gives commands with 'you'"
          ],
          "tip": "Look at the pronouns in every line ('I stepped', 'my sketchpad', 'we walked')."
        },
        {
          "question": "What did Lucas see suspended from the high ceiling when he first entered the aquarium?",
          "correct": "Life-sized fiberglass models of humpback whales",
          "options": [
            "Real wooden pirate ships",
            "Giant glass chandeliers"
          ],
          "tip": "Check lines 1 and 2."
        },
        {
          "question": "Where did Lucas and his science partner Elena go next (in line 3)?",
          "correct": "Into the Kelp Forest gallery with a three-story window",
          "options": [
            "To the cafeteria for lunch",
            "Onto a submarine in the harbor"
          ],
          "tip": "Look for the sequencer 'Next' in line 3."
        },
        {
          "question": "How did the silvery sardines move in the Kelp Forest tank?",
          "correct": "In a tightly synchronized school, darting left and right together",
          "options": [
            "Crawling slowly across the sandy bottom",
            "Hiding inside empty shells"
          ],
          "tip": "Read line 5."
        },
        {
          "question": "What creatures glided just inches above Lucas's head in the curved acrylic tunnel?",
          "correct": "A spotted leopard shark and a giant manta ray",
          "options": [
            "A humpback whale and a dolphin",
            "A polar bear and a walrus"
          ],
          "tip": "Check lines 6 and 7."
        },
        {
          "question": "To what bird does Lucas compare the manta ray's pectoral fins?",
          "correct": "A silent underwater eagle",
          "options": [
            "A colourful tropical parrot",
            "A fast peregrine falcon"
          ],
          "tip": "Read line 8."
        },
        {
          "question": "Which two parts of the glowing jellyfish did Lucas sketch in his notebook?",
          "correct": "Their translucent bells and trailing tentacles",
          "options": [
            "Their hard shells and claws",
            "Their dorsal fins and scales"
          ],
          "tip": "Check lines 9 and 10."
        },
        {
          "question": "Why did Lucas wash his hands before dipping his fingers into the intertidal touch pool?",
          "correct": "To protect the delicate creatures in the chilled saltwater",
          "options": [
            "Because his hands were covered in paint",
            "To warm up the water"
          ],
          "tip": "Read line 12."
        },
        {
          "question": "Which two creatures did Lucas feel in the touch pool?",
          "correct": "A purple sea star and a hermit crab",
          "options": [
            "A leopard shark and a jellyfish",
            "A sea otter and a sardine"
          ],
          "tip": "Check line 13."
        },
        {
          "question": "SEQUENCERS: What did the students do 'Finally' at the end of their visit?",
          "correct": "They gathered on the outdoor observation deck to watch sea otters in the bay",
          "options": [
            "They rode the school bus back to class",
            "They fed the humpback whales"
          ],
          "tip": "Look for the sequencer 'Finally' in line 14."
        }
      ]
    },
    {
      "id": "g6-u2",
      "title": "Interview with a Shark Photographer",
      "type": "Interview · Topic 1: What's in the Water? (Science)",
      "skill": "Make Inferences",
      "writingGoal": "Detailed Description — Sequencers (first, next, then, finally)",
      "theme": {
        "primary": "#115e59",
        "tint": "#ccfbf1",
        "border": "#99f6e4"
      },
      "lines": [
        {
          "speaker": "Reporter Sofia",
          "text": "Welcome to Ocean Explorer Magazine! Today we are speaking with Marco Silva, who has spent twenty years photographing wild sharks."
        },
        {
          "speaker": "Marco Silva",
          "text": "It is a pleasure to be here, Sofia! Most people think my job is terrifying, but the ocean is where I feel most peaceful."
        },
        {
          "speaker": "Reporter Sofia",
          "text": "You dive without a metal cage alongside hammerhead and tiger sharks. Why aren't you afraid of them?"
        },
        {
          "speaker": "Marco Silva",
          "text": "Movies portray sharks as monsters, yet in reality they are cautious, misunderstood apex predators that rarely bother calm divers."
        },
        {
          "speaker": "Reporter Sofia",
          "text": "How do you prepare before jumping off the boat into deep blue water?"
        },
        {
          "speaker": "Marco Silva",
          "text": "First, I inspect my scuba regulator and oxygen tank twice, and then I put on a dark wetsuit without any shiny jewelry."
        },
        {
          "speaker": "Reporter Sofia",
          "text": "Why is it important not to wear shiny watches or rings underwater?"
        },
        {
          "speaker": "Marco Silva",
          "text": "In murky water, a flash of silver metal looks just like the scales of a struggling fish, which can attract a shark's curiosity!"
        },
        {
          "speaker": "Reporter Sofia",
          "text": "What happens next once you descend to the coral reef with your underwater camera housing?"
        },
        {
          "speaker": "Marco Silva",
          "text": "Next, I kneel quietly on a sandy patch of the seabed and control my breathing so my air bubbles don't startle the sharks."
        },
        {
          "speaker": "Reporter Sofia",
          "text": "Can you tell how a shark is feeling just by watching the way it swims?"
        },
        {
          "speaker": "Marco Silva",
          "text": "Absolutely! A relaxed shark glides with smooth, slow tail strokes, whereas rapid, jerky turns and lowered fins signal that I should back away."
        },
        {
          "speaker": "Reporter Sofia",
          "text": "Why do sharks play such a critical role in keeping marine ecosystems healthy?"
        },
        {
          "speaker": "Marco Silva",
          "text": "As apex predators, they keep prey populations in balance, which protects seagrass beds and coral reefs from overgrazing."
        },
        {
          "speaker": "Reporter Sofia",
          "text": "Finally, Marco, what do you hope young readers feel when they see your close-up photographs?"
        },
        {
          "speaker": "Marco Silva",
          "text": "Finally, I hope my photographs replace fear with respect and inspire a new generation to advocate for shark conservation!"
        }
      ],
      "vocab": [
        {
          "word": "portray",
          "part": "verb",
          "def": "To describe or show someone or something in a particular way in movies, art, or books."
        },
        {
          "word": "misunderstood",
          "part": "adjective",
          "def": "Incorrectly judged or feared because people do not know the true facts."
        },
        {
          "word": "apex",
          "part": "adjective",
          "def": "At the very top of a food chain, having no natural predators of its own."
        },
        {
          "word": "regulator",
          "part": "noun",
          "def": "A scuba diving device that delivers breathing air from a high-pressure tank at a safe pressure."
        },
        {
          "word": "murky",
          "part": "adjective",
          "def": "Dark, cloudy, and difficult to see through because of stirred-up sand or mud."
        },
        {
          "word": "descend",
          "part": "verb",
          "def": "To move or sink downward from a higher level to a lower depth."
        },
        {
          "word": "seabed",
          "part": "noun",
          "def": "The solid ground or floor at the bottom of the ocean."
        },
        {
          "word": "startle",
          "part": "verb",
          "def": "To cause a person or animal to feel sudden shock, surprise, or alarm."
        },
        {
          "word": "ecosystems",
          "part": "noun",
          "def": "Biological communities of interacting organisms and their physical marine or land environments."
        },
        {
          "word": "advocate",
          "part": "verb",
          "def": "To publicly support, speak up for, or recommend a cause or policy."
        }
      ],
      "exercises": [
        {
          "question": "MAKE INFERENCES: What can you infer about Marco Silva's attitude toward sharks from lines 2–4?",
          "correct": "He deeply respects sharks and understands their natural behavior rather than fearing them",
          "options": [
            "He thinks sharks are mindless monsters like in movies",
            "He prefers photographing land animals in cages"
          ],
          "tip": "Look at how he contrasts movie myths with his real-life experience."
        },
        {
          "question": "For how many years has Marco Silva been photographing wild sharks?",
          "correct": "Twenty years",
          "options": [
            "Two years",
            "Fifty years"
          ],
          "tip": "Check Reporter Sofia's introduction in line 1."
        },
        {
          "question": "What does Marco do 'First' when preparing to dive?",
          "correct": "He inspects his scuba regulator and oxygen tank twice and puts on a dark wetsuit",
          "options": [
            "He jumps into the water with a shiny watch",
            "He feeds fish from the back of the boat"
          ],
          "tip": "Read line 6."
        },
        {
          "question": "MAKE INFERENCES: What might happen if a diver wore a shiny silver bracelet in murky water?",
          "correct": "A shark might mistake the shiny flash for fish scales and swim over to investigate",
          "options": [
            "The bracelet would dissolve in the saltwater",
            "The shark would be frightened and swim miles away"
          ],
          "tip": "Use the clue in line 8."
        },
        {
          "question": "Why does Marco kneel on a sandy patch of the seabed rather than on top of living coral?",
          "correct": "So he can stay still without crushing delicate coral while waiting for sharks",
          "options": [
            "Because sand makes him float upward",
            "Because sharks cannot see sand"
          ],
          "tip": "Infer from his respect for the reef in line 10."
        },
        {
          "question": "Why does Marco control his breathing carefully before pressing his camera shutter?",
          "correct": "So his rising air bubbles do not startle the sharks",
          "options": [
            "Because he does not have an oxygen tank",
            "To make loud noises underwater"
          ],
          "tip": "Check line 10."
        },
        {
          "question": "How can a diver infer that a shark is feeling stressed or agitated?",
          "correct": "It makes rapid, jerky turns and lowers its fins",
          "options": [
            "It glides with smooth, slow tail strokes",
            "It closes its eyes and goes to sleep"
          ],
          "tip": "Read line 12."
        },
        {
          "question": "What should a smart diver do if a shark lowers its fins and swims with jerky movements?",
          "correct": "Calmly back away and give the shark space",
          "options": [
            "Swim closer to touch its tail",
            "Flash a bright light in its eyes"
          ],
          "tip": "Check the end of line 12."
        },
        {
          "question": "Why are apex predators essential to the health of seagrass beds and coral reefs?",
          "correct": "They keep prey populations in balance so reefs are not ruined by overgrazing",
          "options": [
            "They plant new seagrass seeds every spring",
            "They clean plastic out of the water"
          ],
          "tip": "Read line 14."
        },
        {
          "question": "What is Marco's ultimate goal in sharing his close-up shark photographs?",
          "correct": "To replace fear with respect and inspire people to advocate for shark conservation",
          "options": [
            "To convince people never to swim in the ocean",
            "To sell scuba diving regulators"
          ],
          "tip": "Check line 16."
        }
      ]
    },
    {
      "id": "g6-u3",
      "title": "Field Day",
      "type": "Newsletter · Topic 2: What to Wear (Health)",
      "skill": "Identify the Main Idea and Details",
      "writingGoal": "Magazine Article — Headline Capitalization & Hook",
      "theme": {
        "primary": "#115e59",
        "tint": "#ccfbf1",
        "border": "#99f6e4"
      },
      "lines": [
        {
          "speaker": "Headline",
          "text": "Gear Up for Victory: How Smart Clothing Keeps Athletes Safe on Field Day!"
        },
        {
          "speaker": "Newsletter Hook",
          "text": "Are you ready to sprint, jump, and cheer at Friday's Annual Oakridge Field Day? Before you lace up, read this essential health guide!"
        },
        {
          "speaker": "Coach Miller",
          "text": "Main Section 1: Dress for the Forecast. Weather meteorologists predict sunny skies and temperatures reaching 28 degrees Celsius by noon."
        },
        {
          "speaker": "Student Maya",
          "text": "Coach Miller, should we wear dark cotton sweatshirts or lightweight athletic shirts for the morning track events?"
        },
        {
          "speaker": "Coach Miller",
          "text": "Choose loose, breathable fabrics in light colors! Dark clothing absorbs heat from the sun, whereas white or yellow shirts reflect sunlight."
        },
        {
          "speaker": "Nurse Carter",
          "text": "Also, moisture-wicking synthetic shirts pull sweat away from your skin so it can evaporate and cool your body naturally."
        },
        {
          "speaker": "Student Leo",
          "text": "What kind of footwear do we need for the obstacle course and the 400-meter relay race?"
        },
        {
          "speaker": "Coach Miller",
          "text": "Main Section 2: Protect Your Feet. Every competitor must wear supportive running sneakers with tied laces and cushioned rubber soles."
        },
        {
          "speaker": "Nurse Carter",
          "text": "Never wear flip-flops, sandals, or brand-new stiff shoes on Field Day, because they cause painful blisters and twisted ankles."
        },
        {
          "speaker": "Student Maya",
          "text": "What about sun protection while we are waiting on the grassy sidelines between events?"
        },
        {
          "speaker": "Nurse Carter",
          "text": "Main Section 3: Shield Your Skin and Eyes. Apply broad-spectrum sunscreen thirty minutes before going outside, and reapply it after two hours."
        },
        {
          "speaker": "Coach Miller",
          "text": "Wearing a wide-brimmed cap or a sports visor shades your face, and UV-blocking sunglasses protect your eyes from glare."
        },
        {
          "speaker": "Student Leo",
          "text": "Do we need any special safety gear for the afternoon bicycle slalom and inline skating relay?"
        },
        {
          "speaker": "Coach Miller",
          "text": "Yes! A buckled helmet, knee pads, and wrist guards are mandatory for all wheeled events to prevent concussions and scrapes."
        },
        {
          "speaker": "Newsletter Summary",
          "text": "When you dress wisely for the weather and the sport, you stay comfortable, prevent injuries, and perform at your very best!"
        }
      ],
      "vocab": [
        {
          "word": "meteorologists",
          "part": "noun",
          "def": "Scientists who study the atmosphere and forecast the daily weather."
        },
        {
          "word": "breathable",
          "part": "adjective",
          "def": "Allowing air to pass through fabric easily so sweat does not get trapped."
        },
        {
          "word": "evaporate",
          "part": "verb",
          "def": "To turn from liquid sweat or water into vapor in the air, which cools the skin."
        },
        {
          "word": "footwear",
          "part": "noun",
          "def": "Outer coverings for the feet, such as shoes, sneakers, sandals, and boots."
        },
        {
          "word": "supportive",
          "part": "adjective",
          "def": "Providing firm balance and protection to the arches and ankles of the feet."
        },
        {
          "word": "blisters",
          "part": "noun",
          "def": "Small, painful bubbles on the skin caused by friction from ill-fitting shoes."
        },
        {
          "word": "sidelines",
          "part": "noun",
          "def": "The areas just outside the boundaries of a sports field where players wait and watch."
        },
        {
          "word": "visor",
          "part": "noun",
          "def": "A stiff brim on a cap that shades the forehead and eyes from the sun."
        },
        {
          "word": "mandatory",
          "part": "adjective",
          "def": "Required by rules; compulsory and not optional."
        },
        {
          "word": "concussions",
          "part": "noun",
          "def": "Brain injuries caused by a hard blow or fall to the head."
        }
      ],
      "exercises": [
        {
          "question": "MAIN IDEA: What is the central main idea of the entire 'Field Day' newsletter?",
          "correct": "Wearing appropriate, protective clothing and gear for the weather and sport keeps athletes safe and performing well",
          "options": [
            "How to win first place in the 400-meter relay race",
            "Why Field Day should be held indoors in winter"
          ],
          "tip": "Compare the Headline (line 1) and the Newsletter Summary (line 15)."
        },
        {
          "question": "Look at the Headline in line 1: how are words capitalized in a magazine or newsletter headline?",
          "correct": "All major words (nouns, verbs, adjectives) are capitalized, while short prepositions like 'for' and 'on' are lowercase",
          "options": [
            "Only the very first word of the headline is capitalized",
            "Every word is written in all lowercase letters"
          ],
          "tip": "Examine 'Gear Up for Victory: How Smart Clothing Keeps Athletes Safe on Field Day!'"
        },
        {
          "question": "How does the Newsletter Hook in line 2 grab the reader's attention?",
          "correct": "By asking an exciting question about Friday's Field Day",
          "options": [
            "By listing twenty rules in alphabetical order",
            "By telling a sad story about rain"
          ],
          "tip": "Check the punctuation at the end of the first sentence in line 2."
        },
        {
          "question": "What weather do meteorologists forecast for Friday's Field Day?",
          "correct": "Sunny skies and temperatures reaching 28 degrees Celsius by noon",
          "options": [
            "Freezing rain and strong winds",
            "Cloudy fog and snow flurries"
          ],
          "tip": "Read line 3."
        },
        {
          "question": "DETAIL: Why should students wear light-colored shirts instead of dark shirts on a sunny day?",
          "correct": "Light colors reflect sunlight, whereas dark clothing absorbs heat from the sun",
          "options": [
            "Light colors make you invisible to the referee",
            "Dark shirts shrink in the wind"
          ],
          "tip": "Check Coach Miller's detail in line 5."
        },
        {
          "question": "How do moisture-wicking fabrics help cool an athlete's body?",
          "correct": "They pull sweat away from the skin so it can evaporate naturally",
          "options": [
            "They freeze into ice cubes when wet",
            "They block all air from touching the skin"
          ],
          "tip": "Read Nurse Carter's explanation in line 6."
        },
        {
          "question": "DETAIL: Why are flip-flops, sandals, and stiff new shoes prohibited on Field Day?",
          "correct": "Because they cause painful blisters and twisted ankles",
          "options": [
            "Because they are too expensive",
            "Because they mark up the grass"
          ],
          "tip": "Check line 9."
        },
        {
          "question": "When should students apply broad-spectrum sunscreen, and when should they reapply it?",
          "correct": "Apply thirty minutes before going outside, and reapply after two hours",
          "options": [
            "Apply only after getting a sunburn",
            "Apply once a week on Monday"
          ],
          "tip": "Read line 11."
        },
        {
          "question": "What two items protect an athlete's face and eyes from sun glare on the sidelines?",
          "correct": "A wide-brimmed cap (or visor) and UV-blocking sunglasses",
          "options": [
            "A wool scarf and ski goggles",
            "An umbrella and a raincoat"
          ],
          "tip": "Look at line 12."
        },
        {
          "question": "What safety equipment is mandatory for the afternoon wheeled events?",
          "correct": "A buckled helmet, knee pads, and wrist guards",
          "options": [
            "Swim fins and a snorkel",
            "Cleats and a baseball mitt"
          ],
          "tip": "Check line 14."
        }
      ]
    },
    {
      "id": "g6-u4",
      "title": "Who Was That?",
      "type": "Story · Topic 2: What to Wear (Health & Drama)",
      "skill": "Identify the Main Idea and Theme",
      "writingGoal": "Magazine Article — Headline Capitalization & Hook",
      "theme": {
        "primary": "#115e59",
        "tint": "#ccfbf1",
        "border": "#99f6e4"
      },
      "lines": [
        {
          "speaker": "Narrator",
          "text": "Backstage at the Oakridge Middle School theater, the costume rack collapsed with a loud metallic crash!"
        },
        {
          "speaker": "Director Ms. Lin",
          "text": "The curtain rises for our historical mystery play in twenty minutes, and all of our garments are mixed together!"
        },
        {
          "speaker": "Narrator",
          "text": "Julian, the quietest sixth grader on the stage crew, stared at the tangled pile of cloaks, hats, and boots."
        },
        {
          "speaker": "Chloe",
          "text": "Even worse, Julian, our lead actor Sam just lost his voice from a sore throat and cannot go on stage as Detective Vance!"
        },
        {
          "speaker": "Director Ms. Lin",
          "text": "Julian, you have operated the spotlight at every rehearsal—do you know Detective Vance's lines?"
        },
        {
          "speaker": "Julian",
          "text": "I have whispered every single scene from the wings, Ms. Lin, but everyone in the audience knows how shy I am!"
        },
        {
          "speaker": "Chloe",
          "text": "Wait until you put on the detective's attire, Julian; a great costume transforms how you feel inside."
        },
        {
          "speaker": "Narrator",
          "text": "First, Julian sorted the fallen wardrobe by historical era so the other actors could dress quickly."
        },
        {
          "speaker": "Narrator",
          "text": "Next, he slipped into the detective's double-breasted trench coat, tilted the felt fedora over his brow, and picked up the brass magnifying glass."
        },
        {
          "speaker": "Narrator",
          "text": "When Julian glanced into the dressing-room mirror, he barely recognized the confident figure staring back at him."
        },
        {
          "speaker": "Narrator",
          "text": "As the heavy velvet curtain parted, Julian stepped into the warm amber glow of the stage lights."
        },
        {
          "speaker": "Audience Member",
          "text": "Look at the posture and voice of that detective on stage—who is that remarkable actor?"
        },
        {
          "speaker": "Narrator",
          "text": "For three full acts, Julian delivered every clue and monologue with crisp diction and dramatic flair."
        },
        {
          "speaker": "Narrator",
          "text": "When the mystery concluded, the entire auditorium erupted in applause, and Julian removed his fedora to take a bow."
        },
        {
          "speaker": "Julian",
          "text": "The trench coat gave me the courage to step onto the stage, but the confidence inside me was mine all along!"
        }
      ],
      "vocab": [
        {
          "word": "garments",
          "part": "noun",
          "def": "Articles of clothing, especially costumes or formal clothes."
        },
        {
          "word": "rehearsal",
          "part": "noun",
          "def": "A practice performance of a play or concert before the real audience arrives."
        },
        {
          "word": "attire",
          "part": "noun",
          "def": "Clothes, especially of a distinctive or formal kind."
        },
        {
          "word": "transforms",
          "part": "verb",
          "def": "Changes the appearance, character, or feeling of someone completely."
        },
        {
          "word": "wardrobe",
          "part": "noun",
          "def": "The collection of costumes and clothing belonging to a theater company or person."
        },
        {
          "word": "fedora",
          "part": "noun",
          "def": "A low, soft felt hat with a curled brim and a lengthwise crease in the crown."
        },
        {
          "word": "posture",
          "part": "noun",
          "def": "The way a person holds their shoulders, spine, and body when standing or walking."
        },
        {
          "word": "monologue",
          "part": "noun",
          "def": "A long dramatic speech delivered by a single actor on stage."
        },
        {
          "word": "diction",
          "part": "noun",
          "def": "Clarity and distinctness in pronouncing words when speaking or acting."
        },
        {
          "word": "auditorium",
          "part": "noun",
          "def": "The large hall in a school or theater where the audience sits to watch a performance."
        }
      ],
      "exercises": [
        {
          "question": "MAIN IDEA: What is the main idea (plot summary) of the story 'Who Was That?'?",
          "correct": "Shy stagehand Julian steps in for an ill actor, wears the detective costume, and gives a confident performance",
          "options": [
            "A school play is canceled because the costumes are ruined",
            "Sam wins an award for building the stage scenery"
          ],
          "tip": "Summarize what happens from beginning to end."
        },
        {
          "question": "THEME: What is the deeper theme (life lesson) revealed at the end of the story?",
          "correct": "Stepping into a new role can help you discover the courage and confidence that was already inside you",
          "options": [
            "Only loud people can be good actors",
            "You should never help when a problem happens backstage"
          ],
          "tip": "Read Julian's realization in line 15."
        },
        {
          "question": "What two emergencies happened backstage twenty minutes before the play started?",
          "correct": "The costume rack collapsed and lead actor Sam lost his voice",
          "options": [
            "The lights went out and the scripts were lost",
            "The audience arrived on the wrong night"
          ],
          "tip": "Check lines 1–4."
        },
        {
          "question": "How did Julian already know all of Detective Vance's lines?",
          "correct": "He had operated the spotlight at every rehearsal and whispered every scene from the wings",
          "options": [
            "He wrote the play himself last summer",
            "He read the script on the bus that morning"
          ],
          "tip": "Read lines 5 and 6."
        },
        {
          "question": "Why was Julian hesitant to go on stage at first?",
          "correct": "Because he was very shy in front of an audience",
          "options": [
            "Because he disliked mystery stories",
            "Because his foot was injured"
          ],
          "tip": "Check line 6."
        },
        {
          "question": "How did Julian help the rest of the cast before putting on his own costume?",
          "correct": "He sorted the fallen wardrobe by historical era",
          "options": [
            "He ironed everyone's shoes",
            "He painted the backdrop"
          ],
          "tip": "Read line 8."
        },
        {
          "question": "Which three items made up Detective Vance's costume?",
          "correct": "A double-breasted trench coat, a felt fedora, and a brass magnifying glass",
          "options": [
            "A superhero cape, a mask, and boots",
            "A lab coat, goggles, and a microscope"
          ],
          "tip": "Look at line 9."
        },
        {
          "question": "Why did an audience member ask 'Who is that remarkable actor?' in line 12?",
          "correct": "Because Julian's confident posture, costume, and voice made him unrecognizable as the shy stagehand",
          "options": [
            "Because the stage was completely dark",
            "Because Julian wore a Halloween mask"
          ],
          "tip": "Check lines 10–12."
        },
        {
          "question": "How did Julian deliver his clues and monologues during the three acts?",
          "correct": "With crisp diction and dramatic flair",
          "options": [
            "In a quiet, nervous whisper",
            "By reading from a notebook"
          ],
          "tip": "Read line 13."
        },
        {
          "question": "When did the audience realize that Detective Vance was actually Julian?",
          "correct": "When he removed his fedora to take a bow during the applause",
          "options": [
            "Before the curtain opened",
            "When he tripped over the microphone"
          ],
          "tip": "Check line 14."
        }
      ]
    },
    {
      "id": "g6-u5",
      "title": "Lost and Found",
      "type": "Story · Topic 3: From Here to There (Geography)",
      "skill": "Identify and Analyze the Setting",
      "writingGoal": "Process Essay — Purpose Clauses (in order to, so that)",
      "theme": {
        "primary": "#115e59",
        "tint": "#ccfbf1",
        "border": "#99f6e4"
      },
      "lines": [
        {
          "speaker": "Narrator",
          "text": "At four o'clock in the afternoon, thick silver mist began creeping across the granite ridges of Cascade Valley."
        },
        {
          "speaker": "Narrator",
          "text": "Twelve-year-old Owen and his older sister Clara were hiking back from Mirror Lake along a narrow pine trail."
        },
        {
          "speaker": "Clara",
          "text": "Notice how the shadows are lengthening between the hemlock trees, Owen, and the air is turning damp and chilly."
        },
        {
          "speaker": "Owen",
          "text": "Wait, Clara—the trail splits into two forks right here by this fallen cedar log, and the wooden signpost is broken!"
        },
        {
          "speaker": "Narrator",
          "text": "Owen tapped his smartphone screen in order to check their GPS location, but the battery icon flashed red and died."
        },
        {
          "speaker": "Owen",
          "text": "Oh no! Without a digital signal in this deep canyon, how will we know which fork leads down to the ranger station?"
        },
        {
          "speaker": "Clara",
          "text": "Stay calm, Owen! Dad taught us always to pack a waterproof topographic map and a magnetic compass so that we never rely only on batteries."
        },
        {
          "speaker": "Narrator",
          "text": "Clara knelt on a flat boulder and spread out the paper map in order to study the surrounding terrain."
        },
        {
          "speaker": "Clara",
          "text": "First, let's hold the compass flat in my palm so that the red magnetic needle can swing freely toward north."
        },
        {
          "speaker": "Narrator",
          "text": "Next, she rotated the compass bezel until the orienting arrow lined up directly with the red needle."
        },
        {
          "speaker": "Owen",
          "text": "Look at the brown contour lines on the map! On the left fork, the lines are packed tightly together."
        },
        {
          "speaker": "Clara",
          "text": "Tightly packed contour lines mean a steep cliff, whereas widely spaced lines on the right fork show a gentle slope downward."
        },
        {
          "speaker": "Owen",
          "text": "Also, the map shows a blue dashed line for Rush Creek running parallel to the right-hand trail!"
        },
        {
          "speaker": "Narrator",
          "text": "They listened carefully in the quiet forest and heard rushing water echoing from the right fork."
        },
        {
          "speaker": "Narrator",
          "text": "Following the compass bearing and the sound of the creek, Owen and Clara reached the warm lantern light of the ranger station before dusk."
        }
      ],
      "vocab": [
        {
          "word": "granite",
          "part": "noun",
          "def": "A very hard, gray or pink crystalline rock that forms many mountain ridges."
        },
        {
          "word": "canyon",
          "part": "noun",
          "def": "A deep, narrow gorge with steep rocky sides, often carved by a river."
        },
        {
          "word": "topographic",
          "part": "adjective",
          "def": "Showing the natural features and elevation of land using contour lines on a map."
        },
        {
          "word": "compass",
          "part": "noun",
          "def": "An instrument containing a magnetized pointer that shows the direction of magnetic north."
        },
        {
          "word": "terrain",
          "part": "noun",
          "def": "A stretch of land, especially with regard to its physical features like hills, rocks, and forests."
        },
        {
          "word": "bezel",
          "part": "noun",
          "def": "The rotating outer ring on a compass or watch marked with degrees of direction."
        },
        {
          "word": "contour",
          "part": "noun",
          "def": "A line on a map joining points of equal height above sea level to show steepness."
        },
        {
          "word": "slope",
          "part": "noun",
          "def": "A surface of land where one end is at a higher level than another; a hillside."
        },
        {
          "word": "parallel",
          "part": "adjective",
          "def": "Side by side and keeping the same distance continuously between two lines or paths."
        },
        {
          "word": "bearing",
          "part": "noun",
          "def": "The exact compass direction from one point to another, measured in degrees."
        }
      ],
      "exercises": [
        {
          "question": "ANALYZE THE SETTING: What details in lines 1–3 make the setting of Cascade Valley challenging for the hikers?",
          "correct": "It is late afternoon (4:00 PM), thick mist is creeping in, shadows are lengthening, and the air is turning damp and chilly",
          "options": [
            "It is noon in a hot sandy desert with no shade",
            "They are inside a crowded city subway station"
          ],
          "tip": "Look at the time, weather, and landscape clues in lines 1–3."
        },
        {
          "question": "What obstacle did Owen and Clara encounter by the fallen cedar log?",
          "correct": "The trail split into two forks and the wooden signpost was broken",
          "options": [
            "A locked iron gate blocked the path",
            "A bridge had washed away in a flood"
          ],
          "tip": "Check line 4."
        },
        {
          "question": "Why couldn't Owen use his smartphone to find their location?",
          "correct": "The battery died and there was no digital signal in the deep canyon",
          "options": [
            "He dropped his phone into Mirror Lake",
            "He forgot his password"
          ],
          "tip": "Read lines 5 and 6."
        },
        {
          "question": "PURPOSE CLAUSE: Why had Clara packed a waterproof topographic map and magnetic compass?",
          "correct": "So that they would never rely only on batteries",
          "options": [
            "In order to draw pictures of birds",
            "So that her backpack would feel heavier"
          ],
          "tip": "Check the 'so that' clause in line 7."
        },
        {
          "question": "Why did Clara hold the compass flat in her palm in line 9?",
          "correct": "So that the red magnetic needle could swing freely toward north",
          "options": [
            "In order to catch raindrops",
            "So that the glass would reflect sunlight"
          ],
          "tip": "Read line 9."
        },
        {
          "question": "What do brown contour lines on a topographic map represent?",
          "correct": "The elevation and steepness of the terrain",
          "options": [
            "The number of trees in the forest",
            "The temperature of the air"
          ],
          "tip": "Check lines 11 and 12."
        },
        {
          "question": "What did the tightly packed contour lines on the left fork indicate?",
          "correct": "A dangerous steep cliff",
          "options": [
            "A flat grassy meadow",
            "A paved highway"
          ],
          "tip": "Read line 12."
        },
        {
          "question": "How did the contour lines on the right fork look, and what did they mean?",
          "correct": "They were widely spaced, showing a gentle slope downward",
          "options": [
            "They were drawn in red ink, showing a volcano",
            "They formed a circle, showing a deep hole"
          ],
          "tip": "Check line 12."
        },
        {
          "question": "What natural feature ran parallel to the right-hand trail on the map?",
          "correct": "Rush Creek (shown as a blue dashed line)",
          "options": [
            "A railroad track",
            "A stone wall"
          ],
          "tip": "Look at line 13."
        },
        {
          "question": "How did the setting sensory detail in line 14 confirm that their map reading was correct?",
          "correct": "They heard the sound of rushing water echoing from the right fork",
          "options": [
            "They smelled smoke from a chimney",
            "They saw car headlights on the left fork"
          ],
          "tip": "Read lines 14 and 15."
        }
      ]
    },
    {
      "id": "g6-u6",
      "title": "The World of Orienteering",
      "type": "Article & Briefing · Topic 3: From Here to There (Sports & Geography)",
      "skill": "Use Visuals (Maps, Keys, Diagrams, Flags)",
      "writingGoal": "Process Essay — Purpose Clauses (in order to, so that)",
      "theme": {
        "primary": "#115e59",
        "tint": "#ccfbf1",
        "border": "#99f6e4"
      },
      "lines": [
        {
          "speaker": "Instructor Erik",
          "text": "Welcome to the Scandinavian Orienteering Club! Orienteering is an exciting outdoor sport that combines cross-country running with navigation."
        },
        {
          "speaker": "Cadet Maya",
          "text": "Instructor Erik, how is an orienteering course different from a regular track race?"
        },
        {
          "speaker": "Instructor Erik",
          "text": "In a regular race, runners follow a marked lane, whereas in orienteering you must use a detailed map in order to find hidden checkpoints!"
        },
        {
          "speaker": "Cadet Liam",
          "text": "Look at the Visual Map Key in Diagram A: what do the purple triangle and the numbered purple circles represent?"
        },
        {
          "speaker": "Instructor Erik",
          "text": "The purple triangle marks the Starting Point, the numbered circles show the checkpoints in order, and the double circle marks the Finish!"
        },
        {
          "speaker": "Cadet Maya",
          "text": "What do the different background colors on the map key tell a runner?"
        },
        {
          "speaker": "Instructor Erik",
          "text": "White represents open forest where you can run fast, while dark green indicates thick bushes that will slow you down."
        },
        {
          "speaker": "Cadet Liam",
          "text": "And the map key shows that yellow areas are open grassy clearings, while blue symbols mark marshes, streams, and ponds!"
        },
        {
          "speaker": "Instructor Erik",
          "text": "Correct! Smart athletes study the map key first so that they can choose the fastest route around obstacles."
        },
        {
          "speaker": "Cadet Maya",
          "text": "Look at Diagram B: what does a checkpoint look like when we find it in the real forest?"
        },
        {
          "speaker": "Instructor Erik",
          "text": "Each checkpoint—called a 'control'—is marked by a three-sided orange-and-white nylon flag hanging from a stake."
        },
        {
          "speaker": "Cadet Liam",
          "text": "Why does every competitor wear a small plastic electronic tag on their finger?"
        },
        {
          "speaker": "Instructor Erik",
          "text": "You insert that electronic finger-stick into the box at each flag in order to record the exact second you arrived."
        },
        {
          "speaker": "Cadet Maya",
          "text": "What happens if a runner visits Checkpoint 4 before Checkpoint 3?"
        },
        {
          "speaker": "Instructor Erik",
          "text": "You must visit every control in numerical sequence so that your electronic scorecard is valid at the finish line!"
        }
      ],
      "vocab": [
        {
          "word": "orienteering",
          "part": "noun",
          "def": "A competitive sport in which runners navigate across unfamiliar land using a map and compass."
        },
        {
          "word": "navigation",
          "part": "noun",
          "def": "The science and skill of figuring out your position and planning a route from one place to another."
        },
        {
          "word": "checkpoints",
          "part": "noun",
          "def": "Designated locations along a course where competitors must check in to prove they followed the route."
        },
        {
          "word": "diagram",
          "part": "noun",
          "def": "A simplified drawing or chart with labels that explains how something works."
        },
        {
          "word": "clearings",
          "part": "noun",
          "def": "Open areas of grass within a forest where there are no trees."
        },
        {
          "word": "marshes",
          "part": "noun",
          "def": "Low-lying wet land areas that are muddy and often covered in shallow water."
        },
        {
          "word": "obstacles",
          "part": "noun",
          "def": "Things that block one's way or make forward progress more difficult."
        },
        {
          "word": "nylon",
          "part": "noun",
          "def": "A tough, lightweight, weather-resistant synthetic fabric used for flags and outdoor gear."
        },
        {
          "word": "numerical",
          "part": "adjective",
          "def": "Arranged in order according to numbers (1, 2, 3, etc.)."
        },
        {
          "word": "valid",
          "part": "adjective",
          "def": "Officially acceptable and counting toward the final score according to the rules."
        }
      ],
      "exercises": [
        {
          "question": "What two skills does the outdoor sport of orienteering combine?",
          "correct": "Cross-country running and map/compass navigation",
          "options": [
            "Swimming and bicycle racing",
            "Archery and horseback riding"
          ],
          "tip": "Check line 1."
        },
        {
          "question": "How does an orienteering course differ from a regular track race?",
          "correct": "Runners use a map in order to find hidden checkpoints instead of following a marked lane",
          "options": [
            "Runners must run backward the whole way",
            "It only takes place indoors"
          ],
          "tip": "Read line 3."
        },
        {
          "question": "USE VISUALS (Map Key): What do the purple triangle and double purple circle represent on an orienteering map?",
          "correct": "The purple triangle is the Starting Point, and the double circle is the Finish",
          "options": [
            "The triangle is a mountain peak, and the double circle is a lake",
            "They show where the cafeteria and parking lot are"
          ],
          "tip": "Check lines 4 and 5."
        },
        {
          "question": "USE VISUALS (Map Colors): On an orienteering map, what is the difference between white areas and dark green areas?",
          "correct": "White represents open forest for fast running, while dark green shows thick bushes that slow you down",
          "options": [
            "White means deep snow, while dark green means grass",
            "White means paved roads, while dark green means water"
          ],
          "tip": "Read line 7."
        },
        {
          "question": "What do yellow and blue colors represent on the map key?",
          "correct": "Yellow represents open grassy clearings, and blue represents marshes, streams, and ponds",
          "options": [
            "Yellow means desert sand, and blue means sky",
            "Yellow means checkpoints, and blue means cliffs"
          ],
          "tip": "Look at line 8."
        },
        {
          "question": "PURPOSE CLAUSE: Why do smart athletes study the map key before starting?",
          "correct": "So that they can choose the fastest route around obstacles",
          "options": [
            "In order to memorize the names of all the trees",
            "So that they can draw a new map"
          ],
          "tip": "Check line 9."
        },
        {
          "question": "USE VISUALS (Diagram B): How is a checkpoint ('control') marked in the real forest?",
          "correct": "By a three-sided orange-and-white nylon flag hanging from a stake",
          "options": [
            "By a flashing red traffic light",
            "By a wooden chest painted gold"
          ],
          "tip": "Read lines 10 and 11."
        },
        {
          "question": "What do competitors wear on their finger during the race?",
          "correct": "A small plastic electronic tag (finger-stick)",
          "options": [
            "A gold wedding ring",
            "A magnetic whistle"
          ],
          "tip": "Check lines 12 and 13."
        },
        {
          "question": "PURPOSE CLAUSE: Why do runners insert their electronic finger-stick into the box at each flag?",
          "correct": "In order to record the exact second they arrived at that checkpoint",
          "options": [
            "So that the flag changes color",
            "In order to unlock a snack box"
          ],
          "tip": "Read line 13."
        },
        {
          "question": "What rule must a runner follow for their electronic scorecard to be valid at the finish line?",
          "correct": "They must visit every checkpoint in numerical sequence",
          "options": [
            "They must visit the checkpoints in reverse order",
            "They only need to find half of the flags"
          ],
          "tip": "Check lines 14 and 15."
        }
      ]
    },
    {
      "id": "g6-u7",
      "title": "Languages We Use",
      "type": "Article & Data Seminar · Topic 4: A World of Words (Social Studies)",
      "skill": "Understand a Bar Graph",
      "writingGoal": "Review — Examples (for example, for instance, such as)",
      "theme": {
        "primary": "#115e59",
        "tint": "#ccfbf1",
        "border": "#99f6e4"
      },
      "lines": [
        {
          "speaker": "Dr. Chen",
          "text": "Welcome to our Global Linguistics Seminar! Today we are examining a bar graph of the world's most spoken languages."
        },
        {
          "speaker": "Amina",
          "text": "Dr. Chen, what do the horizontal axis and the vertical axis on this bar graph represent?"
        },
        {
          "speaker": "Dr. Chen",
          "text": "The horizontal x-axis lists the names of ten major languages, while the vertical y-axis measures speakers in hundreds of millions."
        },
        {
          "speaker": "Noah",
          "text": "Why does each language have two bars of different colors standing side by side?"
        },
        {
          "speaker": "Dr. Chen",
          "text": "Great observation! The dark teal bar shows native speakers, whereas the light gold bar shows total speakers including second-language learners."
        },
        {
          "speaker": "Amina",
          "text": "Look at the dark teal bars first: Mandarin Chinese has the tallest native-speaker bar at over 900 million people!"
        },
        {
          "speaker": "Noah",
          "text": "And Spanish has the second-tallest native-speaker bar at around 485 million, which is higher than English's native bar of 380 million."
        },
        {
          "speaker": "Dr. Chen",
          "text": "Now compare the light gold bars for total speakers! Which language has the tallest bar overall?"
        },
        {
          "speaker": "Amina",
          "text": "English reaches nearly 1,450 million total speakers because so many people learn it as a second or third language!"
        },
        {
          "speaker": "Dr. Chen",
          "text": "Exactly! English serves as a global lingua franca in international fields, such as aviation, science, medicine, and diplomacy."
        },
        {
          "speaker": "Noah",
          "text": "Look at Hindi and Arabic on the bar graph: for instance, Hindi has over 600 million total speakers across India and the diaspora."
        },
        {
          "speaker": "Dr. Chen",
          "text": "Today, students use interactive digital apps and multilingual websites to practice new vocabularies and scripts."
        },
        {
          "speaker": "Amina",
          "text": "For example, our school language club uses audio flashcards to study Japanese characters and French pronunciation."
        },
        {
          "speaker": "Dr. Chen",
          "text": "Learning a second language strengthens your memory and helps you appreciate diverse cultures and literature."
        },
        {
          "speaker": "Noah",
          "text": "Looking at this bar graph proves that being bilingual or multilingual connects you to billions of people worldwide!"
        }
      ],
      "vocab": [
        {
          "word": "linguistics",
          "part": "noun",
          "def": "The scientific study of human language, including its structure, history, and use."
        },
        {
          "word": "horizontal",
          "part": "adjective",
          "def": "Running flat from left to right, parallel to the horizon (like the x-axis on a graph)."
        },
        {
          "word": "vertical",
          "part": "adjective",
          "def": "Standing upright from bottom to top, perpendicular to the horizon (like the y-axis)."
        },
        {
          "word": "native",
          "part": "adjective",
          "def": "Learned from birth as a person's first and primary home language."
        },
        {
          "word": "aviation",
          "part": "noun",
          "def": "The flying and operating of aircraft and international air travel."
        },
        {
          "word": "diplomacy",
          "part": "noun",
          "def": "The profession and skill of managing peaceful relations and treaties between countries."
        },
        {
          "word": "diaspora",
          "part": "noun",
          "def": "Communities of people who have spread or migrated from their original homeland to other countries."
        },
        {
          "word": "multilingual",
          "part": "adjective",
          "def": "Using or able to speak more than two languages fluently."
        },
        {
          "word": "pronunciation",
          "part": "noun",
          "def": "The way in which a word or language is spoken aloud."
        },
        {
          "word": "bilingual",
          "part": "adjective",
          "def": "Able to speak and understand two languages with ease."
        }
      ],
      "exercises": [
        {
          "question": "UNDERSTAND A BAR GRAPH: What do the horizontal x-axis and vertical y-axis measure on Dr. Chen's bar graph?",
          "correct": "The x-axis lists ten major languages, and the y-axis measures speakers in hundreds of millions",
          "options": [
            "The x-axis shows years, and the y-axis shows the number of countries",
            "The x-axis shows continents, and the y-axis shows book sales"
          ],
          "tip": "Check lines 2 and 3."
        },
        {
          "question": "Why are there two different colored bars (dark teal and light gold) for each language?",
          "correct": "Dark teal shows native speakers, while light gold shows total speakers (including second-language learners)",
          "options": [
            "Dark teal shows children, and light gold shows adults",
            "Dark teal shows spoken words, and light gold shows written books"
          ],
          "tip": "Read line 5."
        },
        {
          "question": "According to the dark teal bars, which language has the highest number of native speakers?",
          "correct": "Mandarin Chinese (over 900 million native speakers)",
          "options": [
            "English (380 million)",
            "French (80 million)"
          ],
          "tip": "Look at line 6."
        },
        {
          "question": "How does Spanish compare to English when looking ONLY at native speakers (the dark teal bar)?",
          "correct": "Spanish has more native speakers (485 million) than English (380 million)",
          "options": [
            "English has twice as many native speakers as Spanish",
            "Both languages have the exact same number"
          ],
          "tip": "Read line 7."
        },
        {
          "question": "Which language has the tallest light gold bar for total speakers overall, and approximately how many?",
          "correct": "English, with nearly 1,450 million total speakers",
          "options": [
            "Spanish, with 485 million total speakers",
            "Japanese, with 200 million total speakers"
          ],
          "tip": "Check lines 8 and 9."
        },
        {
          "question": "Why does English have such a large difference between its native-speaker bar and its total-speaker bar?",
          "correct": "Because hundreds of millions of people worldwide learn it as a second or third language",
          "options": [
            "Because the bar graph was drawn incorrectly",
            "Because no one speaks English as a native language"
          ],
          "tip": "Read line 9."
        },
        {
          "question": "EXAMPLES: Which phrase in line 10 introduces four international fields where English is used?",
          "correct": "such as (aviation, science, medicine, and diplomacy)",
          "options": [
            "in contrast",
            "on the other hand"
          ],
          "tip": "Check line 10."
        },
        {
          "question": "According to the bar graph in line 11, how many total speakers does Hindi have?",
          "correct": "Over 600 million total speakers",
          "options": [
            "Less than 100 million speakers",
            "Over 2,000 million speakers"
          ],
          "tip": "Look at line 11."
        },
        {
          "question": "What example does Amina give in line 13 of how students use digital tools to learn languages?",
          "correct": "Her school language club uses audio flashcards to study Japanese characters and French pronunciation",
          "options": [
            "Students travel by airplane every weekend",
            "Students write letters on papyrus"
          ],
          "tip": "Read line 13."
        },
        {
          "question": "According to Dr. Chen and Noah, what are two benefits of becoming bilingual or multilingual?",
          "correct": "It strengthens memory, helps appreciate diverse cultures, and connects you to billions of people",
          "options": [
            "It replaces the need to study math or science",
            "It allows you to skip school on Fridays"
          ],
          "tip": "Check lines 14 and 15."
        }
      ]
    },
    {
      "id": "g6-u8",
      "title": "So Many Questions",
      "type": "Story · Topic 4: A World of Words (Literature)",
      "skill": "Make Predictions",
      "writingGoal": "Review — Examples (for example, for instance, such as)",
      "theme": {
        "primary": "#115e59",
        "tint": "#ccfbf1",
        "border": "#99f6e4"
      },
      "lines": [
        {
          "speaker": "Narrator",
          "text": "Eleven-year-old Maya carried a brass-cornered notebook everywhere she went, filling its pages with curious questions."
        },
        {
          "speaker": "Maya",
          "text": "Why do libraries arrange fiction by the author's last name, yet group nonfiction by numbers such as the Dewey Decimal System?"
        },
        {
          "speaker": "Narrator",
          "text": "On rainy Thursday afternoons, Maya visited the basement archives of the Oakridge Public Library to help Head Librarian Mr. Arthur."
        },
        {
          "speaker": "Narrator",
          "text": "While dusting a mahogany bookshelf in the historical corner, Maya noticed a leather-bound volume with a brass keyhole on its cover."
        },
        {
          "speaker": "Maya",
          "text": "Mr. Arthur, look at this antique book titled 'The Founder's Riddle'—why is it locked, and where is the key?"
        },
        {
          "speaker": "Mr. Arthur",
          "text": "A hundred years ago, the library's founder hid the key inside the library and left a verse of clues on the back cover!"
        },
        {
          "speaker": "Narrator",
          "text": "Maya turned the book over and read the engraved rhyme aloud: 'Seek the silent globe that spins where oceans meet the stars.'"
        },
        {
          "speaker": "Maya",
          "text": "Let's make a prediction! There are three globes in the library, for example the plastic world globe in the children's room."
        },
        {
          "speaker": "Mr. Arthur",
          "text": "True, Maya, but notice the words 'where oceans meet the stars'—which room has a painted ceiling of constellations?"
        },
        {
          "speaker": "Maya",
          "text": "The Astronomy & Navigation Reading Room on the third floor! I predict the clue points to the antique celestial sphere!"
        },
        {
          "speaker": "Narrator",
          "text": "Maya and Mr. Arthur climbed the spiral iron staircase and stood beside the wooden stand of the brass celestial globe."
        },
        {
          "speaker": "Narrator",
          "text": "Maya examined the engraved brass meridian ring and spotted a tiny latch shaped like a crescent moon."
        },
        {
          "speaker": "Maya",
          "text": "If I press this crescent latch inward, I bet a hidden compartment will pop open at the base of the stand!"
        },
        {
          "speaker": "Narrator",
          "text": "With a soft metallic click, a small velvet drawer slid open, revealing a tarnished brass key tied with a silk ribbon."
        },
        {
          "speaker": "Narrator",
          "text": "As Maya inserted the key into the leather volume, Mr. Arthur smiled and said her next great adventure in reading was just beginning."
        }
      ],
      "vocab": [
        {
          "word": "nonfiction",
          "part": "noun",
          "def": "Informational writing that is based on real facts, real events, and real people."
        },
        {
          "word": "archives",
          "part": "noun",
          "def": "A special collection of historical documents, records, and rare books kept in a library."
        },
        {
          "word": "mahogany",
          "part": "noun",
          "def": "A hard, reddish-brown tropical wood used for making high-quality furniture and bookshelves."
        },
        {
          "word": "antique",
          "part": "adjective",
          "def": "Very old and valuable because it was made in an earlier historical period."
        },
        {
          "word": "engraved",
          "part": "adjective",
          "def": "Cut or carved with words or designs into a hard surface of metal, stone, or leather."
        },
        {
          "word": "prediction",
          "part": "noun",
          "def": "A smart guess about what will happen next based on clues in the text and prior knowledge."
        },
        {
          "word": "constellations",
          "part": "noun",
          "def": "Groups of stars in the night sky that form recognizable patterns and have names."
        },
        {
          "word": "celestial",
          "part": "adjective",
          "def": "Positioned in or relating to the sky, stars, and outer space."
        },
        {
          "word": "compartment",
          "part": "noun",
          "def": "A small separate section or hidden space inside a piece of furniture or object."
        },
        {
          "word": "tarnished",
          "part": "adjective",
          "def": "Having lost its bright shine and become dull or darkened over time from exposure to air."
        }
      ],
      "exercises": [
        {
          "question": "What habit shows that Maya is an unusually curious reader in lines 1 and 2?",
          "correct": "She carries a brass-cornered notebook everywhere and fills it with questions",
          "options": [
            "She only reads comic books on weekends",
            "She refuses to visit the library"
          ],
          "tip": "Check lines 1 and 2."
        },
        {
          "question": "Where was Maya helping Mr. Arthur when she made her discovery?",
          "correct": "In the basement archives of the Oakridge Public Library",
          "options": [
            "In the school cafeteria",
            "In a modern computer store"
          ],
          "tip": "Read line 3."
        },
        {
          "question": "What was unusual about the leather-bound volume titled 'The Founder's Riddle'?",
          "correct": "It had a brass keyhole on its cover and was locked",
          "options": [
            "All of its pages were blank",
            "It was written in invisible ink"
          ],
          "tip": "Check lines 4 and 5."
        },
        {
          "question": "Who hid the key a hundred years ago, and what did they leave behind?",
          "correct": "The library's founder hid the key and left an engraved verse of clues on the back cover",
          "options": [
            "A pirate hid the key on a ship",
            "Mr. Arthur lost the key yesterday"
          ],
          "tip": "Read lines 6 and 7."
        },
        {
          "question": "What did the engraved rhyme on the back cover say?",
          "correct": "'Seek the silent globe that spins where oceans meet the stars.'",
          "options": [
            "'Look beneath the front doormat at noon.'",
            "'Ask the baker in the town square.'"
          ],
          "tip": "Check line 7."
        },
        {
          "question": "MAKE PREDICTIONS: Why did Maya rule out the plastic world globe in the children's room?",
          "correct": "Because Mr. Arthur pointed out the clue 'where oceans meet the stars,' which matched the room with constellations on the ceiling",
          "options": [
            "Because the children's room was locked",
            "Because the plastic globe was broken"
          ],
          "tip": "Read lines 8–10."
        },
        {
          "question": "Where did Maya predict the clue was pointing?",
          "correct": "To the antique celestial sphere in the Astronomy & Navigation Reading Room on the third floor",
          "options": [
            "To the basement boiler room",
            "To the garden behind the library"
          ],
          "tip": "Check line 10."
        },
        {
          "question": "What detail did Maya spot on the brass meridian ring of the celestial globe?",
          "correct": "A tiny latch shaped like a crescent moon",
          "options": [
            "A red electric button",
            "A paper sticker"
          ],
          "tip": "Look at line 12."
        },
        {
          "question": "What did Maya predict would happen when she pressed the crescent latch inward?",
          "correct": "A hidden compartment would pop open at the base of the stand",
          "options": [
            "The globe would start playing music",
            "The bookshelf would slide open"
          ],
          "tip": "Read line 13."
        },
        {
          "question": "MAKE PREDICTIONS: Based on line 15, what can you predict will happen right after the story ends?",
          "correct": "Maya will unlock 'The Founder's Riddle' and read the historical secrets or clues inside",
          "options": [
            "Maya will throw the key away without opening the book",
            "Mr. Arthur will close the library forever"
          ],
          "tip": "Use the clues in lines 14 and 15 to predict what happens next."
        }
      ]
    },
    {
      "id": "g6-u9",
      "title": "A Trip to Earth",
      "type": "Story · Topic 5: Getting to Know You (Science Fiction)",
      "skill": "Analyze Characters",
      "writingGoal": "Comparative Report — Contrast Phrases (in contrast, on the other hand)",
      "theme": {
        "primary": "#115e59",
        "tint": "#ccfbf1",
        "border": "#99f6e4"
      },
      "lines": [
        {
          "speaker": "Narrator",
          "text": "As the silver scout ship descended through Earth's fluffy white clouds, twin cadets Zylar and Vena peered out the viewport."
        },
        {
          "speaker": "Narrator",
          "text": "Although they came from the same crystal city on Planet Lyra, the two siblings had completely opposite personalities."
        },
        {
          "speaker": "Zylar",
          "text": "Look at all that unpredictable water falling from the sky, Vena! We should stay inside the ship and scan from orbit."
        },
        {
          "speaker": "Narrator",
          "text": "Zylar was cautious and analytical; he preferred studying tidy holographic charts rather than stepping into unknown places."
        },
        {
          "speaker": "Vena",
          "text": "In contrast, I cannot wait to step outside and feel rain on my boots! You never truly know a planet until you meet its people."
        },
        {
          "speaker": "Narrator",
          "text": "Vena was adventurous, outgoing, and empathetic, always eager to make friends across the galaxy."
        },
        {
          "speaker": "Narrator",
          "text": "After landing invisibly behind a wooded hill, the twins activated their human-disguise jackets and walked into a neighborhood park."
        },
        {
          "speaker": "Zylar",
          "text": "According to my data pad, those young humans are kicking a round leather sphere between two metal posts—how illogical!"
        },
        {
          "speaker": "Vena",
          "text": "On the other hand, look at their faces, Zylar: they are laughing, cheering, and cooperating as a team!"
        },
        {
          "speaker": "Narrator",
          "text": "Suddenly, the soccer ball rolled down the grassy slope and stopped right against Zylar's silver boot."
        },
        {
          "speaker": "Human Boy Leo",
          "text": "Hey there! Could you kick the ball back to us, or would you two like to join our game?"
        },
        {
          "speaker": "Narrator",
          "text": "Zylar froze nervously and glanced at his data pad, unsure of the proper social protocol."
        },
        {
          "speaker": "Narrator",
          "text": "Vena smiled warmly, nudged her brother's elbow, and passed the ball smoothly back to Leo."
        },
        {
          "speaker": "Zylar",
          "text": "Wait—when I kicked the ball back, Leo gave me a 'high five' gesture! My stress sensors just dropped to zero."
        },
        {
          "speaker": "Narrator",
          "text": "By sunset, cautious Zylar was keeping score with his analytical mind while Vena played midfield alongside their new Earth friends."
        }
      ],
      "vocab": [
        {
          "word": "viewport",
          "part": "noun",
          "def": "A strong, transparent window in a spacecraft or submarine used for looking outside."
        },
        {
          "word": "personalities",
          "part": "noun",
          "def": "The combination of characteristics, feelings, and behaviors that make each person unique."
        },
        {
          "word": "analytical",
          "part": "adjective",
          "def": "Using logical reasoning, data, and careful examination to understand things."
        },
        {
          "word": "holographic",
          "part": "adjective",
          "def": "Relating to a three-dimensional image formed by light beams."
        },
        {
          "word": "adventurous",
          "part": "adjective",
          "def": "Willing to take risks and eager to try new experiences and explore unknown places."
        },
        {
          "word": "empathetic",
          "part": "adjective",
          "def": "Able to understand and share the feelings of other people."
        },
        {
          "word": "illogical",
          "part": "adjective",
          "def": "Lacking clear sense or sound reasoning according to strict rules."
        },
        {
          "word": "cooperating",
          "part": "verb",
          "def": "Working together harmoniously toward a shared goal."
        },
        {
          "word": "protocol",
          "part": "noun",
          "def": "The official system of rules and correct behavior for a situation."
        },
        {
          "word": "gesture",
          "part": "noun",
          "def": "A movement of the hand or head made to express a friendly feeling or idea."
        }
      ],
      "exercises": [
        {
          "question": "ANALYZE CHARACTERS: Who are Zylar and Vena, and where are they from?",
          "correct": "Twin space cadets from the crystal city on Planet Lyra",
          "options": [
            "Two ocean biologists from California",
            "Two historical detectives from London"
          ],
          "tip": "Check lines 1 and 2."
        },
        {
          "question": "Which character traits best describe Zylar at the beginning of the story?",
          "correct": "Cautious and analytical; he prefers studying holographic charts over unknown places",
          "options": [
            "Reckless and loud; he jumps out of the ship without looking",
            "Lazy and sleepy; he refuses to read data"
          ],
          "tip": "Read lines 3 and 4."
        },
        {
          "question": "CONTRAST PHRASES: How does Vena's personality contrast with Zylar's in lines 5 and 6?",
          "correct": "In contrast, Vena is adventurous, outgoing, and empathetic, eager to experience rain and meet people",
          "options": [
            "Vena is even more afraid of rain than Zylar",
            "Vena only cares about repairing engines"
          ],
          "tip": "Check lines 5 and 6."
        },
        {
          "question": "How did the twins blend in when they walked into the Earth neighborhood park?",
          "correct": "They activated their human-disguise jackets",
          "options": [
            "They hid inside cardboard boxes",
            "They wore scuba diving suits"
          ],
          "tip": "Read line 7."
        },
        {
          "question": "How did Zylar react when he first saw human children playing soccer?",
          "correct": "He called kicking a leather sphere between two metal posts 'illogical'",
          "options": [
            "He immediately scored three goals",
            "He knew all the rules of soccer"
          ],
          "tip": "Look at line 8."
        },
        {
          "question": "What did Vena notice about the soccer players that Zylar's data pad missed?",
          "correct": "That the players were laughing, cheering, and cooperating as a team",
          "options": [
            "That the ball was made of solid gold",
            "That it was snowing on the field"
          ],
          "tip": "Check line 9."
        },
        {
          "question": "CONTRAST PHRASES: Which phrase does Vena use at the start of line 9 to show a different perspective from Zylar's?",
          "correct": "On the other hand,",
          "options": [
            "In conclusion,",
            "First of all,"
          ],
          "tip": "Look at the first four words of line 9."
        },
        {
          "question": "How did Zylar react when the soccer ball stopped against his boot and Leo spoke to them?",
          "correct": "He froze nervously and glanced at his data pad, unsure of the social protocol",
          "options": [
            "He ran back to the spaceship crying",
            "He gave a long speech about Planet Lyra"
          ],
          "tip": "Read lines 10–12."
        },
        {
          "question": "What changed Zylar's feelings about interacting with the Earth children?",
          "correct": "Vena helped him pass the ball back, and Leo gave him a friendly 'high five' gesture",
          "options": [
            "He read a book about soccer in the library",
            "The rain stopped falling"
          ],
          "tip": "Check lines 13 and 14."
        },
        {
          "question": "How did both twins use their unique strengths together by sunset?",
          "correct": "Analytical Zylar kept score while adventurous Vena played midfield with their new friends",
          "options": [
            "Both twins stayed locked inside the spaceship",
            "Zylar played goalie while Vena went to sleep"
          ],
          "tip": "Read line 15."
        }
      ]
    },
    {
      "id": "g6-u10",
      "title": "Number 261",
      "type": "Biographical Essay · Topic 5: Getting to Know You (History & Sports)",
      "skill": "Understand Types of Conflict (Internal vs. External)",
      "writingGoal": "Comparative Report — Contrast Phrases (in contrast, on the other hand)",
      "theme": {
        "primary": "#115e59",
        "tint": "#ccfbf1",
        "border": "#99f6e4"
      },
      "lines": [
        {
          "speaker": "Paragraph 1",
          "text": "In 1967, twenty-year-old Kathrine Switzer trained every day in freezing snow to prepare for the famous Boston Marathon."
        },
        {
          "speaker": "Paragraph 2",
          "text": "At that time in history, an unfair rule stated that women were too fragile to run the 26.2-mile race."
        },
        {
          "speaker": "Paragraph 3",
          "text": "Kathrine registered using her initials, 'K. V. Switzer,' and officials assigned her the paper bib Number 261."
        },
        {
          "speaker": "Paragraph 4",
          "text": "On the cold morning of April 19, Kathrine pinned Number 261 to her gray sweatshirt and stood at the starting line."
        },
        {
          "speaker": "Paragraph 5",
          "text": "Many male runners welcomed her warmly; in contrast, some traditional officials believed women did not belong on the course."
        },
        {
          "speaker": "Paragraph 6",
          "text": "At mile four, an angry race director leaped off the press truck and tried to rip the numbered bib off Kathrine's shirt!"
        },
        {
          "speaker": "Paragraph 7",
          "text": "This sudden confrontation created an intense external conflict between Kathrine and the official trying to force her off the road."
        },
        {
          "speaker": "Paragraph 8",
          "text": "Kathrine's coach and fellow runners stepped in to shield her, allowing her to break free and keep running down the highway."
        },
        {
          "speaker": "Paragraph 9",
          "text": "Moments later, however, Kathrine faced an even harder internal conflict inside her own mind and heart."
        },
        {
          "speaker": "Paragraph 10",
          "text": "She felt shaken, embarrassed, and exhausted by the icy sleet, and a voice in her head tempted her to step off the road."
        },
        {
          "speaker": "Paragraph 11",
          "text": "On the other hand, Kathrine realized that if she quit the race now, critics would claim that women truly could not finish a marathon."
        },
        {
          "speaker": "Paragraph 12",
          "text": "Choosing courage over fear, she resolved her internal conflict and vowed to cross the finish line no matter how long it took."
        },
        {
          "speaker": "Paragraph 13",
          "text": "For over four hours, she pushed through aching muscles and freezing wind, completing the marathon in 4 hours and 20 minutes."
        },
        {
          "speaker": "Paragraph 14",
          "text": "Because of her perseverance, the Boston Marathon officially opened to women in 1972, and marathon running was changed forever."
        },
        {
          "speaker": "Paragraph 15",
          "text": "Today, Bib Number 261 is celebrated worldwide as a timeless symbol of resilience, equality, and determination."
        }
      ],
      "vocab": [
        {
          "word": "marathon",
          "part": "noun",
          "def": "A long-distance footrace measuring 26.2 miles (42.195 kilometers)."
        },
        {
          "word": "fragile",
          "part": "adjective",
          "def": "Delicate, weak, and easily broken or exhausted."
        },
        {
          "word": "initials",
          "part": "noun",
          "def": "The first letters of a person's first, middle, and last names."
        },
        {
          "word": "confrontation",
          "part": "noun",
          "def": "A hostile, face-to-face argument or struggle between opposing people."
        },
        {
          "word": "external",
          "part": "adjective",
          "def": "Happening on the outside, such as a struggle between a character and an outside force or person."
        },
        {
          "word": "internal",
          "part": "adjective",
          "def": "Happening inside a person's own mind, emotions, or conscience."
        },
        {
          "word": "sleet",
          "part": "noun",
          "def": "Cold rain mixed with ice pellets falling from the sky in winter or early spring."
        },
        {
          "word": "critics",
          "part": "noun",
          "def": "People who judge unfavorably or express disapproval and doubt."
        },
        {
          "word": "perseverance",
          "part": "noun",
          "def": "Steady persistence in finishing a difficult goal despite obstacles and discouragement."
        },
        {
          "word": "resilience",
          "part": "noun",
          "def": "The capacity to recover quickly from difficulties and keep going strong."
        }
      ],
      "exercises": [
        {
          "question": "Who is the main subject of the biographical essay 'Number 261'?",
          "correct": "Kathrine Switzer, the first woman to run the Boston Marathon as an officially numbered entrant in 1967",
          "options": [
            "A race director who invented the stopwatch",
            "A modern Olympic swimmer"
          ],
          "tip": "Check Paragraphs 1–3."
        },
        {
          "question": "Why did an unfair rule before 1972 try to keep women out of the Boston Marathon?",
          "correct": "People mistakenly claimed women were too fragile to run 26.2 miles",
          "options": [
            "There were not enough paper bibs for everyone",
            "The roads were too narrow"
          ],
          "tip": "Read Paragraph 2."
        },
        {
          "question": "How did Kathrine receive official bib Number 261?",
          "correct": "She registered using her initials, 'K. V. Switzer'",
          "options": [
            "She found the bib on the sidewalk",
            "She borrowed it from her brother"
          ],
          "tip": "Check Paragraph 3."
        },
        {
          "question": "CONTRAST PHRASES: How did the reactions of male runners contrast with those of traditional officials in Paragraph 5?",
          "correct": "Many male runners welcomed her warmly; in contrast, some officials believed women did not belong",
          "options": [
            "Everyone cheered for the race director",
            "No one noticed she was running"
          ],
          "tip": "Read Paragraph 5."
        },
        {
          "question": "EXTERNAL CONFLICT: What external conflict occurred at mile four of the marathon?",
          "correct": "An angry race director leaped off the press truck and tried to rip Bib 261 off Kathrine's shirt",
          "options": [
            "A bridge collapsed across the river",
            "A thunderstorm flooded the city"
          ],
          "tip": "Check Paragraphs 6 and 7."
        },
        {
          "question": "Why is the struggle at mile four classified as an 'external conflict'?",
          "correct": "Because it was a struggle between Kathrine and an outside person trying to stop her",
          "options": [
            "Because it happened inside a dream",
            "Because Kathrine was deciding what shoes to buy"
          ],
          "tip": "Read Paragraph 7."
        },
        {
          "question": "INTERNAL CONFLICT: What internal conflict did Kathrine experience in Paragraphs 9 and 10?",
          "correct": "Inside her own mind, she felt shaken and exhausted and struggled with the temptation to quit",
          "options": [
            "She argued with her coach about the weather",
            "She lost her map of Boston"
          ],
          "tip": "Check Paragraphs 9 and 10."
        },
        {
          "question": "What realization helped Kathrine resolve her internal conflict and keep running?",
          "correct": "She realized that if she quit, critics would claim women truly could not finish a marathon",
          "options": [
            "She saw that the finish line was only one block away",
            "The weather suddenly turned warm and sunny"
          ],
          "tip": "Read Paragraphs 11 and 12."
        },
        {
          "question": "In what time did Kathrine complete the 1967 Boston Marathon?",
          "correct": "4 hours and 20 minutes",
          "options": [
            "1 hour and 10 minutes",
            "9 hours and 45 minutes"
          ],
          "tip": "Check Paragraph 13."
        },
        {
          "question": "What historic change resulted from Kathrine Switzer's perseverance?",
          "correct": "The Boston Marathon officially opened to women in 1972, and Bib 261 became a symbol of equality",
          "options": [
            "The marathon was shortened to 5 miles",
            "Runners stopped wearing numbers on their shirts"
          ],
          "tip": "Read Paragraphs 14 and 15."
        }
      ]
    },
    {
      "id": "g6-u11",
      "title": "My Mexican Adventure",
      "type": "Story · Topic 6: Finding Adventure (Social Studies)",
      "skill": "Make a Value Judgment",
      "writingGoal": "Research Report — Synonyms: Avoiding Repetition",
      "theme": {
        "primary": "#115e59",
        "tint": "#ccfbf1",
        "border": "#99f6e4"
      },
      "lines": [
        {
          "speaker": "Elena",
          "text": "During our summer trip to the Yucatán Peninsula in Mexico, my uncle Carlos took my brother Leo and me on an unforgettable expedition."
        },
        {
          "speaker": "Uncle Carlos",
          "text": "Today we are hiking through the tropical jungle to explore an ancient Mayan cenote—a natural limestone sinkhole filled with crystal water!"
        },
        {
          "speaker": "Elena",
          "text": "Instead of repeating the word 'big' in my travel journal, I wrote that the towering ceiba trees were immense, vast, and gigantic."
        },
        {
          "speaker": "Leo",
          "text": "Listen to the howler monkeys roaring in the canopy, Elena! This jungle trail is thrilling!"
        },
        {
          "speaker": "Uncle Carlos",
          "text": "When we reach the wooden stairway descending into the cavern, everyone must wear a life vest and rinse off all sunscreen."
        },
        {
          "speaker": "Leo",
          "text": "Why do we have to shower and wash off our lotion before swimming in the underground pool, Uncle Carlos?"
        },
        {
          "speaker": "Uncle Carlos",
          "text": "Chemical lotions pollute the fragile groundwater and harm the blind cavefish and delicate rock formations."
        },
        {
          "speaker": "Elena",
          "text": "We washed carefully at the eco-shower, and then we walked down forty carved stone steps into the cool subterranean chamber."
        },
        {
          "speaker": "Elena",
          "text": "Shafts of golden sunlight beamed through an opening in the cave ceiling, illuminating turquoise water that was clear and transparent."
        },
        {
          "speaker": "Leo",
          "text": "Look at those icicle-shaped stone stalactites hanging from the roof! Can I climb that ledge and touch one?"
        },
        {
          "speaker": "Elena",
          "text": "Stop, Leo! Remember what the park ranger's sign said: human skin oils stop stalactites from growing, and a single touch ruins thousands of years of nature!"
        },
        {
          "speaker": "Leo",
          "text": "You made the right call, Elena—admiring the formations without touching them preserves this wonder for future explorers."
        },
        {
          "speaker": "Uncle Carlos",
          "text": "Put on your snorkel masks and float gently on the surface so you can observe the submerged stalagmites and darting catfish below."
        },
        {
          "speaker": "Elena",
          "text": "Floating silently in the emerald water, I felt a deep sense of awe for the Mayan people who considered these caverns sacred."
        },
        {
          "speaker": "Elena",
          "text": "True adventure isn't about conquering nature or taking souvenirs; it is about exploring with respect and stewardship."
        }
      ],
      "vocab": [
        {
          "word": "expedition",
          "part": "noun",
          "def": "A purposeful journey undertaken by a group of people for exploration or research."
        },
        {
          "word": "sinkhole",
          "part": "noun",
          "def": "A natural cavity in the ground caused by water erosion in limestone bedrock."
        },
        {
          "word": "immense",
          "part": "adjective",
          "def": "Extremely large or great in scale; a strong synonym for 'big' or 'huge'."
        },
        {
          "word": "cavern",
          "part": "noun",
          "def": "A large underground cave or chamber in rock."
        },
        {
          "word": "subterranean",
          "part": "adjective",
          "def": "Existing, occurring, or formed beneath the Earth's surface."
        },
        {
          "word": "illuminating",
          "part": "verb",
          "def": "Lighting up a dark place brightly so everything can be seen clearly."
        },
        {
          "word": "transparent",
          "part": "adjective",
          "def": "So pure and clear that light passes straight through and you can see the bottom."
        },
        {
          "word": "stalactites",
          "part": "noun",
          "def": "Mineral formations that hang like icicles from the ceiling of a limestone cave."
        },
        {
          "word": "sacred",
          "part": "adjective",
          "def": "Regarded with deep spiritual respect and reverence."
        },
        {
          "word": "stewardship",
          "part": "noun",
          "def": "The responsible care, protection, and preservation of the natural environment."
        }
      ],
      "exercises": [
        {
          "question": "Where did Uncle Carlos take Elena and Leo during their summer trip to Mexico?",
          "correct": "To an ancient Mayan cenote (a limestone sinkhole) in the Yucatán Peninsula jungle",
          "options": [
            "To a snowy mountain peak in northern Mexico",
            "To an indoor shopping mall in Mexico City"
          ],
          "tip": "Check lines 1 and 2."
        },
        {
          "question": "SYNONYMS: Which three synonyms did Elena write in her journal in line 3 to avoid repeating the word 'big'?",
          "correct": "immense, vast, and gigantic",
          "options": [
            "tiny, small, and little",
            "fast, quick, and rapid"
          ],
          "tip": "Read line 3."
        },
        {
          "question": "What two rules did Uncle Carlos state before descending the stairway into the cavern?",
          "correct": "Everyone must wear a life vest and rinse off all sunscreen",
          "options": [
            "Everyone must wear heavy boots and carry a flashlight",
            "Everyone must dive from the highest cliff"
          ],
          "tip": "Check line 5."
        },
        {
          "question": "Why is it necessary to rinse off chemical lotions before swimming in a cenote?",
          "correct": "Because chemicals pollute the fragile groundwater and harm blind cavefish",
          "options": [
            "Because sunscreen makes the water too warm",
            "Because fish like to eat sunscreen"
          ],
          "tip": "Read line 7."
        },
        {
          "question": "SYNONYMS: In line 9, what synonym is paired with 'clear' to describe the turquoise water?",
          "correct": "transparent",
          "options": [
            "murky",
            "frozen"
          ],
          "tip": "Look at the last word of line 9."
        },
        {
          "question": "What are the icicle-shaped mineral formations hanging from the ceiling of a cave called?",
          "correct": "Stalactites",
          "options": [
            "Glaciers",
            "Canopies"
          ],
          "tip": "Check line 10."
        },
        {
          "question": "VALUE JUDGMENT: When Leo wanted to climb the ledge and touch a stalactite, was Elena's decision to stop him wise, and why?",
          "correct": "Yes, because human skin oils stop stalactites from growing and ruin thousands of years of natural formation",
          "options": [
            "No, because breaking off a piece makes a great souvenir",
            "No, because stalactites grow back in two days"
          ],
          "tip": "Read lines 10–12."
        },
        {
          "question": "How did Leo respond to Elena's reminder in line 12?",
          "correct": "He agreed she made the right call and realized not touching preserves the cave for future explorers",
          "options": [
            "He got angry and touched the rock anyway",
            "He refused to go swimming"
          ],
          "tip": "Check line 12."
        },
        {
          "question": "How did the Mayan people view these underground caverns?",
          "correct": "They considered the caverns sacred",
          "options": [
            "They used them as roads for horses",
            "They never visited them"
          ],
          "tip": "Read line 14."
        },
        {
          "question": "VALUE JUDGMENT: How does Elena define 'true adventure' in the final line of the story?",
          "correct": "Exploring nature with respect and stewardship rather than conquering it or taking souvenirs",
          "options": [
            "Taking as many rocks and plants home as possible",
            "Leaving footprints on protected formations"
          ],
          "tip": "Check line 15."
        }
      ]
    },
    {
      "id": "g6-u12",
      "title": "Adventures in Science",
      "type": "Essay & Data Report · Topic 6: Finding Adventure (Science)",
      "skill": "Understand a Pie Chart",
      "writingGoal": "Research Report — Synonyms: Avoiding Repetition",
      "theme": {
        "primary": "#115e59",
        "tint": "#ccfbf1",
        "border": "#99f6e4"
      },
      "lines": [
        {
          "speaker": "Section 1",
          "text": "When people hear the word 'adventure,' they often picture climbing icy peaks, yet some of the greatest expeditions happen through scientific research!"
        },
        {
          "speaker": "Section 2",
          "text": "This year, 200 sixth-grade students participated in our Regional Science Exploration Fair and voted on their favorite frontier of discovery."
        },
        {
          "speaker": "Section 3",
          "text": "To visualize the survey results clearly, our committee created a circular Pie Chart divided into four colored sectors totaling 100 percent."
        },
        {
          "speaker": "Section 4",
          "text": "The largest slice of the pie chart—a massive 40 percent in deep navy blue—represents Deep-Sea Trench Exploration."
        },
        {
          "speaker": "Section 5",
          "text": "Students fascinated by the ocean depths want to pilot robotic submersibles to discover bioluminescent creatures that glow in total darkness."
        },
        {
          "speaker": "Section 6",
          "text": "The second-largest sector of the pie chart, shown in bright crimson at 30 percent, represents Space & Planetary Robotics."
        },
        {
          "speaker": "Section 7",
          "text": "Young astronomers in this group designed rovers capable of analyzing Martian soil and searching for frozen water on distant moons."
        },
        {
          "speaker": "Section 8",
          "text": "Next, the emerald green slice accounts for 20 percent of the pie chart and stands for Rainforest Biodiversity & Medicine."
        },
        {
          "speaker": "Section 9",
          "text": "Rather than repeating the word 'important,' these botanists wrote that rainforest plants are vital, essential, and indispensable for curing diseases."
        },
        {
          "speaker": "Section 10",
          "text": "Finally, the golden amber slice makes up the remaining 10 percent of the chart, representing Polar Glacier & Climate Studies."
        },
        {
          "speaker": "Section 11",
          "text": "If you add the Deep-Sea sector (40%) and the Space sector (30%) together, nearly three-quarters (70%) of students chose extreme environments!"
        },
        {
          "speaker": "Section 12",
          "text": "Notice also that the Deep-Sea slice (40%) is exactly twice the size of the Rainforest Biodiversity slice (20%)."
        },
        {
          "speaker": "Section 13",
          "text": "Since 200 students voted in total, that 10 percent Polar Glacier slice equals 20 dedicated student researchers!"
        },
        {
          "speaker": "Section 14",
          "text": "Across all four fields, every student investigator followed the scientific method: asking questions, testing hypotheses, and recording evidence."
        },
        {
          "speaker": "Section 15",
          "text": "Whether peering through a telescope or a microscope, every curious scientist is a bold pioneer charting the unknown!"
        }
      ],
      "vocab": [
        {
          "word": "frontier",
          "part": "noun",
          "def": "The farthest limit of knowledge or an unexplored area of discovery."
        },
        {
          "word": "sectors",
          "part": "noun",
          "def": "Wedge-shaped slices or sections of a circular pie chart representing percentages of a whole."
        },
        {
          "word": "submersibles",
          "part": "noun",
          "def": "Small underwater craft designed for deep-sea scientific research and exploration."
        },
        {
          "word": "bioluminescent",
          "part": "adjective",
          "def": "Able to produce and emit natural light from within a living organism's body."
        },
        {
          "word": "rovers",
          "part": "noun",
          "def": "Robotic vehicles designed to drive across the surface of another planet or moon."
        },
        {
          "word": "biodiversity",
          "part": "noun",
          "def": "The rich variety of all different plant and animal life in a particular habitat."
        },
        {
          "word": "indispensable",
          "part": "adjective",
          "def": "Absolutely necessary and essential; a strong synonym for 'important'."
        },
        {
          "word": "hypotheses",
          "part": "noun",
          "def": "Proposed scientific explanations made on the basis of limited evidence as a starting point for testing."
        },
        {
          "word": "evidence",
          "part": "noun",
          "def": "Measured facts, data, and observations collected to test whether a hypothesis is true."
        },
        {
          "word": "pioneer",
          "part": "noun",
          "def": "A person who is among the first to explore a new area of knowledge or research."
        }
      ],
      "exercises": [
        {
          "question": "UNDERSTAND A PIE CHART: How many total students voted in the survey, and what do all the sectors of the pie chart add up to?",
          "correct": "200 sixth-grade students voted, and the four sectors add up to 100 percent",
          "options": [
            "100 students voted, adding up to 50 percent",
            "500 students voted, adding up to 200 percent"
          ],
          "tip": "Check Sections 2 and 3."
        },
        {
          "question": "Which scientific frontier represents the largest slice of the pie chart, and what percentage did it receive?",
          "correct": "Deep-Sea Trench Exploration, at 40 percent",
          "options": [
            "Polar Glacier Studies, at 10 percent",
            "Rainforest Biodiversity, at 20 percent"
          ],
          "tip": "Read Section 4."
        },
        {
          "question": "What do students interested in Deep-Sea Trench Exploration want to use robotic submersibles to discover?",
          "correct": "Bioluminescent creatures that glow in total darkness",
          "options": [
            "Ancient sunken pirate gold",
            "Warm coral reefs near the beach"
          ],
          "tip": "Check Section 5."
        },
        {
          "question": "Which category is the second-largest sector on the pie chart at 30 percent?",
          "correct": "Space & Planetary Robotics",
          "options": [
            "Volcano Geology",
            "Desert Archaeology"
          ],
          "tip": "Read Section 6."
        },
        {
          "question": "What did the young astronomers in the Space & Planetary Robotics group design?",
          "correct": "Rovers capable of analyzing Martian soil and searching for frozen water on distant moons",
          "options": [
            "Submarines for the Atlantic Ocean",
            "Tents for camping in autumn"
          ],
          "tip": "Check Section 7."
        },
        {
          "question": "What percentage of the pie chart is represented by the emerald green slice for Rainforest Biodiversity & Medicine?",
          "correct": "20 percent",
          "options": [
            "40 percent",
            "5 percent"
          ],
          "tip": "Look at Section 8."
        },
        {
          "question": "SYNONYMS: Which three strong synonyms did the botanists use in Section 9 to avoid repeating the word 'important'?",
          "correct": "vital, essential, and indispensable",
          "options": [
            "interesting, fun, and cool",
            "green, leafy, and tall"
          ],
          "tip": "Read Section 9."
        },
        {
          "question": "UNDERSTAND A PIE CHART: What combined percentage of students chose either Deep-Sea Exploration (40%) or Space Robotics (30%)?",
          "correct": "70 percent (nearly three-quarters of all students)",
          "options": [
            "50 percent (half of all students)",
            "30 percent"
          ],
          "tip": "Check the math in Section 11."
        },
        {
          "question": "How does the size of the Deep-Sea slice (40%) compare to the Rainforest Biodiversity slice (20%)?",
          "correct": "The Deep-Sea slice is exactly twice the size of the Rainforest slice",
          "options": [
            "They are the exact same size",
            "The Deep-Sea slice is half the size of the Rainforest slice"
          ],
          "tip": "Read Section 12."
        },
        {
          "question": "UNDERSTAND A PIE CHART: Since 200 students voted in total, how many individual students does the 10% Polar Glacier slice represent?",
          "correct": "20 students (10% of 200)",
          "options": [
            "10 students",
            "40 students"
          ],
          "tip": "Check Section 13."
        }
      ]
    }
  ]
};

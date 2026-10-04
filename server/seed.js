const mongoose = require('mongoose');

// Define schemas locally to ensure seeding is self-contained and robust
const TopicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Topic name is required'],
    trim: true,
    unique: true
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    trim: true,
    unique: true,
    lowercase: true
  },
  icon: {
    type: String,
    required: [true, 'Icon identifier is required'],
    trim: true,
    default: '⚡'
  },
  color: {
    type: String,
    required: [true, 'Color hex is required'],
    trim: true
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty is required'],
    default: 'Veteran'
  }
});

const QuestionSchema = new mongoose.Schema({
  topicId: {
    type: String,
    required: [true, 'Topic ID is required'],
    trim: true,
    index: true
  },
  text: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  options: {
    type: [String],
    required: [true, 'Options array is required'],
    default: ['Option A', 'Option B', 'Option C', '*Option D']
  },
  explanation: {
    type: String,
    required: [true, 'Explanation is required'],
    trim: true
  },
  timeLimit: {
    type: Number,
    default: 15
  }
});

const PerformanceRecordSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  topicId: {
    type: String,
    required: true,
    trim: true
  },
  score: {
    type: Number,
    required: true
  },
  correctAnswers: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  timeTaken: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Topic = mongoose.models.Topic || mongoose.model('Topic', TopicSchema);
const Question = mongoose.models.Question || mongoose.model('Question', QuestionSchema);
const PerformanceRecord = mongoose.models.PerformanceRecord || mongoose.model('PerformanceRecord', PerformanceRecordSchema);

const seedTopics = [
  {
    name: 'Quantum & Cosmos',
    slug: 'quantum-cosmos',
    icon: '🌌',
    color: '#0077b6',
    difficulty: 'Expert'
  },
  {
    name: 'Cyberpunk & Tech Lore',
    slug: 'cyberpunk-tech',
    icon: '⚡',
    color: '#00b4d8',
    difficulty: 'Veteran'
  },
  {
    name: 'World Dynasties & Conflict',
    slug: 'world-history',
    icon: '🏛️',
    color: '#48cae4',
    difficulty: 'Veteran'
  },
  {
    name: 'Pop Culture Anarchy',
    slug: 'pop-culture',
    icon: '🍿',
    color: '#03045e',
    difficulty: 'Novice'
  }
];

const seedQuestions = [
  // Quantum & Cosmos (To be updated with real created Topic IDs during seed)
  {
    topicSlug: 'quantum-cosmos',
    text: 'Which quantum mechanical principle states that certain pairs of physical properties cannot be simultaneously known with absolute precision?',
    options: ['Schrödinger Paradox', '*Heisenberg Uncertainty Principle', 'Quantum Entanglement', 'Planck Radiation Law'],
    explanation: 'The Heisenberg Uncertainty Principle states that the position and momentum of a particle cannot both be precisely measured at the same time.',
    timeLimit: 15
  },
  {
    topicSlug: 'quantum-cosmos',
    text: 'What hypothetical boundary surrounding a black hole represents the point of absolute no return?',
    options: ['Singularity Threshold', 'Accretion Disk', '*Event Horizon', 'Hawking Limit'],
    explanation: 'The Event Horizon is the boundary where the escape velocity of the black hole exceeds the speed of light.',
    timeLimit: 15
  },
  {
    topicSlug: 'quantum-cosmos',
    text: 'What is the primary element that fuels nuclear fusion in the core of main-sequence stars?',
    options: ['Helium', '*Hydrogen', 'Carbon', 'Iron'],
    explanation: 'Main-sequence stars fuse hydrogen atoms into helium inside their superheated cores.',
    timeLimit: 15
  },
  {
    topicSlug: 'quantum-cosmos',
    text: 'Which elementary particle acts as the carrier or gauge boson of the electromagnetic force?',
    options: ['Gluon', 'W Boson', 'Higgs Boson', '*Photon'],
    explanation: 'The photon is the quantum mediator of electromagnetic interactions.',
    timeLimit: 15
  },
  {
    topicSlug: 'quantum-cosmos',
    text: 'How long does it approximately take for light emitted from the Sun to reach Earth?',
    options: ['3 seconds', '8 seconds', '*8 minutes', '24 hours'],
    explanation: 'Light travels at ~300,000 km/s, taking about 8 minutes and 20 seconds to cover the distance to Earth.',
    timeLimit: 15
  },

  // Cyberpunk & Tech Lore
  {
    topicSlug: 'cyberpunk-tech',
    text: 'Who coined the iconic term "Cyberspace" in his seminal 1984 science fiction novel "Neuromancer"?',
    options: ['Philip K. Dick', '*William Gibson', 'Neal Stephenson', 'Arthur C. Clarke'],
    explanation: 'William Gibson popularized the concept of cyberspace in Neuromancer, depicting it as a consensual hallucination.',
    timeLimit: 15
  },
  {
    topicSlug: 'cyberpunk-tech',
    text: 'In database systems, what does the "C" stand for in ACID compliance?',
    options: ['Concurrency', '*Consistency', 'Caching', 'Compression'],
    explanation: 'ACID stands for Atomicity, Consistency, Isolation, and Durability, ensuring reliable database transactions.',
    timeLimit: 15
  },
  {
    topicSlug: 'cyberpunk-tech',
    text: 'Which legendary cryptographic protocol is named after its creators Rivest, Shamir, and Adleman?',
    options: ['AES', 'SHA-256', '*RSA', 'Blowfish'],
    explanation: 'RSA is one of the first public-key cryptosystems, widely used for secure data transmission.',
    timeLimit: 15
  },
  {
    topicSlug: 'cyberpunk-tech',
    text: 'What was the name of the first computer virus to wild-replicate on MS-DOS in 1986?',
    options: ['Melissa', 'Creeper', '*Brain', 'Code Red'],
    explanation: 'The Brain virus, written by two Pakistani brothers, is considered the first compatible virus for IBM PC/MS-DOS.',
    timeLimit: 15
  },
  {
    topicSlug: 'cyberpunk-tech',
    text: 'In Unix-like environments, which terminal command changes the ownership of files or directories?',
    options: ['chmod', '*chown', 'grep', 'sudo'],
    explanation: 'The chown command (change owner) is used to modify the system owner and group of a file.',
    timeLimit: 15
  },

  // World Dynasties & Conflict
  {
    topicSlug: 'world-history',
    text: 'Which Roman general was famously assassinated on the Ides of March in 44 BCE?',
    options: ['Augustus Caesar', '*Julius Caesar', 'Mark Antony', 'Nero Claudius'],
    explanation: 'Julius Caesar was stabbed 23 times by Roman senators led by Brutus and Cassius.',
    timeLimit: 15
  },
  {
    topicSlug: 'world-history',
    text: 'The code of laws known as "Lex Hammurabi" originated from which ancient empire?',
    options: ['Egyptian Empire', '*Babylonian Empire', 'Persian Empire', 'Assyryian Empire'],
    explanation: 'The Code of Hammurabi is a well-preserved Babylonian code of law of ancient Mesopotamia enacted around 1754 BCE.',
    timeLimit: 15
  },
  {
    topicSlug: 'world-history',
    text: 'Which legendary military commander marched war elephants across the Alps to invade Rome?',
    options: ['Alexander the Great', 'Julius Caesar', '*Hannibal Barca', 'Genghis Khan'],
    explanation: 'Hannibal of Carthage famously led his Carthaginian army, including war elephants, over the Alps in the Second Punic War.',
    timeLimit: 15
  },
  {
    topicSlug: 'world-history',
    text: 'The storming of which Parisian fortress-prison on July 14, 1789, ignited the French Revolution?',
    options: ['Versailles Palace', '*The Bastille', 'Notre-Dame', 'Louvre Castle'],
    explanation: 'The storming of the Bastille represented a royal flashpoint and started the collapse of the monarchy.',
    timeLimit: 15
  },
  {
    topicSlug: 'world-history',
    text: 'Which dynasty was the last imperial ruling family of China, falling in 1912?',
    options: ['Ming Dynasty', 'Tang Dynasty', 'Han Dynasty', '*Qing Dynasty'],
    explanation: 'The Qing Dynasty ruled from 1644 to 1912 before being succeeded by the Republic of China.',
    timeLimit: 15
  },

  // Pop Culture Anarchy
  {
    topicSlug: 'pop-culture',
    text: 'Which award-winning television drama series prominently features a fictional chemical mastermind named Heisenberg?',
    options: ['The Wire', '*Breaking Bad', 'Ozark', 'Peaky Blinders'],
    explanation: 'Walter White adopts the pseudonym "Heisenberg" as his drug kingpin alter ego in Breaking Bad.',
    timeLimit: 15
  },
  {
    topicSlug: 'pop-culture',
    text: 'What is the name of the high-stakes, dystopian virtual reality universe in the book and film "Ready Player One"?',
    options: ['The Grid', 'Metaversum', '*The OASIS', 'CyberNet'],
    explanation: 'The OASIS is the massive multiplayer online simulation created by James Halliday.',
    timeLimit: 15
  },
  {
    topicSlug: 'pop-culture',
    text: 'Which legendary band released the groundbreaking, experimental rock album "The Dark Side of the Moon"?',
    options: ['Led Zeppelin', 'The Beatles', '*Pink Floyd', 'Queen'],
    explanation: 'Pink Floyd released "The Dark Side of the Moon" in 1973, staying on the Billboard charts for a record-breaking 741 weeks.',
    timeLimit: 15
  },
  {
    topicSlug: 'pop-culture',
    text: 'In the Marvel Cinematic Universe, which infinity stone resides inside Vision\'s forehead?',
    options: ['Space Stone', 'Power Stone', 'Time Stone', '*Mind Stone'],
    explanation: 'The Mind Stone was set into Vision\'s forehead by Ultron to bring him to life.',
    timeLimit: 15
  },
  {
    topicSlug: 'pop-culture',
    text: 'What fictional, highly caffeinated energy drink is heavily consumed by Fry in "Futurama"?',
    options: ['Bzzzz Soda', '*Slurm', 'HyperCafe', 'TurboChug'],
    explanation: 'Fry becomes addicted to Slurm, which is later revealed to be produced by a giant alien queen worm.',
    timeLimit: 15
  }
];

const seedLeaderboard = [
  { username: 'SpeedRunner99', score: 100, correctAnswers: 5, totalQuestions: 5, timeTaken: 28 },
  { username: 'QuantumLeap', score: 80, correctAnswers: 4, totalQuestions: 5, timeTaken: 34 },
  { username: 'CaffeineFiend', score: 100, correctAnswers: 5, totalQuestions: 5, timeTaken: 19 },
  { username: 'CodeBreaker', score: 60, correctAnswers: 3, totalQuestions: 5, timeTaken: 42 },
  { username: 'HistoryBuff', score: 80, correctAnswers: 4, totalQuestions: 5, timeTaken: 31 }
];

async function runSeed() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/brainsnap';
  console.log('Connecting to MongoDB database to run seed operation...');
  
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected successfully!');

    // Check Topics
    const topicCount = await Topic.countDocuments();
    if (topicCount === 0) {
      console.log('Inserting default topics...');
      const createdTopics = await Topic.insertMany(seedTopics);
      console.log(`Inserted ${createdTopics.length} topics successfully.`);

      // Check Questions
      const questionCount = await Question.countDocuments();
      if (questionCount === 0) {
        console.log('Inserting high-octane trivia questions...');
        const questionsToInsert = [];
        
        for (const q of seedQuestions) {
          const matchedTopic = createdTopics.find(t => t.slug === q.topicSlug);
          if (matchedTopic) {
            questionsToInsert.push({
              topicId: matchedTopic._id.toString(),
              text: q.text,
              options: q.options,
              explanation: q.explanation,
              timeLimit: q.timeLimit
            });
          }
        }

        const createdQuestions = await Question.insertMany(questionsToInsert);
        console.log(`Inserted ${createdQuestions.length} questions mapped to correct topics.`);
      }

      // Check Leaderboards
      const recordCount = await PerformanceRecord.countDocuments();
      if (recordCount === 0) {
        console.log('Inserting initial leaderboard legend records...');
        const randomTopicId = createdTopics[0]._id.toString();
        const recordsToInsert = seedLeaderboard.map(record => ({
          ...record,
          topicId: randomTopicId
        }));
        await PerformanceRecord.insertMany(recordsToInsert);
        console.log('Inserted leaderboard seed data.');
      }

    } else {
      console.log('Database already contains Topic records. Skipping seeding to prevent duplication.');
    }

    console.log('Seed execution completed successfully.');
  } catch (error) {
    console.error('An error occurred while seeding the database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

runSeed();
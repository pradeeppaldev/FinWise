const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const { 
  User, 
  Expense, 
  Budget, 
  Goal, 
  Lesson, 
  Progress, 
  Portfolio, 
  Post, 
  Badge 
} = require('../src/models');

// Connect to database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Sample data
const adminUser = {
  name: 'Admin User',
  email: 'admin@finwise.com',
  password: 'admin123',
  role: 'admin',
  verified: true
};

const mentorUsers = [
  { name: 'Financial Mentor 1', email: 'mentor1@finwise.com', password: 'mentor123', role: 'mentor' },
  { name: 'Financial Mentor 2', email: 'mentor2@finwise.com', password: 'mentor123', role: 'mentor' },
  { name: 'Financial Mentor 3', email: 'mentor3@finwise.com', password: 'mentor123', role: 'mentor' },
  { name: 'Financial Mentor 4', email: 'mentor4@finwise.com', password: 'mentor123', role: 'mentor' },
  { name: 'Financial Mentor 5', email: 'mentor5@finwise.com', password: 'mentor123', role: 'mentor' }
];

const sampleUsers = [
  { name: 'Alex Johnson', email: 'alex.johnson@example.com', password: 'user123' },
  { name: 'Maria Garcia', email: 'maria.garcia@example.com', password: 'user123' },
  { name: 'James Wilson', email: 'james.wilson@example.com', password: 'user123' },
  { name: 'Sarah Davis', email: 'sarah.davis@example.com', password: 'user123' },
  { name: 'Robert Miller', email: 'robert.miller@example.com', password: 'user123' },
  { name: 'Jennifer Brown', email: 'jennifer.brown@example.com', password: 'user123' },
  { name: 'Michael Taylor', email: 'michael.taylor@example.com', password: 'user123' },
  { name: 'Linda Anderson', email: 'linda.anderson@example.com', password: 'user123' },
  { name: 'David Thomas', email: 'david.thomas@example.com', password: 'user123' },
  { name: 'Patricia Jackson', email: 'patricia.jackson@example.com', password: 'user123' },
  { name: 'Christopher White', email: 'christopher.white@example.com', password: 'user123' },
  { name: 'Elizabeth Harris', email: 'elizabeth.harris@example.com', password: 'user123' },
  { name: 'Matthew Martin', email: 'matthew.martin@example.com', password: 'user123' },
  { name: 'Barbara Thompson', email: 'barbara.thompson@example.com', password: 'user123' },
  { name: 'Daniel Robinson', email: 'daniel.robinson@example.com', password: 'user123' },
  { name: 'Susan Clark', email: 'susan.clark@example.com', password: 'user123' },
  { name: 'Anthony Lewis', email: 'anthony.lewis@example.com', password: 'user123' },
  { name: 'Jessica Lee', email: 'jessica.lee@example.com', password: 'user123' },
  { name: 'Mark Walker', email: 'mark.walker@example.com', password: 'user123' },
  { name: 'Margaret Hall', email: 'margaret.hall@example.com', password: 'user123' },
  { name: 'Paul Allen', email: 'paul.allen@example.com', password: 'user123' },
  { name: 'Ashley Young', email: 'ashley.young@example.com', password: 'user123' },
  { name: 'Steven King', email: 'steven.king@example.com', password: 'user123' },
  { name: 'Kimberly Wright', email: 'kimberly.wright@example.com', password: 'user123' },
  { name: 'Kevin Scott', email: 'kevin.scott@example.com', password: 'user123' },
  { name: 'Donna Green', email: 'donna.green@example.com', password: 'user123' },
  { name: 'Brian Baker', email: 'brian.baker@example.com', password: 'user123' },
  { name: 'Emily Adams', email: 'emily.adams@example.com', password: 'user123' },
  { name: 'Jason Nelson', email: 'jason.nelson@example.com', password: 'user123' },
  { name: 'Carol Carter', email: 'carol.carter@example.com', password: 'user123' },
  { name: 'George Mitchell', email: 'george.mitchell@example.com', password: 'user123' },
  { name: 'Amanda Perez', email: 'amanda.perez@example.com', password: 'user123' },
  { name: 'Thomas Roberts', email: 'thomas.roberts@example.com', password: 'user123' },
  { name: 'Deborah Turner', email: 'deborah.turner@example.com', password: 'user123' },
  { name: 'Charles Phillips', email: 'charles.phillips@example.com', password: 'user123' },
  { name: 'Michelle Campbell', email: 'michelle.campbell@example.com', password: 'user123' },
  { name: 'Daniel Parker', email: 'daniel.parker@example.com', password: 'user123' },
  { name: 'Dorothy Evans', email: 'dorothy.evans@example.com', password: 'user123' },
  { name: 'Kenneth Edwards', email: 'kenneth.edwards@example.com', password: 'user123' },
  { name: 'Lisa Collins', email: 'lisa.collins@example.com', password: 'user123' },
  { name: 'Ronald Stewart', email: 'ronald.stewart@example.com', password: 'user123' },
  { name: 'Betty Sanchez', email: 'betty.sanchez@example.com', password: 'user123' },
  { name: 'Timothy Morris', email: 'timothy.morris@example.com', password: 'user123' },
  { name: 'Helen Rogers', email: 'helen.rogers@example.com', password: 'user123' },
  { name: 'Jose Reed', email: 'jose.reed@example.com', password: 'user123' },
  { name: 'Janet Cook', email: 'janet.cook@example.com', password: 'user123' },
  { name: 'Lawrence Morgan', email: 'lawrence.morgan@example.com', password: 'user123' },
  { name: 'Kathleen Bell', email: 'kathleen.bell@example.com', password: 'user123' },
  { name: 'Gregory Murphy', email: 'gregory.murphy@example.com', password: 'user123' },
  { name: 'Judith Bailey', email: 'judith.bailey@example.com', password: 'user123' }
];

const lessonCategories = [
  'Budgeting Basics', 
  'Investing 101', 
  'Retirement Planning', 
  'Debt Management', 
  'Credit Scores', 
  'Emergency Funds', 
  'Tax Planning', 
  'Insurance Basics'
];

const expenseCategories = [
  'Food & Dining',
  'Transportation',
  'Bills & Utilities',
  'Entertainment',
  'Subscriptions',
  'Groceries',
  'Shopping',
  'Healthcare',
  'Travel',
  'Education'
];

const expenseMerchants = [
  'McDonald\'s', 'Starbucks', 'Walmart', 'Target', 'Amazon', 'Netflix', 'Spotify', 
  'Uber', 'Lyft', 'Shell', 'BP', 'AT&T', 'Verizon', 'Comcast', 'Disney+', 'Hulu',
  'Apple', 'Google Play', 'Best Buy', 'Home Depot', 'CVS', 'Walgreens', 'Kroger',
  'Costco', 'Safeway', 'Whole Foods', 'Subway', 'Burger King', 'Pizza Hut'
];

const badgeData = [
  { key: 'first-lesson', name: 'First Lesson', description: 'Complete your first lesson', pointsRequired: 10, icon: '🎓' },
  { key: 'budget-master', name: 'Budget Master', description: 'Create 5 budgets', pointsRequired: 50, icon: '💰' },
  { key: 'goal-setter', name: 'Goal Setter', description: 'Set 3 financial goals', pointsRequired: 30, icon: '🎯' },
  { key: 'expense-tracker', name: 'Expense Tracker', description: 'Log 20 expenses', pointsRequired: 20, icon: '📊' },
  { key: 'community-contributor', name: 'Community Contributor', description: 'Make 5 posts or comments', pointsRequired: 40, icon: '💬' },
  { key: 'investment-beginner', name: 'Investment Beginner', description: 'Complete investing lessons', pointsRequired: 100, icon: '📈' },
  { key: 'financial-ninja', name: 'Financial Ninja', description: 'Achieve 500 points', pointsRequired: 500, icon: '🥋' },
  { key: 'quiz-champion', name: 'Quiz Champion', description: 'Score 100% on 5 quizzes', pointsRequired: 75, icon: '🏆' }
];

// Seed functions
const seedAdminAndMentors = async () => {
  console.log('Seeding admin and mentor users...');
  
  // Hash passwords
  const saltRounds = 12;
  const hashedAdminPassword = await bcrypt.hash(adminUser.password, saltRounds);
  const hashedMentorPasswords = await Promise.all(
    mentorUsers.map(mentor => bcrypt.hash(mentor.password, saltRounds))
  );
  
  // Create admin user
  const admin = new User({
    ...adminUser,
    passwordHash: hashedAdminPassword,
    points: 1000
  });
  await admin.save();
  
  // Create mentor users
  const mentors = await User.insertMany(
    mentorUsers.map((mentor, index) => ({
      ...mentor,
      passwordHash: hashedMentorPasswords[index],
      points: Math.floor(Math.random() * 500) + 200
    }))
  );
  
  console.log(`Created 1 admin and ${mentors.length} mentors`);
  return { admin, mentors };
};

const seedUsers = async () => {
  console.log('Seeding regular users...');
  
  // Hash passwords
  const saltRounds = 12;
  const hashedPasswords = await Promise.all(
    sampleUsers.map(user => bcrypt.hash(user.password, saltRounds))
  );
  
  // Create users with random points
  const users = await User.insertMany(
    sampleUsers.map((user, index) => ({
      ...user,
      passwordHash: hashedPasswords[index],
      points: Math.floor(Math.random() * 300) + 50,
      verified: true
    }))
  );
  
  console.log(`Created ${users.length} regular users`);
  return users;
};

const seedLessons = async () => {
  console.log('Seeding lessons...');
  
  const lessons = [];
  
  for (let i = 0; i < 20; i++) {
    const category = lessonCategories[Math.floor(Math.random() * lessonCategories.length)];
    const lesson = new Lesson({
      title: `${category} Lesson ${i + 1}`,
      slug: `lesson-${category.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`,
      contentMarkdown: `# ${category} Lesson ${i + 1}\n\nThis is the content for lesson ${i + 1} about ${category.toLowerCase()}.`,
      durationMins: Math.floor(Math.random() * 20) + 5,
      quiz: [
        {
          q: `What is the main concept of ${category}?`,
          options: [
            `Understanding ${category}`,
            `Ignoring ${category}`,
            `Complicating ${category}`,
            `Abandoning ${category}`
          ],
          answerIndex: 0
        },
        {
          q: `Why is ${category} important?`,
          options: [
            `It's not important`,
            `It helps with financial health`,
            `It makes things harder`,
            `It's only for experts`
          ],
          answerIndex: 1
        }
      ],
      tags: [category.toLowerCase(), 'financial-literacy', `lesson-${i + 1}`]
    });
    
    await lesson.save();
    lessons.push(lesson);
  }
  
  console.log(`Created ${lessons.length} lessons`);
  return lessons;
};

const seedBadges = async () => {
  console.log('Seeding badges...');
  
  const badges = await Badge.insertMany(badgeData);
  console.log(`Created ${badges.length} badges`);
  return badges;
};

const seedExpenses = async (users) => {
  console.log('Seeding expenses...');
  
  let expenseCount = 0;
  
  for (const user of users) {
    // Generate expenses for the last 6 months
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);
    
    const expenses = [];
    
    // Generate random number of expenses (20-50 per user)
    const numExpenses = Math.floor(Math.random() * 30) + 20;
    
    for (let i = 0; i < numExpenses; i++) {
      // Random date within the last 6 months
      const expenseDate = new Date(startDate);
      expenseDate.setDate(expenseDate.getDate() + Math.floor(Math.random() * 180));
      
      const expense = new Expense({
        userId: user._id,
        amount: parseFloat((Math.random() * 200 + 5).toFixed(2)),
        currency: 'USD',
        category: expenseCategories[Math.floor(Math.random() * expenseCategories.length)],
        merchant: expenseMerchants[Math.floor(Math.random() * expenseMerchants.length)],
        date: expenseDate,
        note: `Expense ${i + 1} for ${user.name}`
      });
      
      expenses.push(expense);
      expenseCount++;
    }
    
    await Expense.insertMany(expenses);
  }
  
  console.log(`Created ${expenseCount} expenses`);
};

const seedBudgets = async (users) => {
  console.log('Seeding budgets...');
  
  let budgetCount = 0;
  
  for (const user of users) {
    // Generate 2-4 budgets per user
    const numBudgets = Math.floor(Math.random() * 3) + 2;
    const budgets = [];
    
    for (let i = 0; i < numBudgets; i++) {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - (i * 2));
      
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      
      const budget = new Budget({
        userId: user._id,
        period: i % 2 === 0 ? 'monthly' : 'weekly',
        allocations: [
          { category: 'Food & Dining', amount: Math.floor(Math.random() * 300) + 100 },
          { category: 'Transportation', amount: Math.floor(Math.random() * 200) + 50 },
          { category: 'Bills & Utilities', amount: Math.floor(Math.random() * 400) + 200 },
          { category: 'Entertainment', amount: Math.floor(Math.random() * 150) + 50 }
        ],
        startDate,
        endDate
      });
      
      budgets.push(budget);
      budgetCount++;
    }
    
    await Budget.insertMany(budgets);
  }
  
  console.log(`Created ${budgetCount} budgets`);
};

const seedGoals = async (users) => {
  console.log('Seeding goals...');
  
  let goalCount = 0;
  
  for (const user of users) {
    // Generate 1-3 goals per user
    const numGoals = Math.floor(Math.random() * 3) + 1;
    const goals = [];
    
    const goalTypes = [
      { title: 'Emergency Fund', category: 'Savings' },
      { title: 'Pay off Credit Card', category: 'Debt' },
      { title: 'Vacation Savings', category: 'Savings' },
      { title: 'New Car Fund', category: 'Savings' },
      { title: 'Home Down Payment', category: 'Savings' }
    ];
    
    for (let i = 0; i < numGoals; i++) {
      const goalType = goalTypes[Math.floor(Math.random() * goalTypes.length)];
      const deadline = new Date();
      deadline.setMonth(deadline.getMonth() + Math.floor(Math.random() * 12) + 3);
      
      const goal = new Goal({
        userId: user._id,
        title: goalType.title,
        targetAmount: Math.floor(Math.random() * 5000) + 1000,
        currentAmount: Math.floor(Math.random() * 2000),
        monthlyContribution: Math.floor(Math.random() * 200) + 50,
        deadline,
        category: goalType.category,
        status: ['not-started', 'in-progress', 'in-progress'][Math.floor(Math.random() * 3)]
      });
      
      goals.push(goal);
      goalCount++;
    }
    
    await Goal.insertMany(goals);
  }
  
  console.log(`Created ${goalCount} goals`);
};

const seedProgress = async (users, lessons) => {
  console.log('Seeding lesson progress...');
  
  let progressCount = 0;
  
  for (const user of users) {
    // Randomly complete 50-80% of lessons
    const numCompleted = Math.floor(lessons.length * (Math.random() * 0.3 + 0.5));
    const completedLessons = [...lessons].sort(() => 0.5 - Math.random()).slice(0, numCompleted);
    
    const progresses = [];
    
    for (const lesson of completedLessons) {
      const progress = new Progress({
        userId: user._id,
        lessonId: lesson._id,
        status: 'completed',
        score: Math.floor(Math.random() * 40) + 60, // 60-100
        completedAt: new Date()
      });
      
      progresses.push(progress);
      progressCount++;
    }
    
    await Progress.insertMany(progresses);
  }
  
  console.log(`Created ${progressCount} progress records`);
};

const seedCommunityPosts = async (users) => {
  console.log('Seeding community posts...');
  
  const posts = [];
  
  // Create 30 sample posts
  for (let i = 0; i < 30; i++) {
    const author = users[Math.floor(Math.random() * users.length)];
    
    const post = new Post({
      authorId: author._id,
      title: `Financial Tip #${i + 1}`,
      body: `Here's a helpful financial tip I learned recently: ${[
        'Track your expenses daily to stay within budget',
        'Automate your savings to build wealth consistently',
        'Pay off high-interest debt first to save money',
        'Invest in low-cost index funds for long-term growth',
        'Build an emergency fund covering 3-6 months of expenses'
      ][Math.floor(Math.random() * 5)]}`,
      tags: ['financial-tip', 'community', `tip-${i + 1}`],
      comments: [],
      likes: []
    });
    
    // Add random comments
    const numComments = Math.floor(Math.random() * 5);
    for (let j = 0; j < numComments; j++) {
      const commenter = users[Math.floor(Math.random() * users.length)];
      if (commenter._id.toString() !== author._id.toString()) {
        post.comments.push({
          authorId: commenter._id,
          body: [
            'Great tip!',
            'Thanks for sharing!',
            'This really helped me.',
            'I\'ll try this approach.',
            'Very informative post.'
          ][Math.floor(Math.random() * 5)],
          date: new Date()
        });
      }
    }
    
    // Add random likes
    const numLikes = Math.floor(Math.random() * 10) + 1;
    const likers = [...users].sort(() => 0.5 - Math.random()).slice(0, numLikes);
    post.likes = likers.map(user => user._id);
    
    posts.push(post);
  }
  
  await Post.insertMany(posts);
  console.log(`Created ${posts.length} community posts`);
};

const seedPortfolio = async (users) => {
  console.log('Seeding portfolios...');
  
  let portfolioCount = 0;
  
  for (const user of users) {
    // 30% of users have portfolios
    if (Math.random() > 0.7) {
      const portfolio = new Portfolio({
        userId: user._id,
        positions: [
          { symbol: 'AAPL', qty: Math.floor(Math.random() * 10) + 1, entryPrice: 150 + Math.random() * 50 },
          { symbol: 'GOOGL', qty: Math.floor(Math.random() * 5) + 1, entryPrice: 2700 + Math.random() * 100 }
        ],
        cash: Math.floor(Math.random() * 5000) + 1000,
        history: []
      });
      
      await portfolio.save();
      portfolioCount++;
    }
  }
  
  console.log(`Created ${portfolioCount} portfolios`);
};

// Main seed function
const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Expense.deleteMany({});
    await Budget.deleteMany({});
    await Goal.deleteMany({});
    await Lesson.deleteMany({});
    await Progress.deleteMany({});
    await Portfolio.deleteMany({});
    await Post.deleteMany({});
    await Badge.deleteMany({});
    
    console.log('Database cleared');
    
    // Seed data
    const { admin, mentors } = await seedAdminAndMentors();
    const users = await seedUsers();
    const allUsers = [admin, ...mentors, ...users];
    
    const lessons = await seedLessons();
    const badges = await seedBadges();
    
    await seedExpenses(allUsers);
    await seedBudgets(allUsers);
    await seedGoals(allUsers);
    await seedProgress(allUsers, lessons);
    await seedCommunityPosts(allUsers);
    await seedPortfolio(allUsers);
    
    console.log('Database seeding completed successfully!');
    
    // Print sample credentials
    console.log('\n=== SAMPLE USER CREDENTIALS ===');
    console.log('Admin User:');
    console.log(`  Email: ${adminUser.email}`);
    console.log(`  Password: ${adminUser.password}`);
    console.log('\nMentor Users:');
    mentorUsers.slice(0, 2).forEach((mentor, index) => {
      console.log(`  ${index + 1}. Email: ${mentor.email}, Password: ${mentor.password}`);
    });
    console.log('\nRegular Users:');
    sampleUsers.slice(0, 3).forEach((user, index) => {
      console.log(`  ${index + 1}. Email: ${user.email}, Password: ${user.password}`);
    });
    console.log('===============================\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
// scripts/fix-user-statuses.js
// Usage: node scripts/fix-user-statuses.js
// Sets missing `status` fields on User documents and ensures sample learner is approved.

const connectDB = require('../lib/mongoose');
const User = require('../lib/models/User');

async function main() {
  await connectDB();

  console.log('Connected to DB. Scanning users for missing status...');

  const usersWithoutStatus = await User.find({ $or: [{ status: { $exists: false } }, { status: null }] });
  console.log(`Found ${usersWithoutStatus.length} users without status`);

  let updatedCount = 0;
  for (const u of usersWithoutStatus) {
    const newStatus = u.role === 'learner' ? 'pending' : 'approved';
    u.status = newStatus;
    u.updatedAt = new Date();
    await u.save();
    updatedCount++;
  }

  // Ensure sample seeded learner is approved
  const sampleEmail = 'learner@example.com';
  const learner = await User.findOne({ email: sampleEmail });
  if (learner) {
    if (learner.status !== 'approved') {
      learner.status = 'approved';
      learner.updatedAt = new Date();
      await learner.save();
      console.log(`Updated ${sampleEmail} -> approved`);
    } else {
      console.log(`${sampleEmail} already approved`);
    }
  } else {
    console.log(`No user found with email ${sampleEmail}`);
  }

  console.log(`Updated ${updatedCount} users. Done.`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Migration error:', err);
  process.exit(1);
});

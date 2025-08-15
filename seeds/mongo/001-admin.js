// Creates a default admin user if not exists
db = db.getSiblingDB(process.env.MONGO_DB || 'mrv');
if (!db.users) { db.createCollection('users'); }
const email = 'admin@example.com';
const existing = db.users.findOne({ email });
if (!existing) {
  // bcrypt hash for 'ChangeMe123'
  const hash = '$2b$10$k9dyQtE9KFeN6dQG8Y6Q1u6bLw9xE2q1XxQm3wQX3M4JkqPZV8wq6';
  db.users.insertOne({ email, name: 'Admin', passwordHash: hash, roles: ['admin'], active: true, createdAt: new Date(), updatedAt: new Date() });
}

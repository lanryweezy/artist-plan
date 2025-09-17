// MongoDB initialization script
db = db.getSiblingDB('artist_plan');

// Create collections
db.createCollection('users');
db.createCollection('projects');
db.createCollection('tasks');
db.createCollection('financial_records');
db.createCollection('content');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.projects.createIndex({ "user_id": 1 });
db.tasks.createIndex({ "user_id": 1, "project_id": 1 });
db.financial_records.createIndex({ "user_id": 1, "date": -1 });
db.content.createIndex({ "user_id": 1, "created_at": -1 });

print('Database initialized successfully!');
 const mongoose = require('mongoose');
 const dbURI = process.env.MONGODB_URI || 'mongodb://localhost/Loc8r';
 
 if (process.env.MONGODB_URI) {
  mongoose.connect(dbURI).catch(err => {
    console.log('MongoDB connection error:', err.message);
    console.log('Running without database connection');
  });
 } else {
  console.log('No MONGODB_URI environment variable found. Running without database.');
 }
 
 mongoose.connection.on('connected', () => {
  console.log(`Mongoose connected to ${dbURI}`);
 });
 mongoose.connection.on('error', err => {
  console.log(`Mongoose connection error: ${err.message}`);
 });
 mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
 });
 const gracefulShutdown = (msg, callback) => {
  mongoose.connection.close( () => {
    console.log(`Mongoose disconnected through ${msg}`);
    callback();
  });
 };
 // For nodemon restarts
 process.once('SIGUSR2', () => {
  gracefulShutdown('nodemon restart', () => {
    process.kill(process.pid, 'SIGUSR2');
  });
  });
 // For app termination
 process.on('SIGINT', () => {
  gracefulShutdown('app termination', () => {
    process.exit(0);
  });
 });
 // For Heroku app termination
 process.on('SIGTERM', () => {
  gracefulShutdown('Heroku app shutdown', () => {
    process.exit(0);
  });
 });

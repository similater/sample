const crypto = require('crypto');

// Generate a random salt
const generatecode = (len) => {
  return crypto.randomBytes(len).toString('hex');
};

// Generate a salt in the specified format: $Vers$log2(NumRounds)$saltvalue
const generateSalt = () => {
  const version = '2a'; // Salt version
  const logRounds = 10; // Number of log2 rounds
  const saltBytes = crypto.randomBytes(16).toString('hex'); // Generate random salt bytes

  return `$${version}$${logRounds.toString()}$${saltBytes}`;
};



// Usage
console.log('Salt:', generateSalt());
console.log('JWTACCESS:', generatecode(50));

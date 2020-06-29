//pull in the required items to authenticate a user
const User = require('../models').User;
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');

/**
 * using basic auth, check if we have any credentials to work with
 * if we do, see if the emailAddress is on file
 * if it is, compare the password provided with the one on file
 * if they match, set a value to be used elsewhere in the chain
 * if any steps fail provide a 401 access denied message
 */
const authenticateUser = async (req, res, next) => {
  const credentials = auth(req);
  let authMessage = null;
  if (credentials) {
    const user = await User.findOne({
      where: {
        emailAddress: credentials.name,
      },
    });
    if (user) {
      const authenticated = bcryptjs.compareSync(credentials.pass, user.password);
      if (authenticated) {
        req.currentUser = user;
      } else {
        authMessage = `Authentication failure for user: ${credentials.name}`;
      }
    } else {
      authMessage = `Authentication failure for user: ${credentials.name}`; //the same message as above to prevent brute forcing usernames
    }
  } else {
    authMessage = 'Auth header not found';
  }
  if (authMessage) {
    console.warn(authMessage);
    res.status(401).json({ message: `Access Denied: ${authMessage}` });
  } else {
    next();
  }
};

module.exports = authenticateUser;

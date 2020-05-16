const SALT_WORK_FACTOR = 10;
const bcrypt = require('bcrypt');

const { User } = require("../models/shoppingCart");
const shoppingCartController = {};

// shoppingCartController.hashPassword = (req, res, next) => {
//   bcrypt.genSalt(SALT_WORK_FACTOR)
//     .then((salt) => {
//       bcrypt.hash(req.body.password, salt)
//         .then((hashedPassword) => {
//           res.locals.user = { username: req.body.username, password: hashedPassword };
//           return next();
//         });
//     })
//     .catch((err) => {
//       console.log('hashing error: ', err);
//       return next();
//     });
// }

shoppingCartController.createUser = (req, res, next) => {
    const { username, password } = req.body
    // console.log("req.body: ",req.body," username: ", username, " password: ", password)
    if (!username.length || !password.length) {
      return next({
        log: 'Error in createUser middleware',
        message: { err: 'Nothing was entered into username/password' }
      })
    } 
    else {  // Bcrypt password from plaintext to hashed password 
      bcrypt.hash(
      password, 
      SALT_WORK_FACTOR, 
      (err, hash) => {
        // console.log('Here\'s your hash: ', hash);
        User.create({username: username, password: hash})
              .then((data) =>{
                res.locals.user = data
                console.log("Res.locals.user: ", res.locals.user)
                return next()
              })
              .catch(err => next({
                  error: `Error from database: ${err}`
                })
              );
      });
    }
}
  // console.log('this is req body', req.body)
  // const user = new User(res.locals.user);
  // //mongoose command to put this instance of User into db
  // const newUser = User.create(user, (err, newUser) => {
  //   res.locals.user = newUser;
  //   if (err)
  //     return next(
  //       "Error in shoppingCartController.createUser: " + JSON.stringify(err)
  //     );
  //   else {
  //     console.log('user created:', newUser)
  //     return next();
  //   }
  // });


shoppingCartController.verifyUser = (req, res, next) => {
  const { username, password } = req.body;
  User.findOne({ username }, (err, user) => {
    //if there is no user in db redir to sign up
    if (!user) {
      console.log("username not found");
      res.redirect("/signup");
    } else {
      //check password for user
        bcrypt.compare(password, user.password, function(err, result) {
          if (err) {
            return next({ log: 'error retrieving password from db'});
          }
          if (result) {
            return next();
          } else {
            res.redirect(301, '/signup');
          }
        });
      }//good
  })
}


module.exports = shoppingCartController;

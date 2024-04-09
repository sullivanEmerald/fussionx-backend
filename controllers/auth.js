const User = require('../model/User')
const passport =  require('passport')

module.exports = {
    registerUser : async (req, res) =>{
        const { firstname, email, password, phone, surname, newsletterCheckbox } = req.body;
    try {
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists. Try a new email" });
      }


      const user = new User({
        name: firstname,
        surname : surname,
        email: email,
        password: password,
        role: false,
        phone : phone,
        newsletterCheckbox : newsletterCheckbox,
      });

      await user.save();

      req.login(user, async (err) => {
        if (err) {
          return res.status(500).json({ error: "Internal Server Error" });
        }
        const newUser = await User.find().lean()
        const userUserDetail =  newUser[newUser.length - 1]
        return res.status(200).json({ message: "Signup successful" , user : userUserDetail });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error"});
        }
    },


    loginUser: async (req, res, next) => {
      console.log(req.body)
        passport.authenticate("local", (err, user, info) => {
          if (err) {
            return next(err);
          }
          if (!user) {
            const errorMessage = info && info.message ? info.message : 'Authentication failed';
            return res.status(401).json({ error: errorMessage });
          }
          req.logIn(user, (err) => {
            if (err) {
              return next(err);
            }
            return res.status(200).json({ message: 'Login successful', user: req.user });
          });
        })(req, res, next);
      },
      
}
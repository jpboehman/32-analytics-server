const config = require('../config/auth.config');
const db = require('../models');
const nodemailer = require('nodemailer');
const User = db.user;
const Role = db.role;

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: 'User was registered successfully!' });
          });
        }
      );
    } else {
      Role.findOne({ name: 'user' }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: 'User was registered successfully!' });
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username
  })
    .populate('roles', '-__v')
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: 'User Not found.' });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({ accessToken: null, message: 'Invalid password' })
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push('ROLE_' + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token
      });
    });
};

exports.resetPassword = (req, res) => {
  User.findOne({
    email: req.body.email
  })
    .populate('roles', '-__v')
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: 'User Not found.' });
      }

      console.log(`user: ${JSON.stringify(user)}`);

      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });
      user.update({
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 3600000
      });

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: `${process.env.EMAIL_ADDRESS}`,
          pass: `${process.env.EMAIL_PASSWORD}`,
        }
      })

      const mailOptions = {
        from: 'jpboehman@gmail.com',
        to: `${user.email}`,
        subject: 'Link to Reset Password for 32Analytics',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account. \n\n`
          + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving this email:\n\n'
          + `http://localhost:8081/reset/${token}\n\n`
          + 'If you did not request this, please ignore this email, as your password will remain unchanged.\n',
      };

      transporter.sendMail(mailOptions, (err, response) => {
        if (err) {
          console.error('the following error occurred: ', err);
        } else {
          console.log('response: ', response);
          res.status(200).send({ message: 'Reset email sent.' })
        }
      });

    });
}

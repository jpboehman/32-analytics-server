const config = require('../config/auth.config');
const db = require('../models');
const nodemailer = require('nodemailer');
const User = db.user;
const Role = db.role;

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

require('dotenv').config();

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
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

      // This server-side code creates the token once a user is validated, and is returned in the response
      // Every subsequent request from the client will contain that JWT to ensure the party is authenticated
      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400
      })
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

exports.forgotPassword = (req, res) => {
  User.findOne({
    email: req.body.email
  })
    .populate('roles', '-__v')
    .exec((err, user) => {
      if (err) {
        console.log(err)
        res.status(500).send({ message: err });
        return;
      }
      if (!user) {
        return res.status(404).send({ message: 'User Not found.' });
      }
      console.log(user);

      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400,
      })
      user.update({
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 3600000
      });

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: `${process.env.EMAIL_ADDRESS}`,
          pass: `${process.env.EMAIL_PASSWORD}`,
        },
      })

      const mailOptions = {
        from: `${process.env.EMAIL_ADDRESS}`,
        to: `${user.email}`,
        subject: 'Link to Reset Password for 32Analytics',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account. \n\n`
          + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving this email:\n\n'
          + `http://localhost:3000/reset-password-submit/${token}\n\n`
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

exports.reset = (req, res) => {
  console.log(req.query)
  User.findOne({
    $where: {
      resetPasswordToken: req.query.resetPasswordToken,
      resetPasswordExpires: {
        $gt: Date.now(),
      },
    },
  })
    .populate('roles', '-__v')
    .exec((err, user) => {
      if (err) {
        console.error('Password reset link is invalid or expired.')
        res.status(403).send({ message: 'Password reset link is invalid or has expired.' });
        return;
      }
      if (!user) {
        return res.status(404).send({ message: 'User not found.' });
      } else {
        // Ensuring that the user has a valid reset token in order for them to access to the reset component
        res.status(200).send({
          username: user.username,
          message: 'Password reset link is VALID.'
        })
      }
    });
}

// User needs to also hit updatePasswordViaEmail
const BCRYPT_SALT_ROUNDS = 12;
exports.updatePasswordViaEmail = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
      resetPasswordToken: req.body.resetPasswordToken,
      resetPasswordExpires: {
        $gt: Date.now(),
      }
    }
  })
    .populate('roles', '-__v')
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: 'Password reset link invalid or has expired' });
        return;
      }
      if (!user) {
        return res.status(404).send({ message: 'User Not found.' });
      } else {
        console.log('User who has requested password change has been found');
        bcrypt
          .hash(req.body.password, BCRYPT_SALT_ROUNDS)
          .then(hashedPassword => {
            user.update({
              password: hashedPassword,
              resetPasswordToken: null,
              resetPasswordExpires: null,
            });
          })
          .then(() => {
            console.log('Password updated successfully.')
            res.status(200).send({
              message: 'Password reset submission was submitted successfully.'
            })
          })
      }
    });
}
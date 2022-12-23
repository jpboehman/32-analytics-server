/* eslint-disable strict */
const { verifySignUp } = require('../middlewares');
const cors = require('cors');
const controller = require('../controllers/auth.controller');
// Test Stripe Mode:
// const stripe = require('stripe')(process.env.STRIPE_SECRET_TEST);
const stripe = require('stripe')(process.env.STRIPE_SECRET_PRODUCTION);

module.exports = function (app) {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
  });

  app.post(
    '/api/auth/signup',
    [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted],
    controller.signup
  );

  app.post('/api/auth/signin', cors(), controller.signin);

  // Forgot password route:
  app.get('/api/auth/reset', cors(), controller.reset);
  app.post('/api/auth/forgot-password', cors(), controller.forgotPassword);
  app.put('/api/auth/update-password-via-email', cors(), controller.updatePasswordViaEmail);

  app.post('/api/auth/create-customer-portal-session', async (req, res) => {
    try {
      const { id, username, email } = req.body.params;
      const customer = await stripe.customers.search({
        query: `email:\'${email}\'`,
      });
      const custId = customer.data[0].id;
      if (!custId) {
        res.status(404).send({ message: 'User not found' });
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: custId,
        return_url: 'https://thirtytwoanalytics.com',
      });

      res.status(200).send({ redirectUrl: session.url });
    } catch (error) {
      res.status(400).send({ message: 'Error' })
    }
  });

  app.post('/api/auth/stripe-payment', cors(), async (req, res) => {
    const { amount, id } = req.body;
    try {
      const payment = await stripe.paymentIntents.create({
        amount,
        currency: 'USD',
        description: 'thirtytwoanalytics',
        payment_method: id,
        confirm: true
      });
      console.log('Payment', payment);
      res.json({
        message: 'Payment successful',
        success: true
      });
    } catch (error) {
      // Was erroring here
      console.log('Error', error);
      res.json({
        message: 'Payment failed',
        success: false
      });
    }
  });
};

/* eslint-disable strict */
const { verifySignUp } = require('../middlewares');
const cors = require('cors');
const controller = require('../controllers/auth.controller');
// Test Stripe Mode:
// const stripe = require('stripe')(process.env.STRIPE_SECRET_TEST);
// Production Stripe:

module.exports = function(app) {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
  });

  app.post(
    // LOCAL -> '/api/auth/signup',
    '/api/auth/signup',
    [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted],
    controller.signup
  );

  // LOCAL app.post('/api/auth/signin', controller.signin);
  app.post('/api/auth/signin', cors(), controller.signin);

  // Add /api prefix for local
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
      console.log('Error', error);
      res.json({
        message: 'Payment failed',
        success: false
      });
    }
  });
};

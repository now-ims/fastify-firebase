'use strict';

const fp = require('fastify-plugin');
const fb = require('firebase-admin');

function firebase(fastify, options = {name: 'default'}, next) {
  const {name, databaseURL, cert, storageBucket} = options;

  const appConfig = {
    databaseURL,
    storageBucket,
    credential: cert
      ? fb.credential.cert(cert)
      : fb.credential.applicationDefault(),
  };

  // We need to check if this name is already being used
  if (fastify.firebase && fastify.firebase[name]) {
    return next(new Error(`fastify-firebase ${name} already registered`));
  }

  const firebaseApp = fb.initializeApp(appConfig, name);

  if (!fastify.firebase) {
    fastify.decorate('firebase', firebaseApp);
  }

  fastify.firebase[name] = firebaseApp;
  next();
}

module.exports = fp(firebase, {
  fastify: '>=1.1.0',
  name: 'fastify-firebase',
});

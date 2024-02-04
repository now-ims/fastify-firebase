"use strict";
const fp = require("fastify-plugin");
const fb = require("firebase-admin");

/**
 * @typedef {Object} FirebaseOptions
 * @property {string} name - The name of the Firebase instance.
 * @property {string} databaseURL - The URL of the Firebase database.
 * @property {Object} cert - The certificate object for authentication.
 * @property {string} storageBucket - The Firebase storage bucket.
 * @property {string} projectId - The Firebase project ID.
 */

/**
 * @param {import('fastify').FastifyInstance} fastify
 * @param {FirebaseOptions} options
 * @param {(err?: Error) => void} next
 */

function firebase(fastify, options, next) {
  const { name, databaseURL, cert, storageBucket, projectId } = options;

  const appConfig = {
    databaseURL,
    storageBucket,
    projectId,
    /* c8 ignore start */
    credential: cert
      ? fb.credential.cert(cert)
      : fb.credential.applicationDefault(),
    /* c8 ignore stop */
  };

  // We need to check if this name is already being used
  if (fastify.firebase && fastify.firebase[name]) {
    return next(new Error(`fastify-firebase ${name} already registered`));
  }

  const firebaseApp = fb.initializeApp(appConfig, name);

  if (!fastify.firebase) {
    fastify.decorate("firebase", firebaseApp);
  }

  fastify.firebase[name] = firebaseApp;
  next();
}

module.exports = fp(firebase, {
  fastify: ">=1.1.0",
  name: "fastify-firebase",
});

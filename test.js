'use strict';

const t = require('tap');
const test = t.test;
const Fastify = require('fastify');
const fastifyFirebase = require('./index');

test('Should pass with no options', t => {
  t.plan(2);

  const fastify = Fastify();
  t.tearDown(() => fastify.close());

  fastify.register(fastifyFirebase);

  fastify.ready(error => {
    t.error(error);
    t.is(fastify.firebase.name, '[DEFAULT]');
  });
});

test('Should pass if options includes cert path', t => {
  t.plan(2);

  const fastify = Fastify();
  t.tearDown(() => fastify.close());

  fastify.register(fastifyFirebase, {
    name: 'auth',
    cert: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  });

  fastify.ready(error => {
    t.error(error);
    t.is(fastify.firebase.name, 'auth');
  });
});

test('Should pass if options passed with databaseURL aka real-time db url', t => {
  t.plan(2);

  const fastify = Fastify();
  t.tearDown(() => fastify.close());

  fastify.register(fastifyFirebase, {
    name: 'withDbURL',
    cert: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    databaseURL: process.env.GOOGLE_DEV_DB,
  });

  fastify.ready(error => {
    t.error(error);
    t.is(fastify.firebase.name, 'withDbURL');
  });
});

test('Should throw with same name twice', t => {
  t.plan(2);
  const fastify = Fastify();
  t.tearDown(() => fastify.close());
  const name = 'same';

  fastify.register(fastifyFirebase, {
    name,
    cert: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    databaseURL: process.env.GOOGLE_DEV_DB,
  });

  fastify.register(fastifyFirebase, {
    name,
    cert: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    databaseURL: process.env.GOOGLE_DEV_DB,
  });

  fastify.ready(error => {
    t.ok(error);
    t.is(error.message, 'fastify-firebase same already registered');
  });
});

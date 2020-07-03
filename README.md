# fastify-firebase

![](https://github.com/now-ims/fastify-firebase/workflows/ci/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/now-ims/fastify-firebase/badge.svg?branch=master)](https://coveralls.io/github/now-ims/fastify-firebase?branch=master)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)

This plugin adds the [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup) to Fastify so you can easy use Firebase Auth, Firestore, Cloud Storage, Cloud Messaging, and more.

## Install

```
yarn add @now-ims/fastify-firebase
npm i @now-ims/fastify-firebase -S
```

## Usage

Add it to you project with `register` and you're done!  
This plugin will add a `firebase` namespace in your Fastify instance - uou can access the Firebase SDK objects via `fastify.firebase`:

```
auth - e.g., fastify.firebase.auth().createUser()
firestore - e.g., fastify.firebase.firestore().collection('users').get()
storage - e.g., fastify.firebase.store().bucket('thumbnails')
machineLearning - e.g., fastify.firebase.machineLearning().createModel()
```

## API

- `options` - if deploying from [Google Cloud](https://cloud.google.com) options are optional
  - `name` (_Default: `'default'`, Type: `string`_) **is required** if you want to load configurations for multiple projects
  - `cert` (_Optional, Type: `string`_) **is required** if you you are not on Google Cloud or want to load multiple configurations
  - `databaseURL` (_Optional, Type: `string`_) **is required** for [Realtime Database](https://firebase.google.com/docs/database/admin/start)
  - `storageBucket` (_Optional, Type: `string`_) e.g., `<BUCKET_NAME>.appspot.com` - do not include any `gs://`

### Example

#### Google Cloud - Application Default Credentials

```js
const fastify = require('fastify')({logger: true});

fastify.register(require('fastify-sensible'));
fastify.register(require('@now-ims/fastify-firebase'));

fastify.get('/user/:id', async (req, reply) => {
  const user = await fastify.firebase
    .firestore()
    .collection('users')
    .doc(req.params.id)
    .get();

  if (!user.exists) {
    return reply.notFound();
  }

  return user.data();
});

fastify.listen(4331, err => {
  if (err) throw err;
  console.log(`server listening on ${fastify.server.address().port}`);
});
```

#### Register multiple Firebase projects w/ options and Separate Route File

```js
const fastify = require('fastify')({logger: true});

fastify.register(require('fastify-sensible'));

// Here we will load multiple configurations for multiple projects!
// You most likely will not need this, but it is available should you need it.
fastify.register(require('@now-ims/fastify-firebase'), {
  name: 'client1',
  cert: '/path/to/my/cert/',
});
// this can be called with either fastify.firebase or fastify.firebase['client1']

fastify.register(require('@now-ims/fastify-firebase'), {
  name: 'client2',
  cert: process.env.FIREBASE_CONFIG,
  storageBucket: 'thumbnails.appspot.com',
});
// this can only be called with fastify.firebase['client2']

fastify.listen(4331, err => {
  if (err) throw err;
  console.log(`server listening on ${fastify.server.address().port}`);
});
```

In your route file you can simply do the following e.g.:

```js
async function userRoute(fastify, options) {
  fastify.get('/users/:id', async (req, reply) => {
    const {id} = req.params;
    const user = await fastify.firebase['client2']
      .firestore()
      .collection('users')
      .get(id)
      .get();

    if (!user.exists) {
      return reply.notFound();
    }

    return user.data();
  });
}
```

## License

Licensed under [MIT](./LICENSE).

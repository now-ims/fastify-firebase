import type { FastifyPluginCallback } from "fastify";
import type firebase from "firebase-admin";
type FastifyFirebase = FastifyPluginCallback<fastifyFirebase.FirebaseOptions>;

declare module "fastify" {
  interface FastifyInstance {
    firebase: firebase;
  }
}

declare namespace fastifyFirebase {
  /**
   * @example
   * fastify.register(require('@now-ims/fastify-firebase'))
   */
  export interface FirebaseOptions {
    name: string;
    databaseURL: string;
    cert: Object;
    storageBucket: string;
    projectId: string;
  }

  export const fastifyFirebase: FastifyFirebase;
  export { fastifyFirebase as default };
}

declare function fastifyFirebase(
  ...params: Parameters<FastifyFirebase>
): ReturnType<FastifyFirebase>;
export = fastifyFirebase;

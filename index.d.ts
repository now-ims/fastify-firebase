import type { FastifyPluginCallback } from "fastify";
import type { App } from "firebase-admin/app";
type FastifyFirebase = FastifyPluginCallback<fastifyFirebase.FirebaseOptions>;

declare module "fastify" {
  interface FastifyInstance {
    firebase: App;
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

export default fastifyFirebase;

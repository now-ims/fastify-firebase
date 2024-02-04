import { FastifyPluginCallback } from "fastify";

type FastifyFirebase = FastifyPluginCallback<fastifyFirebase.FirebaseOptions>;

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

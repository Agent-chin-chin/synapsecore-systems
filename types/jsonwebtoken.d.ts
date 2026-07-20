declare module 'jsonwebtoken' {
  interface JwtPayload {
    [key: string]: any;
  }
  
  function sign(payload: object | string | Buffer, secretOrPrivateKey: string | Buffer | object, options?: object): string;
  function verify(token: string, secretOrPrivateKey: string | Buffer | object, options?: object): JwtPayload;
  function decode(token: string, options?: object): JwtPayload | string | object | null;
}

declare module '@aws-sdk/client-s3' {
  export class S3Client {
    constructor(config: { region: string });
    send(command: PutObjectCommand): Promise<unknown>;
  }
  
  export interface PutObjectCommandParams {
    Bucket: string;
    Key: string;
    Body: Buffer | string | Uint8Array;
    ContentType?: string;
    ACL?: string;
    Metadata?: Record<string, string>;
  }
  
  export class PutObjectCommand {
    constructor(params: PutObjectCommandParams);
  }
}
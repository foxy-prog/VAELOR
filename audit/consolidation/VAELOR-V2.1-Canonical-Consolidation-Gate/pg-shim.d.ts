declare module "pg" {
  export class Pool {
    constructor(options: { connectionString: string });
    connect(): Promise<any>;
    query(sql: string, params?: unknown[]): Promise<any>;
    end(): Promise<void>;
  }
  export class Client {
    constructor(options: { connectionString: string });
    connect(): Promise<void>;
    query(sql: string, params?: unknown[]): Promise<any>;
    end(): Promise<void>;
  }
}

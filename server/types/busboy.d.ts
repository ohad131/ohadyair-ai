declare module "busboy" {
  interface BusboyFileInfo {
    filename?: string;
    mimeType?: string;
    encoding?: string;
  }

  interface BusboyConfig {
    headers?: Record<string, unknown>;
    limits?: {
      fileSize?: number;
    };
  }

  type BusboyFileStream = NodeJS.ReadableStream & {
    truncate?: () => void;
  };

  type BusboyHandler = (
    fieldname: string,
    file: BusboyFileStream,
    info: BusboyFileInfo
  ) => void;

  export default class Busboy {
    constructor(config?: BusboyConfig);
    on(event: "file", handler: BusboyHandler): this;
    on(event: "finish", handler: () => void): this;
    on(event: "error", handler: (error: unknown) => void): this;
    on(event: string, handler: (...args: any[]) => void): this;
    write(chunk: any): void;
    end(): void;
  }
}

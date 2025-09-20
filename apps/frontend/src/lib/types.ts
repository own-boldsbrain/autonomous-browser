export type Message = {
  role?: string;
  input: {
    chunkId?: string;
    response: string;
  };
  timestamp?: number;
  name?: string;
};

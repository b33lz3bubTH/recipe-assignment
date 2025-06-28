import mongoose, { ConnectOptions } from "mongoose";

export class MongoDataSource {
  constructor(private dbUri: string) {}

  async init() {
    try {
      mongoose.connect(this.dbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as ConnectOptions);
      console.log("MongoDB connected");
    } catch (err: unknown) {
      console.error("MongoDB connection error:", (err as Error).message);
      process.exit(1);
    }
  }

  async close(){
    console.log(`~ closed`);
  }
}
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDataSource = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class MongoDataSource {
    constructor(dbUri) {
        this.dbUri = dbUri;
    }
    async init() {
        try {
            mongoose_1.default.connect(this.dbUri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log("MongoDB connected");
        }
        catch (err) {
            console.error("MongoDB connection error:", err.message);
            process.exit(1);
        }
    }
    async close() {
        console.log(`~ closed`);
    }
}
exports.MongoDataSource = MongoDataSource;

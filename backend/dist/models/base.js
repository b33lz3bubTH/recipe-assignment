"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseSchemaFields = exports.BaseModel = void 0;
const mongoose_1 = require("mongoose");
const baseSchemaFields = {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    createdBy: { type: String, default: "" },
    updatedBy: { type: String, default: "" },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: String, default: null },
};
exports.baseSchemaFields = baseSchemaFields;
const baseSchema = new mongoose_1.Schema(baseSchemaFields, {
    versionKey: false,
});
// Middleware to automatically update timestamps and user info
baseSchema.pre("save", function (next) {
    this.updatedAt = new Date();
    if (!this.createdAt) {
        this.createdAt = this.updatedAt;
    }
    next();
});
exports.BaseModel = (0, mongoose_1.model)("Base", baseSchema);

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const base_1 = require("./base");
const collections_1 = require("./collections");
const schemaFields = {
    username: { type: String },
    email: { type: String },
    password: { type: String },
};
const schema = new mongoose_1.Schema({
    ...base_1.baseSchemaFields,
    ...schemaFields,
});
schema.index({
    username: "text",
    email: "text",
}, {
    name: "users_search_index",
    weights: {
        username: 5,
        email: 3
    },
});
exports.UserModel = (0, mongoose_1.model)(collections_1.ModelRefs.Users, schema);

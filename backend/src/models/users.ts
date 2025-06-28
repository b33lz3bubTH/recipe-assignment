import { Schema, model } from "mongoose";
import { IBaseDocument, baseSchemaFields } from "./base";
import { SchemaFields } from "./collections";
import { ModelRefs } from "./collections";

interface UsersEntity {
  username: string;
  email: string;
  password: string;
  
}

interface IUsers extends IBaseDocument, UsersEntity {}

const schemaFields: SchemaFields<UsersEntity> = {
  username: { type: String },
  email: { type: String },
  password: { type: String },
  
};

const schema = new Schema<IUsers>({
  ...baseSchemaFields,
  ...schemaFields,
});

schema.index(
  {
    username: "text",
    email: "text",
  },
  {
    name: "users_search_index",
    weights: {
      username: 5,
      email: 3
    },
  }
);

export const UserModel = model<IUsers>(ModelRefs.Users, schema);

export { IUsers, UsersEntity };
import { Schema } from "mongoose";
import { User, IUser } from "./User.js";

export interface IAdmin extends IUser {}

const Admin = User.discriminator<IAdmin>("admin", new Schema({}));

export { Admin };

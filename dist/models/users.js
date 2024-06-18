import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    authentication: {
        password: { type: String, required: true },
        salt: { type: String, select: false },
        sessionToken: { type: String, select: false }
    }
});
export const UserModel = mongoose.model('User', userSchema);
export const getUsers = () => UserModel.find();
export const getUserByEmail = (email) => UserModel.findOne({ email });
export const getUserBySessionToken = (sessionToken) => UserModel.findOne({ 'authentication.sessionToken': sessionToken });
export const getUserById = (id) => UserModel.findById(id);
export const createUser = (values) => new UserModel(values).save().then((user) => user.toObject());
export const updateUser = (id, values) => UserModel.findByIdAndUpdate(id, values, { new: true }).then((user) => user?.toObject());
export const deleteUser = (id) => UserModel.findByIdAndDelete(id).then((user) => user?.toObject());

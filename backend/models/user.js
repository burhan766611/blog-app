import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    username: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
});

const userModel = mongoose.model('userModel', userSchema);

export default userModel;
import mongoose from "mongoose";

const { Schema } = mongoose;

const TodoSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    done: {
        type: Boolean,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: () => {
            return this.createdAt.toLocaleDateString();
        }
    }
});

export default mongoose.model('Todo', TodoSchema);
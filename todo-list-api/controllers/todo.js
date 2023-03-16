import Todo from "../models/Todo.js";


export const createTodo = async (req, res) => {

    const newTodo = new Todo(req.body);
    newTodo.date = new Date();
    try {
        const savedTodo = await newTodo.save();
        res.status(201).json(savedTodo);
    } catch (err) {
        res.status(500).json({
            ok: false,
            msg: err
        });
    }
};

export const updateTodo = async (req, res) => {
    try {
        const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        if (updatedTodo === null) {
            return res.status(404).json({
                ok: false,
                msg: 'Todo not found!'
            });
        }
        res.status(201).json(updatedTodo);
    } catch (err) {
        res.status(500).json({
            ok: false,
            msg: err
        });
    }
};

export const deleteTodo = async (req, res) => {
    try {
        const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
        if (deletedTodo === null) {
            return res.status(404).json({
                ok: false,
                msg: 'Todo not found!'
            });
        }
        res.status(201).json({
            ok: true,
            msg: 'Todo Deleted!',
            todo: deletedTodo
        });
    } catch (err) {
        res.status(500).json({
            ok: false,
            msg: err
        });
    }
};

export const getOneTodo = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        res.status(201).json({
            ok: true,
            todo: todo
        });
    } catch (err) {
        res.status(500).json({
            ok: false,
            msg: err
        });
    }
};

export const getTodos = async (req, res) => {
    try {
        const todos = await Todo.find();
        res.status(201).json(todos);
    } catch (err) {
        res.status(500).json({
            ok: false,
            msg: err
        });
    }
};
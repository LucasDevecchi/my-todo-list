import express from "express";
import { createTodo, deleteTodo, getOneTodo, getTodos, updateTodo } from "../controllers/todo.js";

const router = express.Router();

router.post('/', createTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);
router.get('/:id', getOneTodo);
router.get('/', getTodos);

export default router;
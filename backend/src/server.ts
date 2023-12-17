import { getPosts, getPostById, createPost, updatePost, deletePost } from './controllers/postsController';
require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const cors = require('cors');
app.use(express.json());
app.use(cors());

app.get('/', getPosts);
app.get('/:id', getPostById);
app.post('/', createPost);
app.put('/:id', updatePost);
app.delete('/:id', deletePost);

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

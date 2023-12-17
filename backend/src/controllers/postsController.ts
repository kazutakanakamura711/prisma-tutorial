import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

interface InsertPost {
  title: string;
  content: string;
}


const getPosts = async (_req: Request, res: Response) => {
  const getPosts = await prisma.posts.findMany({
    orderBy: {
      id: 'desc',
    },
  });
  return res.json(getPosts);
}

const getPostById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const getPost = await prisma.posts.findUnique({
    where: {
      id
    }
  });
  return res.json(getPost);
}

const createPost = async (req: Request, res: Response) => {
  const { title, content } = req.body as InsertPost;
  const createPosts = await prisma.posts.create({
    data: {
      title,
      content,
    },
  });
  return res.json(createPosts);
}

const updatePost = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { title, content } = req.body as InsertPost;
  const updatePost = await prisma.posts.update({
    where: {
      id,
    },
    data: {
      title,
      content,
    },
  });
  return res.json(updatePost);
}

const deletePost = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const deletePost = await prisma.posts.delete({
    where: {
      id,
    },
  });
  return res.json(deletePost);
}

export { getPosts, getPostById, createPost, updatePost, deletePost };

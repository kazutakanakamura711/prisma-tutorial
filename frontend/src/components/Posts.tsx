import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

type PostForm = Pick<Post, 'title' | 'content'>;

export const Posts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);


  const { register, handleSubmit, reset } = useForm<PostForm>({
    defaultValues: {
      title: '',
      content: ''
    }
  });

  const handleCreate = async (data: PostForm) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const post = await response.json();
    reset();
    setPosts([post, ...posts]);
  }

  const handleEditClick = (post: Post) => {
    setEditingPostId(post.id);
    setIsEditing(true);
    reset(post);
  };

  const handleEdit = async (data: PostForm) => {
    if (editingPostId === null) return;
  
    const response = await fetch(`${import.meta.env.VITE_API_URL}${editingPostId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  
    const updatedPost = await response.json();
    setPosts(posts.map(post => post.id === editingPostId ? updatedPost : post));
    setIsEditing(false);
    setEditingPostId(null);
    reset();
  };

  const handleDelete = async (postId: number) => {
    await fetch(`${import.meta.env.VITE_API_URL}${postId}`, {
      method: 'DELETE',
    });

    setPosts(posts.filter(post => post.id !== postId));
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}`)
      .then(response => response.json())
      .then(data => {
        setPosts(data);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  }, []);
  

  return (
    <div>
      <h1>Posts</h1>
      <form onSubmit={handleSubmit(isEditing ? handleEdit : handleCreate)}>
        <label htmlFor="">Title</label>
        <input type="text" {...register('title')} />
        <label htmlFor="">Content</label>
        <input type="text" {...register('content')} />
        <button type="submit">{isEditing ? 'Save Changes' : 'Submit'}</button>
      </form>

      {posts.map(post => (
        <div key={post.id}>
          <h2>Title:{post.title}</h2>
          <p>Content:{post.content}</p>
          <small>Created: {new Date(post.createdAt).toLocaleString()}</small>
          <small>Updated: {new Date(post.updatedAt).toLocaleString()}</small>
          <div>
            <button onClick={() => handleEditClick(post)}>Edit</button>
            <button onClick={() => handleDelete(post.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

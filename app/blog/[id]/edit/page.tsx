'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ScrollReveal from "@/components/ui/scroll-reveal";
import { motion } from "framer-motion";

export default function EditBlogPostPage() {
  const { id } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      const res = await fetch(`/api/blog/${id}`);
      if (!res.ok) return;
      const data = await res.json();
      setTitle(data.post.title);
      setContent(data.post.content);
      setAuthor(data.post.author);
      setTags((data.post.tags || []).join(', '));
    }
    if (id) fetchPost();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          author,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean)
        })
      });
      if (!res.ok) throw new Error('Failed to update post');
      router.push(`/blog/${id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollReveal>
      <div className="p-8 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl font-bold mb-4">Edit Blog Post</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.input
              className="w-full p-2 rounded border"
              placeholder="Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            />
            <motion.input
              className="w-full p-2 rounded border"
              placeholder="Author"
              value={author}
              onChange={e => setAuthor(e.target.value)}
              required
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            />
            <motion.textarea
              className="w-full p-2 rounded border min-h-[120px]"
              placeholder="Content (HTML allowed)"
              value={content}
              onChange={e => setContent(e.target.value)}
              required
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            />
            <motion.input
              className="w-full p-2 rounded border"
              placeholder="Tags (comma separated)"
              value={tags}
              onChange={e => setTags(e.target.value)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            />
            {error && <div className="text-red-600">{error}</div>}
            <motion.button
              type="submit"
              className="px-4 py-2 bg-cyan-600 text-white rounded"
              disabled={loading}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? 'Saving...' : 'Update Post'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </ScrollReveal>
  );
}

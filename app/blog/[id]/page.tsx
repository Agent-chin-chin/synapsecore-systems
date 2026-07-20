'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ScrollReveal from "@/components/ui/scroll-reveal";
import { motion } from "framer-motion";

export default function BlogPostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        const res = await fetch(`/api/blog/${id}`);
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        setPost(data.post);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchPost();
  }, [id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!post) return <div className="p-8">No post found.</div>;

  return (
    <ScrollReveal>
      <div className="p-8 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="text-3xl font-bold mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {post.title}
          </motion.h1>
          <motion.div
            className="text-slate-400 text-sm mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            By {post.author} on {new Date(post.createdAt).toLocaleDateString()}
          </motion.div>
          <motion.div
            className="prose prose-invert"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          {post.tags && post.tags.length > 0 && (
            <motion.div
              className="mt-4 text-xs text-slate-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              Tags: {post.tags.join(', ')}
            </motion.div>
          )}
        </motion.div>
      </div>
    </ScrollReveal>
  );
}

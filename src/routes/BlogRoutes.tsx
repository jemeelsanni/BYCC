import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BlogList from '../components/blog/BlogList';
import BlogDetail from '../components/blog/BlogDetails';
import ArticleEditor from '../components/blog/ArticleEditor';
import BlogCard from '../components/blog/BlogCard';
import ProtectedRoute from './ProtectedRoutes';

const BlogRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<BlogList />} />
            <Route path="/blog" element={<BlogCard />} />
            <Route path="/:id" element={<BlogDetail />} />
            <Route element={<ProtectedRoute requireAdmin={true} children={undefined} />}>
                <Route path="/create" element={<ArticleEditor />} />
                <Route path="/edit/:id" element={<ArticleEditor />} />
            </Route>

        </Routes>
    );
};

export default BlogRoutes;
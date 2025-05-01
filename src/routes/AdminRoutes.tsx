import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoutes'
import AdminOrderManagement from '../pages/Admin/AdminOrderManagement'
import AdminOrderDetail from '../pages/Admin/AdminOrderDetail'
import AdminProduct from '../pages/Admin/AllProducts'
import AdminBlogDetail from '../pages/Admin/AdminBlogDetails'
import AdminBlogList from '../pages/Admin/AdminBlogList'
import AdminProductPreview from '../pages/Admin/AdminProductPreview'
import AdminUserDetail from '../pages/Admin/AdminUserDetail'
import AdminUserEdit from '../pages/Admin/AdminUserEdit'
import AdminUsers from '../pages/Admin/AdminUsers'
import CreateProduct from '../pages/Admin/CreateProduct'
import EditProduct from '../pages/Admin/EditProduct'

const AdminRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/orders"
                element={
                    <ProtectedRoute requireAdmin={true}>
                        <AdminOrderManagement />
                    </ProtectedRoute>
                }
            />
            <Route path="/orders/:orderId"
                element={
                    <ProtectedRoute requireAdmin={true}>
                        <AdminOrderDetail />
                    </ProtectedRoute>
                }
            />
            <Route path="/products"
                element={
                    <ProtectedRoute requireAdmin={true}>
                        <AdminProduct />
                    </ProtectedRoute>
                }
            />
            <Route path="/products/:id"
                element={
                    <ProtectedRoute requireAdmin={true}>
                        <AdminProductPreview />
                    </ProtectedRoute>
                }
            />
            <Route path="/product/create"
                element={
                    <ProtectedRoute requireAdmin={true}>
                        <CreateProduct />
                    </ProtectedRoute>
                }
            />
            <Route path="/product/:id/edit"
                element={
                    <ProtectedRoute requireAdmin={true}>
                        <EditProduct />
                    </ProtectedRoute>
                }
            />
            <Route path="/blog"
                element={
                    <ProtectedRoute requireAdmin={true}>
                        <AdminBlogList />
                    </ProtectedRoute>
                }
            />
            <Route path="/blog/:id"
                element={
                    <ProtectedRoute requireAdmin={true}>
                        <AdminBlogDetail />
                    </ProtectedRoute>
                }
            />
            <Route path="/users"
                element={
                    <ProtectedRoute requireAdmin={true}>
                        <AdminUsers />
                    </ProtectedRoute>
                }
            />
            <Route path="/users/:userId"
                element={
                    <ProtectedRoute requireAdmin={true}>
                        <AdminUserDetail />
                    </ProtectedRoute>
                }
            />
            <Route path="/users/:userId/edit"
                element={
                    <ProtectedRoute requireAdmin={true}>
                        <AdminUserEdit />
                    </ProtectedRoute>
                }
            />

        </Routes>
    )
}

export default AdminRoutes
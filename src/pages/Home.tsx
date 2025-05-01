import React from 'react';
import { Navbar, Footer } from '../components/layout';
import { HeroSection, NewArrivals, CollectionSection, CategorySection, BlogSection } from '../components/homepage';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../routes/ProtectedRoutes';
import AdminDashboard from './Admin/AdminDashboard';




const Home: React.FC = () => {
    const { isAdmin } = useAuth();

    return (
        <>
            {isAdmin ? (
                <ProtectedRoute requireAdmin={true}><AdminDashboard /></ProtectedRoute>

            ) : (
                <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-grow container mx-auto px-4 md:px-6 lg:px-8">
                        <HeroSection />
                        <NewArrivals />
                        <CollectionSection />
                        <CategorySection />
                        <BlogSection />
                    </main>
                    <Footer />
                </div>
            )}
        </>
    )
}

export default Home
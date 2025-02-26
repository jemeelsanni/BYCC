import React from 'react';
import { Navbar, Footer } from '../components/layout';
import { LoginComponent } from '../components/auth/Index';

const Login: React.FC = () => {
    return (
        <div>
            <Navbar />
            <LoginComponent />
            <Footer />
        </div>
    )
}

export default Login
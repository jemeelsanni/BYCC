import { useAuth } from '../../contexts/AuthContext';
import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { User } from '../../assets/icons';
import { Link, useNavigate } from 'react-router-dom';
import { Separator } from '../ui/separator';

// Define props type for LogoutButton
interface LogoutButtonProps {
    onClick: () => void;
    className?: string;
    children: React.ReactNode;
}

// Properly typed inline button component
const LogoutButton: React.FC<LogoutButtonProps> = ({ onClick, className, children }) => {
    return (
        <button
            onClick={onClick}
            className={`font-bold bg-[#BD3A3A] hover:bg-red-700 cursor-pointer inline-flex items-center justify-center rounded-md px-4 py-2 text-sm text-white ${className || ''}`}
        >
            {children}
        </button>
    );
};

const UserMenu: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/', { replace: true });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className='flex items-end font-bold gap-2 lato-regular cursor-pointer'>
                <img src={User} alt="user" />
                <p>Hi, {user?.firstName}</p>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='flex flex-col items-center lato-regular mt-4'>
                <DropdownMenuItem>
                    <Link to="/account/orders" className="w-full text-center">
                        Orders
                    </Link>
                </DropdownMenuItem>
                <Separator />
                <DropdownMenuItem>
                    <LogoutButton onClick={handleLogout}>
                        Log Out
                    </LogoutButton>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserMenu;
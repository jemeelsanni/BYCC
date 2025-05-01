import { useAuth } from '../../contexts/AuthContext'
import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { User } from '../../assets/icons'
import { Link, useNavigate } from 'react-router-dom'
import { Separator } from '../ui/separator'
import { Button } from '../ui/button'



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
                    <Link to="/account/orders">
                        Orders
                    </Link>
                </DropdownMenuItem>
                <Separator />
                <DropdownMenuItem>
                    <Button
                        onClick={handleLogout}
                        className="flex font-bold bg-[#BD3A3A] hover:bg-red-700 cursor-pointer"
                    >
                        Log Out
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserMenu
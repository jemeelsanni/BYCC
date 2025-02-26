import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Logo, Cart, Favorite, Search, User } from "../../assets/icons";


const Navbar: React.FC = () => {
    const [isSearchActive, setIsSearchActive] = useState(false);
    return (
        <div className=" flex items-center justify-between lato-regular mx-20 my-12 py-7">
            <div className="flex gap-7">
                <Link to="/product" className="capitalize">shop products</Link>
                <Link to="/blog" className="capitalize">blog</Link>
                <Link to="/" className="uppercase">faq</Link>
            </div>
            <div className=" flex items-center">
                {!isSearchActive ? (
                    <Link to="/">
                        <img src={Logo} alt="logo" />
                    </Link>
                ) : (
                    <div className="flex items-center border-b border-gray-500 py-1">
                        <input
                            type="text"
                            placeholder="Search Products"
                            className="outline-none bg-transparent w-[555px]"
                        />
                        <button onClick={() => setIsSearchActive(false)}>
                            <img src={Search} alt="search" className="w-5 h-5 ml-2 cursor-pointer" />
                        </button>
                    </div>
                )}

            </div>
            <div className="flex items-center gap-7">
                <div className="flex gap-7">
                    <Link to="/about" className="capitalize">about us</Link>
                    <Link to="/contact" className="capitalize">contact</Link>
                </div>
                <div className="flex gap-7">
                    {!isSearchActive && (
                        <button onClick={() => setIsSearchActive(true)}>
                            <img src={Search} alt="search" className="cursor-pointer" />
                        </button>
                    )}
                    <Link to="/login">
                        <img src={User} alt="user" />
                    </Link>
                    <Link to="/">
                        <img src={Favorite} alt="favorite" />
                    </Link>
                    <Link to="/cart">
                        <img src={Cart} alt="cart" />
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Navbar
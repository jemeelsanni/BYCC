import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Logo, Cart, Favorite, Search, User } from "../../assets/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";


const Navbar: React.FC = () => {
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [open, setOpen] = useState(false);

    return (
        <header className="relative">
            {open && (
                <div
                    className="mt-28 p-3 px-10 rounded-3xl absolute h-auto bg-white dm-sans text-[#000] z-50 text-normal font-medium
                 w-full flex flex-col gap-4"
                >
                    <div className="flex flex-col gap-2">
                        <Link to="/product" className="capitalize">shop products</Link>
                        <Link to="/blog" className="capitalize">blog</Link>
                        <Link to="/" className="uppercase">faq</Link>
                        <Link to="/about" className="capitalize">about us</Link>
                        <Link to="/contact" className="capitalize">contact</Link>
                        <Link to="/" className="capitalize">favorite</Link>

                    </div>
                </div>
            )}
            <div className="lato-regular mx-8 md:mx-20 my-2 md:my-12 py-7">
                <div className=" flex items-center justify-between ">
                    <div>
                        <div className="flex md:hidden gap-5 items-center">
                            <FontAwesomeIcon onClick={() => setOpen(!open)} icon={faBars} className="text-xl" />
                            <Link to="/">
                                <img src={Logo} alt="logo" className="w-10 h-7" />
                            </Link>
                        </div>

                        <div className="hidden md:flex gap-7">
                            <Link to="/product" className="capitalize">shop products</Link>
                            <Link to="/blog" className="capitalize">blog</Link>
                            <Link to="/" className="uppercase">faq</Link>
                        </div>
                    </div>

                    <div className=" hidden md:flex items-center">
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
                        <div className="flex md:hidden gap-5 ">
                            <Link to="/login">
                                <img src={User} alt="user" />
                            </Link>
                            <Link to="/cart">
                                <img src={Cart} alt="cart" />
                            </Link>
                        </div>
                        <div className="hidden md:flex gap-7">
                            <Link to="/about" className="capitalize">about us</Link>
                            <Link to="/contact" className="capitalize">contact</Link>
                        </div>
                        <div className="hidden md:flex gap-7">
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
                <div className="flex md:hidden items-center border-b border-gray-500 py-1 mt-4 md:mt-0">
                    <input
                        type="text"
                        placeholder="Search Products"
                        className="outline-none bg-transparent w-[555px]"
                    />
                    <button onClick={() => setIsSearchActive(false)}>
                        <img src={Search} alt="search" className="block md:hidden w-7 h-5 ml-0 md:ml-2 cursor-pointer" />
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Navbar
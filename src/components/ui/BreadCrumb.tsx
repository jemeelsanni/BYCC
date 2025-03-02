import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumb: React.FC = () => {
    const location = useLocation();

    const pathnames = location.pathname.split("/").filter((x) => x);

    return (
        <nav className="text-[#000000] text-[12px] manrope-font mx-8 md:mx-24">
            <Link to="/" className="hover:underline">Home</Link>
            {pathnames.map((name, index) => {
                const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
                const isLast = index === pathnames.length - 1;
                return (
                    <span key={name}>
                        {" > "}
                        {isLast ? (
                            <span className="capitalize">{name.replace("-", " ")}</span>
                        ) : (
                            <Link to={routeTo} className="hover:underline">
                                {name.replace("-", " ")}
                            </Link>
                        )}
                    </span>
                );
            })}
        </nav>
    );
};

export default Breadcrumb;

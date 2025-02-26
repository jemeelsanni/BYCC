import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home, Blog, BlogDetails, About, Contact, Products, ProductPreview, Cart, Checkout, Login } from "./pages";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blogdetails" element={<BlogDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/product/1ab2" element={<ProductPreview />} />
      </Routes>

    </Router>
  )
}

export default App

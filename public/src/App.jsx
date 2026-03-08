import { Route, Routes } from "react-router-dom"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { fetchSettings } from "@/features/settings/settingsSlice"
import Home from "@/features/home/pages/Home"
import About from "@/features/about/pages/About"
import ProjectsPage from "@/features/project/pages/ProjectsPage"
import ProjectDetail from "@/features/project/pages/ProjectDetail"
import BlogPage from "@/features/blog/pages/BlogPage"
import BlogDetail from "@/features/blog/pages/BlogDetail"
import BooksPage from "@/features/book/pages/BooksPage"
import ProductsPage from "@/features/product/pages/ProductsPage"
import ServicesPage from "@/features/service/pages/ServicesPage"
import CertificatesPage from "@/features/certificate/pages/CertificatesPage"
import CertificateDetail from "@/features/certificate/pages/CertificateDetail"
import NotesPage from "@/features/notes/pages/NotesPage"
import ContactPage from "@/features/contact/pages/ContactPage"

import Navbar from "@/shared/components/Navbar"
import Footer from "@/shared/components/Footer"
import LenisScroll from "@/shared/components/Lenis"
import { Toaster } from "react-hot-toast"

export default function App() {
    const dispatch = useDispatch()
    useEffect(() => { dispatch(fetchSettings()) }, [dispatch])
    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <Navbar />
            <LenisScroll />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/books" element={<BooksPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/certificates" element={<CertificatesPage />} />
                <Route path="/certificates/:id" element={<CertificateDetail />} />
                <Route path="/notes" element={<NotesPage />} />
                <Route path="/contact" element={<ContactPage />} />
            </Routes>
            <Footer />
        </>
    )
}
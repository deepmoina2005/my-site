"use client"
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { VideoIcon } from "lucide-react";
import Marquee from "react-fast-marquee";
import Container from "@/shared/components/Container";
import SectionTitle from "@/shared/components/SectionTitle";
import { useThemeContext } from "@/context/ThemeContext";

import Hero from "@/features/home/components/Hero";
import FeaturedProjects from "@/features/project/components/FeaturedProjects";
import LatestBlogs from "@/features/blog/components/LatestBlogs";
import ServicesSection from "@/features/service/components/ServicesSection";
import LatestProducts from "@/features/product/components/LatestProducts";
import SkillList from "@/features/skill/components/SkillList";
import { fetchProjects } from "@/features/project/projectSlice";
import { fetchBlogs } from "@/features/blog/blogSlice";
import { fetchServices } from "@/features/service/serviceSlice";
import { fetchProducts } from "@/features/product/productSlice";
import { fetchSkills } from "@/features/skill/skillSlice";
import { fetchCertificates } from "@/features/certificate/certificateSlice";
export default function Home() {
    const dispatch = useDispatch();
    const { theme } = useThemeContext();

    useEffect(() => {
        dispatch(fetchProjects());
        dispatch(fetchBlogs());
        dispatch(fetchServices());
        dispatch(fetchProducts());
        dispatch(fetchSkills());
        dispatch(fetchCertificates());
    }, [dispatch]);

    return (
        <>
            <Hero />

            <section className="py-20" id="projects">
                <Container>
                    <SectionTitle text1="WORK" text2="Featured Projects" text3="Explore my most impactful digital creations." />
                    <FeaturedProjects />
                </Container>
            </section>


            <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
                <Container>
                    <SectionTitle text1="SOLUTIONS" text2="Expert Services" text3="Specialized services I provide to startups and businesses." />
                    <ServicesSection />
                </Container>
            </section>

            <section className="py-20">
                <Container>
                    <SectionTitle text1="BLOG" text2="Latest Insights" text3="My latest articles on design, development and tech trends." />
                    <LatestBlogs />
                </Container>
            </section>

            <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
                <Container>
                    <SectionTitle text1="TOOLS" text2="Featured Products" text3="Premium resources and tools to accelerate your workflow." />
                    <LatestProducts />
                </Container>
            </section>

            <section className="py-20">
                <Container>
                    <SectionTitle text1="STACK" text2="Current Skills" text3="The technologies and tools I use to bring ideas to life." />
                    <div className="mt-10">
                        <SkillList />
                    </div>
                </Container>
            </section>
        </>
    );
}
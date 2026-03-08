"use client"

import React, { useEffect } from "react"
import { useDispatch } from "react-redux"

import Container from "@/shared/components/Container"
import SectionTitle from "@/shared/components/SectionTitle"

import Hero from "@/features/home/components/Hero"
import AboutSection from "@/features/home/components/AboutSection"
import FeaturedProjects from "@/features/project/components/FeaturedProjects"
import GithubActivity from "@/features/home/components/GithubActivity"
import ServicesSection from "@/features/service/components/ServicesSection"
import SkillList from "@/features/skill/components/SkillList"
import CertificateList from "@/features/certificate/components/CertificateList"

import { fetchProjects } from "@/features/project/projectSlice"
import { fetchServices } from "@/features/service/serviceSlice"
import { fetchSkills } from "@/features/skill/skillSlice"
import { fetchCertificates } from "@/features/certificate/certificateSlice"

export default function Home() {

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchProjects())
        dispatch(fetchServices())
        dispatch(fetchSkills())
        dispatch(fetchCertificates())
    }, [dispatch])

    return (
        <>

            {/* HERO */}
            <Hero />

            {/* ABOUT ME */}
            <AboutSection />

             {/* GITHUB ACTIVITY */}
            <section className="py-20 bg-slate-50 dark:bg-slate-900">
                <Container>
                    <SectionTitle
                        text1="CODE"
                        text2="GitHub Activity"
                        text3="My open source contributions and development activity."
                    />
                    <GithubActivity />
                </Container>
            </section>

                        {/* SKILLS */}
            <section className="py-20">
                <Container>
                    <SectionTitle
                        text1="STACK"
                        text2="Current Skills"
                        text3="The technologies and tools I use to bring ideas to life."
                    />
                    <div className="mt-10">
                        <SkillList />
                    </div>
                </Container>
            </section>

            {/* PROJECTS */}
            <section className="py-20" id="projects">
                <Container>
                    <SectionTitle
                        text1="WORK"
                        text2="Featured Projects"
                        text3="Explore my most impactful digital creations."
                    />
                    <FeaturedProjects />
                </Container>
            </section>

            {/* CERTIFICATES */}
            <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
                <Container>
                    <SectionTitle
                        text1="ACHIEVEMENTS"
                        text2="Certificates"
                        text3="Professional certifications and learning milestones."
                    />
                    <div className="mt-10">
                        <CertificateList />
                    </div>
                </Container>
            </section>

            {/* SERVICES */}
            <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
                <Container>
                    <SectionTitle
                        text1="SOLUTIONS"
                        text2="Expert Services"
                        text3="Specialized services I provide to startups and businesses."
                    />
                    <ServicesSection />
                </Container>
            </section>

        </>
    )
}
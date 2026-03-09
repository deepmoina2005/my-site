"use client"

import React, { useEffect } from "react"
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"

import Container from "@/shared/components/Container"
import SectionTitle from "@/shared/components/SectionTitle"

import Hero from "@/features/home/components/Hero"
import AboutSection from "@/features/home/components/AboutSection"
import FeaturedProjects from "@/features/project/components/FeaturedProjects"
import GithubActivity from "@/features/home/components/GithubActivity"
import SkillList from "@/features/skill/components/SkillList"
import CertificateList from "@/features/certificate/components/CertificateList"

import { fetchProjects } from "@/features/project/projectSlice"
import { fetchSkills } from "@/features/skill/skillSlice"
import { fetchCertificates } from "@/features/certificate/certificateSlice"

export default function Home() {

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchProjects())
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
                        <SkillList limit={8} />
                    </div>
                    <div className="mt-12 text-center">
                        <Link
                            to="/skills"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-purple-500/50 hover:-translate-y-1 transition-all duration-300 shadow-sm"
                        >
                            View All Skills
                            <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
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
                        <CertificateList limit={6} />
                    </div>
                    <div className="mt-12 text-center">
                        <Link
                            to="/certificates"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-purple-500/50 hover:-translate-y-1 transition-all duration-300 shadow-sm"
                        >
                            View All Certificates
                            <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="ArrowRight" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
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



        </>
    )
}
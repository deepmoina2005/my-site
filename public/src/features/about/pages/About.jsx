import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Container from '@/shared/components/Container';
import SectionTitle from '@/shared/components/SectionTitle';
import EducationList from '@/features/education/components/EducationList';
import CertificateList from '@/features/certificate/components/CertificateList';
import SkillList from '@/features/skill/components/SkillList';

import { fetchExperiences } from '@/features/experience/experienceSlice';
import { fetchEducations } from '@/features/education/educationSlice';
import { fetchCertificates } from '@/features/certificate/certificateSlice';
import { fetchSkills } from '@/features/skill/skillSlice';
import AboutSection from '@/features/home/components/AboutSection';

const About = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchEducations());
        dispatch(fetchCertificates());
        dispatch(fetchSkills());
    }, [dispatch]);

    return (
        <main className="pt-24 pb-16">
            <AboutSection />
            <Container>

                <section className="mb-20">
                    <SectionTitle text1="LEARNING" text2="Education" text3="Academic background and qualifications." />
                    <EducationList />
                </section>

                <section className="mb-20">
                    <SectionTitle text1="ACHIEVEMENTS" text2="Certificates" text3="Professional certifications and recognitions." />
                    <CertificateList />
                </section>

                <section>
                    <SectionTitle text1="EXPERTISE" text2="Skills" text3="Technologies and tools I work with." />
                    <SkillList />
                </section>
            </Container>
        </main>
    );
};

export default About;

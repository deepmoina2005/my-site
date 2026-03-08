import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Container from '@/shared/components/Container';
import SectionTitle from '@/shared/components/SectionTitle';
import ExperienceList from '@/features/experience/components/ExperienceList';
import EducationList from '@/features/education/components/EducationList';
import CertificateList from '@/features/certificate/components/CertificateList';
import SkillList from '@/features/skill/components/SkillList';

import { fetchExperiences } from '@/features/experience/experienceSlice';
import { fetchEducations } from '@/features/education/educationSlice';
import { fetchCertificates } from '@/features/certificate/certificateSlice';
import { fetchSkills } from '@/features/skill/skillSlice';

const About = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchExperiences());
        dispatch(fetchEducations());
        dispatch(fetchCertificates());
        dispatch(fetchSkills());
    }, [dispatch]);

    return (
        <main className="pt-24 pb-16">
            <Container>
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <h1 className="text-4xl font-bold mb-4">About Me</h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Passionate developer and lifelong learner. Here's a look at my professional journey and achievements.
                    </p>
                </div>

                <section className="mb-20">
                    <SectionTitle text1="JOURNEY" text2="Experience" text3="My professional work history and roles." />
                    <ExperienceList />
                </section>

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

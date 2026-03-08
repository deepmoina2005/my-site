import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Container from '@/shared/components/Container';
import SectionTitle from '@/shared/components/SectionTitle';
import CertificateList from '@/features/certificate/components/CertificateList';
import { fetchCertificates } from '@/features/certificate/certificateSlice';

const CertificatesPage = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchCertificates());
    }, [dispatch]);

    return (
        <main className="pt-24 pb-16">
            <Container>
                <SectionTitle
                    text1="RECOGNITION"
                    text2="Certificates & Badges"
                    text3="Official certifications and honors I have earned throughout my career."
                />
                <div className="mt-12">
                    <CertificateList />
                </div>
            </Container>
        </main>
    );
};

export default CertificatesPage;

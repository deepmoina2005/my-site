import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import Container from '@/shared/components/Container';
import SectionTitle from '@/shared/components/SectionTitle';
import { fetchServices } from '@/features/service/serviceSlice';
import { Send, Mail, Phone, MapPin, Loader2, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/shared/api/axios';

const ContactPage = () => {
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const { services } = useSelector((state) => state.services);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        service: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        dispatch(fetchServices());
    }, [dispatch]);

    useEffect(() => {
        const preSelectedService = searchParams.get('service');
        if (preSelectedService) {
            setFormData(prev => ({ ...prev, service: preSelectedService }));
        }
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await api.post('/contacts', formData);
            toast.success('Message sent! I will get back to you soon.');
            setFormData({ name: '', email: '', service: '', subject: '', message: '' });
        } catch (err) {
            toast.error('Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <main className="pt-24 pb-16">
            <Container>
                <SectionTitle text1="CONNECT" text2="Contact Me" text3="Have a project in mind or just want to say hello? Drop me a message." />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12 max-w-6xl mx-auto">
                    {/* Info Side */}
                    <div className="space-y-8">
                        <div className="p-6 rounded-3xl bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30">
                            <h3 className="text-xl font-bold mb-6 text-purple-900 dark:text-purple-100 uppercase tracking-tighter">Contact Info</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 text-purple-600 shadow-sm">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Email</p>
                                        <p className="font-semibold text-slate-900 dark:text-white">hello@example.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 text-purple-600 shadow-sm">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Phone</p>
                                        <p className="font-semibold text-slate-900 dark:text-white">+1 (555) 000-0000</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 text-purple-600 shadow-sm">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Location</p>
                                        <p className="font-semibold text-slate-900 dark:text-white">New York, NY</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Side */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                                    <input required id="name" name="name" value={formData.name} onChange={handleChange} className="w-full h-14 px-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium" placeholder="John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                                    <input required id="email" type="email" name="email" value={formData.email} onChange={handleChange} className="w-full h-14 px-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium" placeholder="john@example.com" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 relative">
                                    <label htmlFor="service" className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-1">Select Service</label>
                                    <div className="relative">
                                        <select
                                            id="service"
                                            name="service"
                                            value={formData.service}
                                            onChange={handleChange}
                                            className="w-full h-14 px-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium appearance-none cursor-pointer"
                                        >
                                            <option value="">Select Service</option>
                                            {services.map((service) => (
                                                <option key={service._id} value={service.title || service.name}>
                                                    {service.title || service.name}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="subject" className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-1">Subject</label>
                                    <input required id="subject" name="subject" value={formData.subject} onChange={handleChange} className="w-full h-14 px-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium" placeholder="Brief project overview" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-1">Message</label>
                                <textarea required id="message" name="message" value={formData.message} onChange={handleChange} rows={6} className="w-full p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium resize-none" placeholder="Tell me more about how I can help you..." />
                            </div>

                            <button disabled={loading} type="submit" className="flex items-center justify-center gap-3 w-44 h-14 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-2xl font-bold transition-all shadow-xl shadow-purple-500/20 group">
                                {loading ? <Loader2 className="animate-spin" /> : <><Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> Send Message</>}
                            </button>
                        </form>
                    </div>
                </div>
            </Container>
        </main>
    );
};

export default ContactPage;

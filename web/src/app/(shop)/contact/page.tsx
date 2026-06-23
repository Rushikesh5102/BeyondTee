"use client";

import { Mail, MapPin, MessageSquare } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        setTimeout(() => setStatus('success'), 1500);
    };

    return (
        <div className="min-h-screen bg-background text-foreground p-8 pt-24 font-inter transition-colors">
            <div className="container max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-16">

                    {/* Contact Info */}
                    <div className="space-y-12">
                        <div>
                            <h1 className="text-5xl font-bold mb-8 font-outfit">Get in Touch</h1>
                            <p className="text-muted text-lg">
                                Have a question about your order, or just want to collab?
                                We are always online and ready to help.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4 group">
                                <div className="p-3 bg-bg-secondary rounded-lg text-accent transition-colors group-hover:scale-110"><Mail /></div>
                                <div>
                                    <h3 className="font-bold text-lg">Email Us</h3>
                                    <p className="text-muted">support@beyondtee.com</p>
                                    <p className="text-muted">collab@beyondtee.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="p-3 bg-bg-secondary rounded-lg text-accent transition-colors group-hover:scale-110"><MessageSquare /></div>
                                <div>
                                    <h3 className="font-bold text-lg">WhatsApp Support</h3>
                                    <p className="text-muted">+1 (555) 000-0000</p>
                                    <p className="text-xs text-muted/70 mt-1">Available 9am - 9pm EST</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="p-3 bg-bg-secondary rounded-lg text-accent transition-colors group-hover:scale-110"><MapPin /></div>
                                <div>
                                    <h3 className="font-bold text-lg">HQ</h3>
                                    <p className="text-muted">123 Fashion Blvd</p>
                                    <p className="text-muted">Fashion District, NY 10001</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-bg-secondary/30 p-8 rounded-2xl border border-border relative overflow-hidden transition-colors">
                        {status === 'success' ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg-secondary text-center p-8 animate-in fade-in transition-colors">
                                <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4 border border-green-500/20">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-2">Message Sent!</h3>
                                <p className="text-muted">We'll get back to you shortly.</p>
                                <button onClick={() => setStatus('idle')} className="mt-6 text-sm text-accent hover:underline">Send another</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-muted mb-2 font-bold">Name</label>
                                        <input required type="text" className="w-full bg-background border border-border p-3 rounded focus:border-accent transition-colors outline-none text-foreground" />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-widest text-muted mb-2 font-bold">Email</label>
                                        <input required type="email" className="w-full bg-background border border-border p-3 rounded focus:border-accent transition-colors outline-none text-foreground" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-widest text-muted mb-2 font-bold">Message</label>
                                    <textarea required rows={5} className="w-full bg-background border border-border p-3 rounded focus:border-accent transition-colors outline-none text-foreground"></textarea>
                                </div>

                                <button disabled={status === 'submitting'} className="btn-primary w-full py-4 disabled:opacity-50 disabled:cursor-not-allowed">
                                    {status === 'submitting' ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        )}
                    </div>

                </div>

                {/* Google Maps Embed */}
                <div className="mt-24 bg-bg-secondary border border-border rounded-2xl overflow-hidden h-[400px] w-full">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.2528000654!2d-74.14483017631336!3d40.69740344218809!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1709405230973!5m2!1sen!2sin"
                        width="100%"
                        height="100%"
                        style={{ border: 0, filter: 'grayscale(100%) invert(90%) contrast(1.2)' }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>
            </div>
        </div>
    );
}

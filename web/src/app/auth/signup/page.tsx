"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowRight, ArrowLeft, CheckCircle, Mail, Lock, User, Phone, Shirt, Ruler } from "lucide-react";
import Link from "next/link";
import { API_URL } from "@/lib/api-config";

export default function SignUpPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phoneNumber: "",
        otp: "",
        gender: "",
        size: "",
        fit: ""
    });

    // OTP State
    const [otpSent, setOtpSent] = useState(false);
    const [otpSending, setOtpSending] = useState(false);
    const [otpVerifying, setOtpVerifying] = useState(false);
    const [phoneVerified, setPhoneVerified] = useState(false);

    const updateData = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const nextStep = () => {
        setError("");
        if (step === 1) {
            if (!formData.name || !formData.email || !formData.password) {
                setError("Please fill in all fields.");
                return;
            }
        }
        if (step === 2) {
            if (!phoneVerified) {
                setError("Please verify your phone number first.");
                return;
            }
        }
        setStep(s => s + 1);
    };

    const prevStep = () => {
        setError("");
        setStep(s => s - 1);
    };

    const requestOTP = async () => {
        if (!formData.phoneNumber || formData.phoneNumber.length < 10) {
            setError("Please enter a valid phone number (min 10 digits).");
            return;
        }

        setError("");
        setOtpSending(true);
        try {
            const res = await fetch(`${API_URL}/auth/send-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phoneNumber: formData.phoneNumber })
            });
            if (res.ok) {
                setOtpSent(true);
            } else {
                const data = await res.json();
                setError(data.message || "Failed to send OTP.");
            }
        } catch (err) {
            setError("Something went wrong requesting OTP.");
        } finally {
            setOtpSending(false);
        }
    };

    const verifyOTP = async () => {
        if (!formData.otp || formData.otp.length < 4) {
            setError("Please enter a valid OTP.");
            return;
        }

        setError("");
        setOtpVerifying(true);
        try {
            const res = await fetch(`${API_URL}/auth/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phoneNumber: formData.phoneNumber, code: formData.otp })
            });
            if (res.ok) {
                setPhoneVerified(true);
            } else {
                const data = await res.json();
                setError(data.message || "Invalid OTP.");
            }
        } catch (err) {
            setError("Something went wrong verifying OTP.");
        } finally {
            setOtpVerifying(false);
        }
    };

    const handleComplete = async () => {
        setLoading(true);
        setError("");

        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phoneNumber: formData.phoneNumber,
                isPhoneVerified: phoneVerified,
                preferences: JSON.stringify({
                    gender: formData.gender,
                    size: formData.size,
                    fit: formData.fit
                })
            };

            const res = await fetch(`${API_URL}/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                // Success! Redirect to login
                router.push("/auth/signin?registered=true");
            } else {
                const data = await res.json();
                setError(data.message || "Registration failed. Email might already exist.");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Animation Variants
    const slideVariants = {
        enter: { x: 50, opacity: 0 },
        center: { x: 0, opacity: 1 },
        exit: { x: -50, opacity: 0 }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 relative overflow-hidden transition-colors">
            {/* Background Accents (From Signin page) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[100px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[100px] rounded-full mix-blend-screen" />
            </div>

            <div className="w-full max-w-md bg-background/50 backdrop-blur-xl p-8 rounded-3xl border border-border shadow-2xl relative z-10">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block mb-3 text-4xl font-black font-outfit tracking-tighter hover:scale-105 transition-transform">
                        BEYOND<span className="text-accent">TEE</span>
                    </Link>
                    <h1 className="text-2xl font-bold mb-2">Create Your Account</h1>
                    <p className="text-muted text-sm">Join the premium experience.</p>
                </div>

                {/* Progress Indicators */}
                <div className="flex gap-2 mb-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden bg-foreground/10">
                            <motion.div
                                className="h-full bg-accent"
                                initial={{ width: "0%" }}
                                animate={{ width: step >= i ? "100%" : "0%" }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    ))}
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg text-center font-bold animate-in zoom-in-95">
                        {error}
                    </div>
                )}

                <div className="relative min-h-[280px]">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div key="step1" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }} className="space-y-4 absolute w-full">
                                <div>
                                    <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Full Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted"><User size={18} /></div>
                                        <input type="text" value={formData.name} onChange={(e) => updateData('name', e.target.value)} className="w-full pl-10 pr-4 py-3 bg-transparent border border-border rounded-xl focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-muted/50" placeholder="John Doe" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted"><Mail size={18} /></div>
                                        <input type="email" value={formData.email} onChange={(e) => updateData('email', e.target.value)} className="w-full pl-10 pr-4 py-3 bg-transparent border border-border rounded-xl focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-muted/50" placeholder="john@example.com" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted"><Lock size={18} /></div>
                                        <input type="password" value={formData.password} onChange={(e) => updateData('password', e.target.value)} className="w-full pl-10 pr-4 py-3 bg-transparent border border-border rounded-xl focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-muted/50" placeholder="••••••••" />
                                    </div>
                                </div>
                                <button onClick={nextStep} className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 mt-2">
                                    Next Step <ArrowRight size={18} />
                                </button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div key="step2" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }} className="space-y-5 absolute w-full">
                                <div className="text-center mb-6">
                                    <h3 className="font-bold text-lg">Verify Mobile</h3>
                                    <p className="text-xs text-muted mt-1">We need this to secure your account and send order updates.</p>
                                </div>

                                <div className="space-y-4">
                                    {!otpSent ? (
                                        <>
                                            <div>
                                                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Mobile Number</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted"><Phone size={18} /></div>
                                                    <input type="tel" value={formData.phoneNumber} onChange={(e) => updateData('phoneNumber', e.target.value)} className="w-full pl-10 pr-4 py-3 bg-transparent border border-border rounded-xl focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-muted/50" placeholder="e.g. 9876543210" />
                                                </div>
                                            </div>
                                            <button onClick={requestOTP} disabled={otpSending || !formData.phoneNumber} className="w-full py-3.5 bg-foreground text-background rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[0.98] transition-transform">
                                                {otpSending ? <Loader2 className="animate-spin" size={16} /> : <Mail size={16} />}
                                                Send OTP Code
                                            </button>
                                        </>
                                    ) : !phoneVerified ? (
                                        <>
                                            <div>
                                                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Enter 6-Digit OTP</label>
                                                <input type="text" maxLength={6} value={formData.otp} onChange={(e) => updateData('otp', e.target.value)} className="w-full px-4 py-4 bg-transparent border border-border rounded-xl focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all text-center text-2xl font-mono tracking-[0.5em] placeholder:text-muted/30" placeholder="------" />
                                                <div className="text-center mt-2">
                                                    <button onClick={() => setOtpSent(false)} className="text-xs text-accent hover:underline font-bold">Wrong number? Resend</button>
                                                    <p className="text-[10px] text-muted italic mt-1">(Check your backend console for the mock OTP!)</p>
                                                </div>
                                            </div>
                                            <button onClick={verifyOTP} disabled={otpVerifying || formData.otp.length < 4} className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 disabled:opacity-50">
                                                {otpVerifying ? <Loader2 className="animate-spin" size={18} /> : "Verify & Continue"}
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-6 bg-accent/5 border border-accent/20 rounded-xl space-y-4">
                                            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-background shadow-lg shadow-accent/40 animate-in zoom-in">
                                                <CheckCircle size={32} />
                                            </div>
                                            <div className="text-center">
                                                <h3 className="font-bold text-lg text-foreground">Phone Verified!</h3>
                                                <p className="text-xs text-muted mt-1">Your number is successfully bound.</p>
                                            </div>
                                            <button onClick={nextStep} className="w-full btn-primary py-3 flex items-center justify-center gap-2 mt-2 max-w-[200px]">
                                                Next Step <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="text-center">
                                    <button onClick={prevStep} className="text-xs text-muted hover:text-foreground font-bold tracking-widest flex items-center justify-center gap-1 mx-auto mt-2">
                                        <ArrowLeft size={14} /> Back
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div key="step3" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }} className="space-y-4 absolute w-full">
                                <div className="text-center mb-6">
                                    <h3 className="font-bold text-lg">Personalize Your Style</h3>
                                    <p className="text-xs text-muted mt-1">We'll curate the shop based on your preferences.</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <button onClick={() => updateData('gender', 'MEN')} className={`py-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${formData.gender === 'MEN' ? 'bg-accent border-accent text-background scale-[1.02] shadow-md shadow-accent/20' : 'bg-background border-border text-muted hover:border-foreground/30'}`}>
                                        <User size={20} />
                                        <span className="text-xs font-bold uppercase tracking-widest">Men's</span>
                                    </button>
                                    <button onClick={() => updateData('gender', 'WOMEN')} className={`py-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${formData.gender === 'WOMEN' ? 'bg-accent border-accent text-background scale-[1.02] shadow-md shadow-accent/20' : 'bg-background border-border text-muted hover:border-foreground/30'}`}>
                                        <User size={20} />
                                        <span className="text-xs font-bold uppercase tracking-widest">Women's</span>
                                    </button>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-2 flex items-center gap-1"><Ruler size={12} /> Preferred Size</label>
                                    <div className="flex gap-2">
                                        {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                                            <button key={size} onClick={() => updateData('size', size)} className={`flex-1 py-2.5 rounded-lg border font-bold text-xs transition-all ${formData.size === size ? 'bg-foreground text-background border-foreground' : 'bg-transparent border-border text-muted hover:border-foreground/30'}`}>
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-muted uppercase tracking-widest mb-2 mt-4 flex items-center gap-1"><Shirt size={12} /> Preferred Fit</label>
                                    <select value={formData.fit} onChange={(e) => updateData('fit', e.target.value)} className="w-full px-4 py-3 bg-transparent border border-border rounded-xl focus:border-accent outline-none transition-all text-sm font-bold min-h-[48px]">
                                        <option className="bg-background text-foreground" value="">Select Fit...</option>
                                        <option className="bg-background text-foreground" value="Normal">Normal / Regular</option>
                                        <option className="bg-background text-foreground" value="Oversized">Oversized / Drop Shoulder</option>
                                        <option className="bg-background text-foreground" value="Slim">Slim Fit</option>
                                        <option className="bg-background text-foreground" value="Boxy">Boxy</option>
                                    </select>
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button onClick={prevStep} className="px-4 py-3 bg-foreground/5 hover:bg-foreground/10 text-foreground rounded-xl flex items-center justify-center transition-colors">
                                        <ArrowLeft size={20} />
                                    </button>
                                    <button onClick={handleComplete} disabled={loading} className="flex-1 btn-primary py-3.5 flex items-center justify-center gap-2 disabled:opacity-50">
                                        {loading ? <Loader2 className="animate-spin" size={18} /> : "Complete Registration"}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="mt-8 pt-6 border-t border-border text-center text-sm text-foreground/80">
                    Already have an account?{' '}
                    <Link href="/auth/signin" className="text-accent hover:underline font-bold">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}

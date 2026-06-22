import { useState, useEffect, type FormEvent } from "react";
import { motion, type Variants } from "framer-motion";
import { Heart, Clock, Shield, Phone, ChevronRight, CheckCircle2, Menu, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

// Assume images are generated and exist in these paths
import heroImg from "@/assets/images/hero.png";
import companionshipImg from "@/assets/images/companionship.png";
import consultationImg from "@/assets/images/consultation.png";

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const auth = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const submitConsultation = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.currentTarget.reset();
    toast({ title: "Request received", description: "Our care team will contact you shortly." });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans overflow-x-hidden">
      {/* Navigation */}
      <header className="fixed top-4 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6">

          <div
            className="
            bg-white/95
            backdrop-blur-xl
            rounded-[24px]
            border
            border-slate-200
            shadow-xl
            px-8
            h-[72px]
            flex
            items-center
            justify-between
            "
          >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">

              <div className="pr-8 mr-8 border-r border-slate-200">
                <img
                  src="/befine-logo.jpeg"
                  alt="Befine"
                  className="h-14 object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-900">Befine</span>
                <span className="text-xs text-slate-500">
                  Elder Care Platform
                </span>
              </div>

            </div>

            <nav className="hidden md:flex items-center gap-11 text-sm font-medium">

              <button
                onClick={() => scrollToSection("services")}
                className="text-slate-700 hover:text-blue-600 transition-colors"
              >
                Services
              </button>

              <button onClick={() => scrollToSection("process")}className="text-slate-700 hover:text-blue-600 transition-colors">
                How It Works
              </button>

              <button onClick={() => scrollToSection("approach")}className="text-slate-700 hover:text-blue-600 transition-colors">
                Why Befine
              </button>

              <button onClick={() => scrollToSection("stories")}className="text-slate-700 hover:text-blue-600 transition-colors">
                Stories
              </button>


              {auth.user ? (
                <Button variant="outline" onClick={auth.logout}>
                  Sign Out
                </Button>
              ) : (
                <>
                  <Button
                    asChild
                    variant="ghost"
                    className="h-12 px-6 rounded-2xl"
                  >
                    <Link href="/login">Login</Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="h-12 px-8 rounded-2xl border-slate-300"
                  >
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </>
              )}

              <Button
                onClick={() => scrollToSection("contact")}
                className="rounded-full px-8 shadow-lg hover:scale-105 transition-all duration-300"
              >
                Get Care
              </Button>
            </nav>

            <button 
              className="md:hidden text-foreground" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="btn-mobile-menu"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border shadow-lg py-4 px-6 flex flex-col gap-4">
              <button onClick={() => scrollToSection("approach")} className="text-left text-foreground/80 py-2 border-b border-border/50">Our Approach</button>
              <button onClick={() => scrollToSection("services")} className="text-left text-foreground/80 py-2 border-b border-border/50">Services</button>
              <button onClick={() => scrollToSection("stories")} className="text-left text-foreground/80 py-2 border-b border-border/50">Families</button>
              <button onClick={() => scrollToSection("process")} className="text-left text-foreground/80 py-2 border-b border-border/50">How it Works</button>
             
              <Link href="/care-team" className="text-left text-foreground/80 py-2 border-b border-border/50">Care Team</Link>
              {auth.user ? <Button variant="outline" onClick={auth.logout}>Sign out</Button> : <><Link href="/login" className="text-left text-foreground/80 py-2 border-b border-border/50">Log in</Link><Link href="/signup" className="text-left text-primary font-medium py-2 border-b border-border/50">Sign up</Link></>}
              <Button onClick={() => scrollToSection("contact")} className="w-full mt-2 rounded-full">Get Care Now</Button>
            </div>
            )}

          </div> {/* navbar card */}

        </div> {/* max-w-7xl */}

      </header>

      <main className="flex-1">
        {/* 1. Hero Section */}
        <section className="relative pt-40 pb-56 md:pt-48 md:pb-32 overflow-hidden">
          {/* Decorative background blob */}
          <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl -z-10" />

          <div className="container mx-auto px-6 md:px-12 max-w-7xl">
            <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="max-w-2xl"
              >
                <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                    Care Coordination • Family Dashboard • Appointments
                </motion.div>
                <motion.h1
                  variants={fadeIn}
                  className="text-5xl md:text-6xl lg:text-5xl leading-tight font-serif text-foreground mb-6"
                >
                  Complete Elder Care.
                  <br />
                  <span className="text-primary">
                    One Connected Platform.
                  </span>
                </motion.h1>
                <motion.p variants={fadeIn} className="text-lg md:text-1xl text-muted-foreground mb-8 leading-relaxed">
                  Coordinate caregivers, manage appointments,
                  stay connected with family, and access care
                  services through a single platform designed
                  for seniors and their families.
                </motion.p>
                <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={() => scrollToSection("contact")}
                    size="lg" 
                    className="text-base h-14 px-8 rounded-full shadow-lg hover:shadow-xl transition-all"
                    data-testid="btn-hero-consult"
                  >
                    Get Care
                  </Button>
                  <Button 
                    onClick={() => scrollToSection("process")}
                    size="lg" 
                    variant="outline" 
                    className="text-base h-14 px-8 rounded-full border-border hover:bg-muted"
                    data-testid="btn-hero-learn"
                  >
                    Book Consultation
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="relative"
              >
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl aspect-[4/3] md:aspect-[3/4] lg:aspect-square">
                  <img 
                    src={heroImg} 
                    alt="Caregiver and senior smiling together" 
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=2000&auto=format&fit=crop";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                </div>
                
              </motion.div>
            </div>
          </div>
        </section>

        {/* 2. Empathy / Problem Section */}
        <section id="approach" className="py-20 bg-muted/50 border-y border-border/50">
          <div className="container mx-auto px-6 md:px-12 max-w-4xl text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
            >
              <Heart className="w-8 h-8 text-primary/40 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-6">
                Everything Families Need in One Place
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                You're balancing your own life while worrying about a parent who wants to stay independent. 
                Befine brings elder care coordination into a single platform.
                Manage appointments, health records, caregivers, billing, and family communication from one place.
              </p>
            </motion.div>
          </div>
        </section>

        {/* 3. Services Section */}
        <section id="services" className="py-24">
          <div className="container mx-auto px-6 md:px-12 max-w-7xl">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-primary font-medium tracking-wider uppercase text-sm mb-4 block">How We Help</span>
              <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-6">Everything You Need to Manage Elder Care</h2>
              <p className="text-lg text-muted-foreground">A connected platform that helps families coordinate care,track health information, manage appointments, and stay informed.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                
                  
                {
                  title: "Care Coordination",
                  desc: "Coordinate caregivers, family members, and healthcare professionals through a unified care management system.",
                  icon: <Heart className="w-6 h-6" />
                },
                {
                  title: "Appointment Management",
                  desc: "Book, track, and manage appointments with automated reminders and scheduling support.",
                  icon: <Clock className="w-6 h-6" />
                },
                {
                  title: "Health Records",
                  desc: "Store and access medical reports, prescriptions, care plans, and health history securely.",
                  icon: <Shield className="w-6 h-6" />
                },
                {
                  title: "Family Dashboard",
                  desc: "Keep families informed with real-time updates, care activities, and communication tools.",
                  icon: <Heart className="w-6 h-6" />
                },
                {
                  title: "Billing & Insurance",
                  desc: "Track invoices, manage payments, and streamline insurance-related documentation.",
                  icon: <Clock className="w-6 h-6" />
                },
                {
                  title: "Concierge Support",
                  desc: "Access additional elder care services including transportation, assistance, and personalized support.",
                  icon: <Shield className="w-6 h-6" />
                }
              
              ].map((service, idx) => (
                <motion.div 
                  key={idx}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { delay: idx * 0.2, duration: 0.6 } }
                  }}
                  className="bg-card border border-border p-8 rounded-[2rem] hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-serif font-medium mb-3">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{service.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. The Caregivers Image / Text Split */}
        <section className="py-24 bg-secondary/5 overflow-hidden">
          <div className="container mx-auto px-6 md:px-12 max-w-7xl">
            <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-16 items-center">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, x: -50 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
                }}
                className="relative order-2 md:order-1"
              >
                <div className="rounded-[2rem] overflow-hidden shadow-xl aspect-square relative">
                  <img 
                    src={companionshipImg} 
                    alt="Caregiver and senior reading together" 
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1516826957135-73314115bbc4?q=80&w=2000&auto=format&fit=crop";
                    }}
                  />
                </div>
                <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-secondary/20 rounded-full blur-3xl -z-10" />
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="order-1 md:order-2"
              >
                <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl font-serif text-foreground mb-6">
                  Built for Families, Care Teams & Providers
                </motion.h2>
                <motion.p variants={fadeIn} className="text-lg text-muted-foreground mb-8">
                  Befine connects families, caregivers, healthcare providers,and support services through a unified elder care ecosystem.
                </motion.p>
                
                <div className="space-y-4">
                  {[
                    "Rigorous background checks & referencing",
                    "Continuous specialized training programs",
                    "Matched specifically to your parent's personality",
                    "Consistent caregivers, not a revolving door"
                  ].map((item, idx) => (
                    <motion.div key={idx} variants={fadeIn} className="flex items-center gap-3">
                      <CheckCircle2 className="text-secondary w-6 h-6 flex-shrink-0" />
                      <span className="text-foreground font-medium">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 5. Testimonials */}
        <section id="stories" className="py-24">
          <div className="container mx-auto px-6 md:px-12 max-w-7xl text-center">
            <span className="text-primary font-medium tracking-wider uppercase text-sm mb-4 block">Family Stories</span>
            <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-16">Trusted by Families</h2>

            <div className="grid md:grid-cols-[1.2fr_0.8fr] lg:grid-cols-3 gap-8 text-left">
              {[
                {
                  quote: "For the first time in two years, I can sleep through the night knowing my dad is safe. Sarah isn't just a caregiver, she's become a part of our extended family. The warmth she brings into his home is incredible.",
                  author: "Michael T.",
                  relation: "Son to Robert, 82"
                },
                {
                  quote: "We were so worried mom would reject help. But Befine matched her with Elena, who shares her love for gardening. They spend hours talking about plants. It brought mom's spark back.",
                  author: "Jennifer L.",
                  relation: "Daughter to Margaret, 78"
                },
                {
                  quote: "The professionalism mixed with pure heart is what sets them apart. When mom's dementia progressed, they adjusted her care plan seamlessly without us having to manage a thing.",
                  author: "David & Sarah P.",
                  relation: "Children to Helen, 85"
                }
              ].map((test, idx) => (
                <motion.div 
                  key={idx}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { delay: idx * 0.2 } }
                  }}
                  className="bg-accent/30 border border-accent p-8 rounded-[2rem]"
                >
                  <div className="flex gap-1 mb-6">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-primary text-primary" />)}
                  </div>
                  <p className="text-foreground/90 italic mb-6 leading-relaxed">"{test.quote}"</p>
                  <div>
                    <p className="font-serif font-medium text-foreground">{test.author}</p>
                    <p className="text-sm text-muted-foreground">{test.relation}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Process */}
        <section id="process" className="py-24 bg-card border-y border-border">
          <div className="container mx-auto px-6 md:px-12 max-w-7xl">
            <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-16 items-center">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                <span className="text-primary font-medium tracking-wider uppercase text-sm mb-4 block">How it Works</span>
                <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-8">How Befine Works</h2>
                
                <div className="space-y-8 relative">
                  <div className="absolute left-6 top-8 bottom-8 w-px bg-border -z-10 hidden sm:block" />
                  
                  {[
                    { step: "01", title: "Create Profile", desc: "We start with a free, no-obligation conversation. We want to hear about their life, their needs, and your concerns." },
                    { step: "02", title: "Book Services", desc: "We don't just assign whoever is available. We carefully select a caregiver whose personality and skills align with your parent." },
                    { step: "03", title: "Track Care & Health", desc: "We handle introductions and stay in constant communication with you. You'll always know how they're doing." }
                  ].map((item, idx) => (
                    <motion.div key={idx} variants={fadeIn} className="flex gap-6 relative">
                      <div className="w-12 h-12 rounded-full bg-background border-2 border-primary text-primary flex items-center justify-center font-serif font-bold text-lg flex-shrink-0">
                        {item.step}
                      </div>
                      <div className="pt-2">
                        <h3 className="text-xl font-serif font-medium mb-2">{item.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, scale: 0.95 },
                  visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } }
                }}
                className="relative hidden md:block"
              >
                <div className="rounded-[2rem] overflow-hidden shadow-xl aspect-[4/5] relative">
                  <img 
                    src={consultationImg} 
                    alt="Care consultation" 
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2000&auto=format&fit=crop";
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 7. Contact / CTA */}
        <section id="contact" className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 -z-20" />
          <div className="container mx-auto px-6 md:px-12 max-w-5xl">
            <div className="bg-card rounded-[3rem] p-8 md:p-16 shadow-2xl border border-border relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl -z-10" />
              
              <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-12">
                <div>
                  <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">Get Started with Befine</h2>
                  <p className="text-muted-foreground mb-8">
                    Fill out the form, or call us directly. We're here to listen, answer your questions, and help you figure out the next right step.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Call us anytime</p>
                        <p className="font-serif text-xl font-medium text-foreground">(800) 555-0198</p>
                      </div>
                    </div>
                  </div>
                </div>

                <form className="space-y-4" onSubmit={submitConsultation} data-testid="contact-form">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">First Name</label>
                      <Input placeholder="Jane" className="bg-background rounded-xl h-12" data-testid="input-firstname" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Last Name</label>
                      <Input placeholder="Doe" className="bg-background rounded-xl h-12" data-testid="input-lastname" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <Input type="email" placeholder="jane@example.com" className="bg-background rounded-xl h-12" data-testid="input-email" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Phone Number</label>
                    <Input type="tel" placeholder="(555) 123-4567" className="bg-background rounded-xl h-12" data-testid="input-phone" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">How can we help?</label>
                    <Textarea 
                      placeholder="Tell us a bit about your situation..." 
                      className="bg-background rounded-xl min-h-[120px] resize-none"
                      data-testid="input-message"
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full h-14 rounded-xl text-base shadow-md mt-2" data-testid="btn-submit-form">
                    Get Started
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-4">We respect your privacy. Your information is secure.</p>
                </form>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-foreground text-background py-16 border-t border-border/10">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-white rounded-xl px-3 py-1.5 inline-flex">
                  <img src="/befine-logo.jpeg" alt="Befine" className="h-9 object-contain" />
                </div>
              </div>
              <p className="text-background/70 max-w-md leading-relaxed">
                India's connected elder care platform for care coordination, appointments, health records, billing, concierge services, and family engagement.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-background mb-4 uppercase tracking-wider text-sm">Services</h4>
              <ul className="space-y-3 text-background/70">
                <li><button onClick={() => scrollToSection("services")} className="hover:text-primary transition-colors">Care Coordination</button></li>
                <li><button onClick={() => scrollToSection("services")} className="hover:text-primary transition-colors">\Appointment Management</button></li>
                <li><button onClick={() => scrollToSection("services")} className="hover:text-primary transition-colors">Concierge Services</button></li>
                <li><button onClick={() => scrollToSection("services")} className="hover:text-primary transition-colors">Health Records</button></li>
                <li><button onClick={() => scrollToSection("services")} className="hover:text-primary transition-colors">Billing & Insurance</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-background mb-4 uppercase tracking-wider text-sm">PLATFORM</h4>
              <ul className="space-y-3 text-background/70">
                <li><button onClick={() => scrollToSection("approach")} className="hover:text-primary transition-colors">Family Dashboard</button></li>
                <li><button onClick={() => scrollToSection("contact")} className="hover:text-primary transition-colors">Care Team</button></li>
                <li><button onClick={() => scrollToSection("process")} className="hover:text-primary transition-colors">Notifications</button></li>
                <li><button onClick={() => scrollToSection("contact")} className="hover:text-primary transition-colors">Documents</button></li>
                <li><button onClick={() => scrollToSection("contact")} className="hover:text-primary transition-colors">Reports</button></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-background/50">
            <p>&copy; {new Date().getFullYear()} Befine Elder Care Platform. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-background transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-background transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

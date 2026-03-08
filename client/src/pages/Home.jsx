import Hero from '../components/Hero';
import StatsTicker from '../components/StatsTicker';
import About from '../components/About';
import Skills from '../components/Skills';
import Experience from '../components/Experience';
import Projects from '../components/Projects';
import GitHubStats from '../components/GitHubStats';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <main>
      <Hero />
      <StatsTicker />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <GitHubStats />

      {/* Contact */}
      <section id="contact" style={{ padding:'8rem 8vw', background:'radial-gradient(ellipse at center, rgba(0,255,178,0.05) 0%, #030712 65%)' }} aria-label="Contact">
        <div style={{ maxWidth:'560px' }}>
          <h2 style={{ fontFamily:'"Playfair Display",serif', fontSize:'clamp(2rem,5vw,4rem)', color:'#E8EDF5', marginBottom:'0.75rem' }}>
            Let's <span style={{ color:'#00FFB2' }}>Talk</span>
          </h2>
          <p style={{ fontFamily:'"DM Mono",monospace', fontSize:'0.83rem', color:'#E8EDF5', opacity:0.6, lineHeight:1.8, marginBottom:'2.5rem' }}>
            Open to internships, co-op positions, and interesting full-stack projects. Drop me a message or reach out directly at{' '}
            <a href="mailto:Jeelsojitra2512@gmail.com" style={{ color:'#00FFB2', textDecoration:'none' }}>Jeelsojitra2512@gmail.com</a>
          </p>
          <ContactForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}

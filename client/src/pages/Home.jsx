import { Suspense, lazy } from 'react';
import Hero from '../components/Hero';
import Footer from '../components/Footer';

const StatsTicker = lazy(() => import('../components/StatsTicker'));
const About = lazy(() => import('../components/About'));
const Skills = lazy(() => import('../components/Skills'));
const Experience = lazy(() => import('../components/Experience'));
const Projects = lazy(() => import('../components/Projects'));
const GitHubStats = lazy(() => import('../components/GitHubStats'));
const ContactForm = lazy(() => import('../components/ContactForm'));

function SectionFallback() {
  return <div className="section-fallback" aria-hidden="true" />;
}

export default function Home() {
  return (
    <main>
      <Hero />
      <Suspense fallback={<SectionFallback />}>
        <StatsTicker />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <About />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Skills />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Experience />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Projects />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <GitHubStats />
      </Suspense>

      <section id="contact" className="contact-section" aria-label="Contact">
        <div className="contact-content">
          <h2>
            Let&apos;s <span>Talk</span>
          </h2>
          <p>
            Open to internships, co-op positions, and interesting full-stack projects. Drop me a message or
            reach out directly at <a href="mailto:Jeelsojitra2512@gmail.com">Jeelsojitra2512@gmail.com</a>
          </p>
          <Suspense fallback={<SectionFallback />}>
            <ContactForm />
          </Suspense>
        </div>
      </section>

      <Footer />
    </main>
  );
}

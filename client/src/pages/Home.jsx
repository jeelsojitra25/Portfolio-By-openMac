import { Suspense, lazy } from 'react';
import Hero from '../components/Hero';
import Footer from '../components/Footer';

const StatsTicker      = lazy(() => import('../components/StatsTicker'));
const PersonalStats    = lazy(() => import('../components/PersonalStats'));
const About            = lazy(() => import('../components/About'));
const TechStackDiagram = lazy(() => import('../components/TechStackDiagram'));
const Skills           = lazy(() => import('../components/Skills'));
const SkillsRadar      = lazy(() => import('../components/SkillsRadar'));
const SkillSphere      = lazy(() => import('../components/SkillSphere'));
const Experience       = lazy(() => import('../components/Experience'));
const Timeline         = lazy(() => import('../components/Timeline'));
const Projects         = lazy(() => import('../components/Projects'));
const ProjectEmbed     = lazy(() => import('../components/ProjectEmbed'));
const DSAVisualizer    = lazy(() => import('../components/DSAVisualizer'));
const GitHubStats      = lazy(() => import('../components/GitHubStats'));
const ContactForm      = lazy(() => import('../components/ContactForm'));

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
      {/* Personal stats counter banner — below Hero, above About */}
      <Suspense fallback={<SectionFallback />}>
        <PersonalStats />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <About />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <TechStackDiagram />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Skills />
      </Suspense>
      {/* Skill category radar — immediately after Skills */}
      <Suspense fallback={<SectionFallback />}>
        <SkillsRadar />
      </Suspense>
      {/* 3D rotating skill tag cloud */}
      <Suspense fallback={<SectionFallback />}>
        <SkillSphere />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Experience />
      </Suspense>
      {/* Career milestone timeline — after Experience */}
      <Suspense fallback={<SectionFallback />}>
        <Timeline />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Projects />
      </Suspense>
      {/* Live sandboxed iframe demos — after Projects */}
      <Suspense fallback={<SectionFallback />}>
        <ProjectEmbed />
      </Suspense>
      {/* Algorithm step-through visualizer */}
      <Suspense fallback={<SectionFallback />}>
        <DSAVisualizer />
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

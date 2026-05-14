import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  Stethoscope,
  Users,
  CalendarClock,
  Activity,
  ArrowRight,
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page-new">
      <header className="home-header">
        <div className="home-header-title">QGenda Insights</div>
        <div className="home-header-actions">
          <div className="header-icon-placeholder"></div>
          <div className="header-icon-placeholder"></div>
          <div className="header-icon-placeholder"></div>
        </div>
      </header>

      <section className="home-hero">
        <div className="home-hero-content">
          <div className="home-hero-eyebrow">Optimize Your Care Team</div>
          <h1 className="home-hero-title">
            Workforce Intelligence,<br />Redefined.
          </h1>
          <p className="home-hero-subtitle">
            Turn scheduling, credentialing, and time &amp; attendance data into action.
            Help unit managers, scheduling admins, and physician leaders make the
            staffing decisions that improve patient access and reduce labor cost.
          </p>
          <button className="home-hero-cta" onClick={() => navigate('/dashboard')}>
            Explore Insights <ArrowRight size={18} />
          </button>
        </div>

        <div className="home-hero-visual" aria-hidden="true">
          <div className="home-hero-chip chip-1"><span className="dot"></span>Providers &gt; 2 min</div>
          <div className="home-hero-chip chip-2"><span className="dot"></span>Hours &ge; 6</div>
          <div className="home-hero-chip chip-3"><span className="dot"></span>Nurse &le; 7</div>
          <div className="home-hero-chip chip-4"><span className="dot"></span>State License Approved</div>
        </div>
      </section>

      <section className="home-stats-section">
        <div className="home-stat-card">
          <div className="home-stat-icon-wrapper">
            <Stethoscope size={26} />
          </div>
          <div className="home-stat-content">
            <span className="home-stat-value">700K+</span>
            <span className="home-stat-label">Providers Scheduled</span>
          </div>
        </div>
        <div className="home-stat-card">
          <div className="home-stat-icon-wrapper">
            <Users size={26} />
          </div>
          <div className="home-stat-content">
            <span className="home-stat-value">4,500+</span>
            <span className="home-stat-label">Healthcare Organizations</span>
          </div>
        </div>
        <div className="home-stat-card">
          <div className="home-stat-icon-wrapper">
            <CalendarClock size={26} />
          </div>
          <div className="home-stat-content">
            <span className="home-stat-value">24/7</span>
            <span className="home-stat-label">Workforce Optimization</span>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-eyebrow">Get Started</div>
        <h2 className="home-section-title">Explore your workforce data</h2>
        <p className="home-section-subtitle">
          Jump straight into the workforce dashboard or ask Insights AI a question in plain English.
        </p>
        <div className="home-cards-row">
          <button className="home-card" onClick={() => navigate('/dashboard')}>
            <div className="home-card-icon">
              <LayoutDashboard size={24} />
            </div>
            <div className="home-card-content">
              <h3>Workforce Dashboard</h3>
              <p>Track scheduling coverage, capacity, and staffing trends across providers, units, and locations.</p>
            </div>
          </button>
          <button className="home-card" onClick={() => navigate('/ai-analytics')}>
            <div className="home-card-icon">
              <Sparkles size={24} />
            </div>
            <div className="home-card-content">
              <h3>Insights AI</h3>
              <p>Ask natural-language questions about schedules, shifts, providers, and utilization.</p>
            </div>
          </button>
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-eyebrow">Capabilities</div>
        <h2 className="home-section-title">Simplify workforce complexity</h2>
        <p className="home-section-subtitle">
          Connect every signal — from shift coverage to credentialing — into one operational view.
        </p>
        <div className="home-cards-row-three">
          <div className="home-card-small">
            <div className="home-card-icon">
              <CalendarClock size={24} />
            </div>
            <div className="home-card-content">
              <h3>Scheduling &amp; Capacity</h3>
              <p>Visualize shift coverage, on-call rotations, and capacity gaps so unit managers can decide who to float and where to staff up.</p>
            </div>
          </div>
          <div className="home-card-small">
            <div className="home-card-icon">
              <Sparkles size={24} />
            </div>
            <div className="home-card-content">
              <h3>AI-Powered Insights</h3>
              <p>Ask questions like "Which units are overstaffed this week?" or "Show overtime trends by department" and get instant answers.</p>
            </div>
          </div>
          <div className="home-card-small">
            <div className="home-card-icon">
              <Activity size={24} />
            </div>
            <div className="home-card-content">
              <h3>Workforce &amp; Financial Outcomes</h3>
              <p>Connect staffing decisions to cost, throughput, and revenue — surface where the workforce drives access to care.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

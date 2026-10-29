import Countdown from './Countdown';
import styles from './Hero.module.css';

const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent('Quinta Samadhi Calle 242 Ruta 12');

function HoneyDrip() {
  return (
    <svg className={styles.drip} viewBox="0 0 1440 110" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="honeyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2a72f" />
          <stop offset="1" stopColor="#f6c453" />
        </linearGradient>
      </defs>
      <path
        fill="url(#honeyGrad)"
        d="M0 0 H1440 V38
           C1400 38 1395 70 1370 70 C1345 70 1350 38 1300 38
           C1240 38 1250 96 1215 96 C1180 96 1195 38 1120 38
           C1060 38 1070 58 1040 58 C1010 58 1020 38 960 38
           C900 38 905 84 875 84 C845 84 855 38 790 38
           C730 38 740 62 712 62 C684 62 690 38 630 38
           C570 38 580 104 545 104 C510 104 520 38 450 38
           C400 38 405 66 380 66 C355 66 360 38 300 38
           C240 38 250 88 218 88 C186 88 196 38 130 38
           C90 38 95 60 70 60 C45 60 50 38 0 38 Z"
      />
      <path fill="rgba(255,255,255,0.35)" d="M0 10 H1440 V16 H0 Z" />
    </svg>
  );
}

function Daisy({ className }) {
  const petals = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      {petals.map(a => (
        <ellipse key={a} cx="50" cy="22" rx="9" ry="22" fill="#fff" stroke="#e9dcc0" strokeWidth="1"
          transform={`rotate(${a} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="15" fill="#f2b631" />
      <circle cx="50" cy="50" r="15" fill="none" stroke="#d98a1f" strokeWidth="2" strokeDasharray="2 3" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21 C12 21 5 14.5 5 9.5 A7 7 0 0 1 19 9.5 C19 14.5 12 21 12 21 Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

export default function Hero() {
  return (
    <header className={styles.hero}>
      <HoneyDrip />
      <Daisy className={styles.daisyA} />
      <Daisy className={styles.daisyB} />

      <div className={styles.inner}>
        <div className={styles.text}>
          <p className={styles.kicker}>¡Acompañame a celebrar el...</p>
          <p className={styles.event}>Baby Shower</p>
          <h1 className={styles.name}>Matheo</h1>

          <dl className={styles.when}>
            <div>
              <dt className={styles.srOnly}>Día</dt>
              <dd className={styles.whenScript}>Domingo</dd>
            </div>
            <div className={styles.whenMid}>
              <dt className={styles.srOnly}>Fecha</dt>
              <dd>
                <span className={styles.whenBig}>1</span>
                <span className={styles.whenSmall}>Noviembre</span>
              </dd>
            </div>
            <div>
              <dt className={styles.srOnly}>Hora</dt>
              <dd className={styles.whenScript}>17:00 hs</dd>
            </div>
          </dl>

          <Countdown />

          <div className={styles.place}>
            <p className={styles.placeName}>Quinta Samadhi</p>
            <p className={styles.placeAddr}>Calle 242, media cuadra de Gomería Ruta 12</p>
            <a className={styles.mapBtn} href={MAPS_URL} target="_blank" rel="noreferrer">
              <PinIcon /> Cómo llegar
            </a>
          </div>

          <a className={styles.cta} href="#regalos">Elegí tu regalo</a>
        </div>

        <figure className={styles.card}>
          <img
            src="/invitacion.jpg"
            alt="Invitación al Baby Shower de Matheo con Winnie Pooh, panales de miel y margaritas"
            width="900" height="1269"
          />
        </figure>
      </div>
    </header>
  );
}

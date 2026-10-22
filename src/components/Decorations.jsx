import styles from './Decorations.module.css';

const DECO = ['🍼','⭐','🌙','💕','🎀','🌸','🧸','✨','🌈','💛','🐣','🐥'];

export default function Decorations() {
  return (
    <div className={styles.wrap}>
      {DECO.map((em, i) => (
        <span
          key={i}
          className={styles.item}
          style={{
            left: `${(i * 8.7 + 4) % 100}%`,
            fontSize: `${1.1 + (i % 4) * 0.28}rem`,
            animationDuration: `${20 + i * 2.3}s`,
            animationDelay: `${-(i * 1.8)}s`,
          }}
        >
          {em}
        </span>
      ))}
    </div>
  );
}

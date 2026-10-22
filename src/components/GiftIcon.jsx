const ICONS = {
  diapers: (
    <path d="M4 8 C4 6 6 5 8 5 L16 5 C18 5 20 6 20 8 L20 16 C20 18 18 19 16 19 L8 19 C6 19 4 18 4 16 Z M4 12 L20 12 M9 5 L7 19 M15 5 L17 19"
      strokeLinecap="round" strokeLinejoin="round" />
  ),
  hygiene: (
    <path d="M12 3 C12 3 7 9 7 13 C7 16.3 9.2 19 12 19 C14.8 19 17 16.3 17 13 C17 9 12 3 12 3 Z M9 13.5 C9 13.5 9.5 16 12 16"
      strokeLinecap="round" strokeLinejoin="round" />
  ),
  clothing: (
    <path d="M9 3 L3 7 L6 9 L6 20 L18 20 L18 9 L21 7 L15 3 C15 3 14 5 12 5 C10 5 9 3 9 3 Z"
      strokeLinecap="round" strokeLinejoin="round" />
  ),
  feeding: (
    <path d="M10 3 L14 3 L14 5 C16 5.5 17 7 17 9 L17 18 C17 19.1 16.1 20 15 20 L9 20 C7.9 20 7 19.1 7 18 L7 9 C7 7 8 5.5 10 5 Z M9.5 9 L14.5 9"
      strokeLinecap="round" strokeLinejoin="round" />
  ),
  sleep: (
    <path d="M21 12.79 A9 9 0 1 1 11.21 3 A7 7 0 0 0 21 12.79 Z"
      strokeLinecap="round" strokeLinejoin="round" />
  ),
  toys: (
    <path d="M12 2 L14.5 9 L22 9 L16 13.5 L18.5 21 L12 16.5 L5.5 21 L8 13.5 L2 9 L9.5 9 Z"
      strokeLinecap="round" strokeLinejoin="round" />
  ),
  health: (
    <path d="M9 3 L15 3 L15 9 L21 9 L21 15 L15 15 L15 21 L9 21 L9 15 L3 15 L3 9 L9 9 Z"
      strokeLinecap="round" strokeLinejoin="round" />
  ),
  gear: (
    <path d="M7 10 C7 7.2 9.2 5 12 5 C14.8 5 17 7.2 17 10 L18 10 C19.1 10 20 10.9 20 12 L20 19 C20 20.1 19.1 21 18 21 L6 21 C4.9 21 4 20.1 4 19 L4 12 C4 10.9 4.9 10 6 10 Z M9 10 C9 8.3 10.3 7 12 7 C13.7 7 15 8.3 15 10 M9 16 L15 16"
      strokeLinecap="round" strokeLinejoin="round" />
  ),
  furniture: (
    <path d="M4 6 L20 6 L20 14 C20 15.1 19.1 16 18 16 L6 16 C4.9 16 4 15.1 4 14 Z M4 6 L4 4 M20 6 L20 4 M7 16 L7 20 M17 16 L17 20 M4 11 L20 11"
      strokeLinecap="round" strokeLinejoin="round" />
  ),
};

export default function GiftIcon({ category, color }) {
  return (
    <div style={{
      width: '52px',
      height: '52px',
      borderRadius: '16px',
      background: color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '0.75rem',
      flexShrink: 0,
      boxShadow: `0 4px 14px ${color}55`,
    }}>
      <svg
        width="26" height="26" viewBox="0 0 24 24"
        fill="none"
        stroke="rgba(255,255,255,0.92)"
        strokeWidth="1.75"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {ICONS[category] ?? ICONS.toys}
      </svg>
    </div>
  );
}

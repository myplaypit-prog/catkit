type P = {
  size?: number;
  className?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
};

function S({
  size = 20,
  className,
  strokeWidth = 1.7,
  style,
  children,
}: P & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const Search = (p: P) => (
  <S {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.6-3.6" />
  </S>
);

export const Cart = (p: P) => (
  <S {...p}>
    <path d="M3 4h2.2l2 11.2a2 2 0 0 0 2 1.6h8.1a2 2 0 0 0 2-1.5L21 8H6.2" />
    <circle cx="10" cy="20" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="17.5" cy="20" r="1.3" fill="currentColor" stroke="none" />
  </S>
);

export const User = (p: P) => (
  <S {...p}>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M4.8 20c.6-3.7 3.6-5.8 7.2-5.8s6.6 2.1 7.2 5.8" />
  </S>
);

export const Menu = (p: P) => (
  <S {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </S>
);

export const Close = (p: P) => (
  <S {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </S>
);

export const ChevronRight = (p: P) => (
  <S {...p}>
    <path d="m9 5 7 7-7 7" />
  </S>
);

export const ChevronDown = (p: P) => (
  <S {...p}>
    <path d="m5 9 7 7 7-7" />
  </S>
);

export const Check = (p: P) => (
  <S {...p}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </S>
);

export const Plus = (p: P) => (
  <S {...p}>
    <path d="M12 5v14M5 12h14" />
  </S>
);

export const Minus = (p: P) => (
  <S {...p}>
    <path d="M5 12h14" />
  </S>
);

export const Trash = (p: P) => (
  <S {...p}>
    <path d="M4 7h16M9.5 7V5.2A1.2 1.2 0 0 1 10.7 4h2.6a1.2 1.2 0 0 1 1.2 1.2V7" />
    <path d="M6.3 7l.9 12a1.8 1.8 0 0 0 1.8 1.7h6a1.8 1.8 0 0 0 1.8-1.7l.9-12" />
  </S>
);

export const Phone = (p: P) => (
  <S {...p}>
    <path d="M5.2 3.6h3.2l1.6 4-2 1.4a12 12 0 0 0 5 5l1.4-2 4 1.6v3.2a1.8 1.8 0 0 1-2 1.8C10.3 18.1 5.9 13.7 3.4 5.6a1.8 1.8 0 0 1 1.8-2Z" />
  </S>
);

export const Clock = (p: P) => (
  <S {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 1.8" />
  </S>
);

export const Pin = (p: P) => (
  <S {...p}>
    <path d="M12 21s6.5-5.6 6.5-10.2A6.5 6.5 0 0 0 5.5 10.8C5.5 15.4 12 21 12 21Z" />
    <circle cx="12" cy="10.6" r="2.4" />
  </S>
);

export const External = (p: P) => (
  <S {...p}>
    <path d="M14 4h6v6M20 4l-8.5 8.5" />
    <path d="M18 14.5V19a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 19V8a1.5 1.5 0 0 1 1.5-1.5H10" />
  </S>
);

export const Sparkle = (p: P) => (
  <S {...p}>
    <path d="M12 3.6 13.7 9l5.4 1.7-5.4 1.7L12 17.8l-1.7-5.4L4.9 10.7 10.3 9Z" />
    <path d="m18.6 16 .7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7Z" />
  </S>
);

export const Shield = (p: P) => (
  <S {...p}>
    <path d="M12 3 5 5.8v5.6c0 4.3 2.9 7.8 7 8.9 4.1-1.1 7-4.6 7-8.9V5.8L12 3Z" />
    <path d="m9 12 2.2 2.2L15.4 10" />
  </S>
);

export const Book = (p: P) => (
  <S {...p}>
    <path d="M5 4.6h9.5a3 3 0 0 1 3 3V20H8a3 3 0 0 0-3 3V4.6Z" />
    <path d="M5 4.6v14.8A2.6 2.6 0 0 1 7.6 17H19" />
  </S>
);

export const Truck = (p: P) => (
  <S {...p}>
    <path d="M3 6.5h10.5V16H3zM13.5 9.5H17l3 3V16h-6.5z" />
    <circle cx="7" cy="18" r="1.8" />
    <circle cx="17" cy="18" r="1.8" />
  </S>
);

export function Star({
  size = 16,
  className,
  style,
  filled = true,
}: P & { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      style={style}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m12 3.6 2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.8l5.9-.8Z" />
    </svg>
  );
}

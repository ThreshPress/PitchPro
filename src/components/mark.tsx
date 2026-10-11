export function Mark({ className = "size-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="8" className="fill-pitch" />
      <circle cx="16" cy="16" r="9.2" className="fill-on-pitch" />
      <path
        d="M16 10.85 20.9 14.41 19.03 20.17 12.97 20.17 11.1 14.41Z"
        fill="none"
        className="stroke-pitch"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
      <path
        d="M16 9.5V7.7M22.18 13.99l1.71-.55M19.82 21.26l1.06 1.45M12.18 21.26l-1.06 1.45M9.82 13.99 8.11 13.44"
        fill="none"
        className="stroke-pitch"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
    </svg>
  );
}

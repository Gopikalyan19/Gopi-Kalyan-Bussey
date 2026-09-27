export default function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`toast pointer-events-none fixed bottom-5 left-1/2 z-120 -translate-x-1/2 rounded-[9px] bg-ink px-4 py-3 font-display text-[12px] font-medium text-white shadow-lg ${visible ? "is-visible" : ""}`}
    >
      {message}
    </div>
  );
}

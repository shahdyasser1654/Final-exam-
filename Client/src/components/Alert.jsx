export default function Alert({ type, message }) {
  return (
    <div className={`alert ${type}`} role="alert" aria-live="polite">
      {message}
    </div>
  );
}

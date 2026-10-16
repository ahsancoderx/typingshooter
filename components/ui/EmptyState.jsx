export default function EmptyState({ title, children, action }) {
  return (
    <div className="panel empty">
      <h3>{title}</h3>
      {children ? <p className="muted">{children}</p> : null}
      {action}
    </div>
  );
}

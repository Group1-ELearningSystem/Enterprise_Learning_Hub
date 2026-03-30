export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="page-header card">
      <div>
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

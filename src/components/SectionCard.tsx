import type { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
};

export default function SectionCard({
  title,
  description,
  children,
  actions,
}: SectionCardProps) {
  return (
    <section className="card">
      <div className="card__header">
        <div>
          <h2>{title}</h2>
          {description ? <p className="muted">{description}</p> : null}
        </div>
        {actions ? <div className="card__actions">{actions}</div> : null}
      </div>

      <div className="card__body">{children}</div>
    </section>
  );
}
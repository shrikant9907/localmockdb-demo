import type { JsonValue } from "../lib/types";

type ResponseViewerProps = {
  title: string;
  value: JsonValue | null;
};

export default function ResponseViewer({ title, value }: ResponseViewerProps) {
  return (
    <div className="response-viewer">
      <div className="response-viewer__title">{title}</div>
      <pre>{JSON.stringify(value, null, 2)}</pre>
    </div>
  );
}
// SceneLabel — reusable section number + label for all Creators scenes
interface SceneLabelProps {
  number: string;
  label: string;
}

export default function SceneLabel({ number, label }: SceneLabelProps) {
  return (
    <div className="c-scene-label-wrap" aria-hidden="true">
      <span className="c-scene-num">{number}</span>
      <span className="c-scene-title">{label}</span>
    </div>
  );
}

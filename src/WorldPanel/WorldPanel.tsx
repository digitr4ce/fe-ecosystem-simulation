import { useWorldStore } from "@/stores/useWorldStore";


export function WorldPanel() {
  const entities = useWorldStore((state) => state.entities)

  return (
    <div className="grid w-full max-w-sm items-center gap-3">
        {Object.entries(entities).map((entity) => <p>{entity[1].name}</p>)}
    </div>
  );
}

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useWorldStore } from "@/stores/useWorldStore";
import { Toggle } from "@/components/ui/toggle";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

export function EntitiesPanel() {
  const activeSystems = useWorldStore((state) => state.activeSystems);
  const addEntity = useWorldStore((state) => state.addEntity);

  const [name, setName] = useState("");

  const handleAddEntity = () => {
    if (!name.trim()) {
      alert("Please enter an entity name.");
      return;
    }

    const newEntity = {
      id: crypto.randomUUID(),
      name: name,
      components: {},
    };

    addEntity(newEntity);

    setName("");
  };

  return (
    <div className="flex flex-col items-start p-2 border-b gap-4">
      <Label htmlFor="entity-name">Entity Name</Label>
      <Input
        id="entity-name"
        placeholder="Entity Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Collapsible className="flex flex-col gap-4 w-full">
        <CollapsibleTrigger asChild>
          <Toggle variant="outline" aria-label="System selector for entities">
            Select systems for entity
          </Toggle>
        </CollapsibleTrigger>
        <CollapsibleContent className="flex gap-2">
          {activeSystems.map((system) => (
            <Toggle key={system}>{system}</Toggle>
          ))}
        </CollapsibleContent>
      </Collapsible>
      <Button onClick={handleAddEntity}>Add Entity</Button>
    </div>
  );
}
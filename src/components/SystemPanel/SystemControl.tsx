import { useWorldStore } from '../../stores/useWorldStore';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SystemControlProps {
    systemName: string
}

export function SystemControl({ systemName }: SystemControlProps) {
  const isActive = useWorldStore((state) => state.activeSystems.includes(systemName));
  const toggle = useWorldStore((state) => state.toggleSystem);

  return (
    <div className="flex items-center space-x-2 p-2 border-b">
      <Switch
        id={`plugin-${systemName}`}
        checked={isActive}
        onCheckedChange={() => toggle(systemName)}
      />
      <Label htmlFor={`plugin-${systemName}`} className="capitalize">
        {systemName}
      </Label>
    </div>
  );
}

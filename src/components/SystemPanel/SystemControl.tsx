import { useWorldStore } from '../../stores/useWorldStore';
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import type { ComponentParameters, ComponentSchema } from '@/types';
import { useMemo } from 'react';
import { ChevronDown } from 'lucide-react';

function ComponentDetails({ details }: { details: Record<string, ComponentParameters[]> }) {
  if (Object.keys(details).length === 0) {
    return <p className="text-sm text-muted-foreground">No components required.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      <h4 className="font-semibold">Required Components</h4>
      <ul className="list-disc list-inside space-y-2 text-sm">
        {Object.entries(details).map(([componentName, parameters]) => (
          <li key={componentName}>
            <span className="font-medium">{componentName}</span>
            {parameters.length > 0 && (
              <ul className="list-disc list-inside pl-4 mt-1">
                {parameters.map(p => (
                  <li key={p.name} className="text-muted-foreground">
                    {p.name}: <span className="font-mono text-xs">{p.type}</span>
                    {p.default !== null && ` (default: ${String(p.default)})`}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}


interface SystemControlProps {
  systemName: string;
  systemDocstring: string;
  componentRequirements: string[];
  componentSchemas: ComponentSchema;
  isLastItem: boolean;
}

export function SystemControl({
  systemName,
  systemDocstring,
  componentRequirements,
  componentSchemas,
  isLastItem
}: SystemControlProps) {
  const isActive = useWorldStore((state) => state.activeSystems.includes(systemName));
  const toggleSystem = useWorldStore((state) => state.toggleSystem);

  const requiredComponentDetails = useMemo<Record<string, ComponentParameters[]>>(() => {
    return componentRequirements.reduce((acc, componentName) => {
      if (componentSchemas[componentName]) {
        acc[componentName] = componentSchemas[componentName].parameters;
      }
      return acc;
    }, {} as Record<string, ComponentParameters[]>);
  }, [componentRequirements, componentSchemas]);

  const switchId = `plugin-${systemName}`;

  return (
    <Collapsible className={`p-3 ${!isLastItem ? 'border-b' : ''}`}>
      <div className="flex items-center justify-between">
        <CollapsibleTrigger asChild className='cursor-pointer'>
          <button className="flex items-center gap-2 text-left group"> {/* Added group for icon rotation */}
              {systemName}
            <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
          </button>
        </CollapsibleTrigger>

        <Switch
          id={switchId}
          checked={isActive}
          onCheckedChange={() => toggleSystem(systemName)}
          className='cursor-pointer'
        />
      </div>

      <CollapsibleContent className="space-y-4 pt-4 text-sm">
        <p className="text-muted-foreground">{systemDocstring || "No documentation available."}</p>
        <ComponentDetails details={requiredComponentDetails} />
      </CollapsibleContent>
    </Collapsible>
  );
}

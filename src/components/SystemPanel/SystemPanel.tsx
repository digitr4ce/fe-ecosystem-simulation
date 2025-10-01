import { useWorldStore } from '@/stores/useWorldStore';
import { SystemControl } from './SystemControl';

export function SystemPanel() {
  const requirements = useWorldStore((state) => state.requirementsFile);
  const systemNames = Object.keys(requirements.system_requirements);

  return (
    <div className="flex flex-col border rounded-md">
      {systemNames.map((name, index) => (
        <SystemControl
          key={name}
          systemName={name}
          componentRequirements={requirements.system_requirements[name]}
          systemDocstring={requirements.system_docs[name] || ''}
          componentSchemas={requirements.component_schemas}
          isLastItem={index === systemNames.length - 1}
        />
      ))}
    </div>
  );
}
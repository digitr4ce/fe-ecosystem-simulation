import requirementData from '@/static/requirements.json';
import { SystemControl } from './SystemControl';
import type { SystemComponentMapping } from '@/types';

export function SystemPanel() {
  const requirements = requirementData as SystemComponentMapping;
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
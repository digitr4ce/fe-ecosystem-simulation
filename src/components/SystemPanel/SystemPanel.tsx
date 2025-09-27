
import requirementData from '@/static/requirements.json'
import { SystemControl } from './SystemControl';

interface SystemComponentMapping {
    [key: string]: string[];
}

export function SystemPanel() {
  const requirements = requirementData as SystemComponentMapping;
  const requirementsKeys = Object.keys(requirements)

  return (
    <div className="flex-col items-center space-x-2 p-2 border-b">
      {requirementsKeys.map((key) => <SystemControl systemName={key} />)}
    </div>
  );
}

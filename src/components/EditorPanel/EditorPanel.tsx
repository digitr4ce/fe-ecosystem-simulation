import { EntitiesPanel } from '@/components/EntitiesPanel/EntitiesPanel';
import { SystemPanel } from '../SystemPanel/SystemPanel';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../ui/resizable';
import { WorldPanel } from '@/components/WorldPanel/WorldPanel';

export function EditorPanel() {
  
  return (
    <ResizablePanelGroup direction='horizontal'>
      <ResizablePanel defaultSize={50}>
        <SystemPanel />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <EntitiesPanel />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <WorldPanel />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

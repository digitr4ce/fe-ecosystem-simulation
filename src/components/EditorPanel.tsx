import { SystemControl } from './SystemControl';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './ui/resizable';

// interface EditorPanelProps {
//     systemName: string
// }

export function EditorPanel() {

  return (
    <ResizablePanelGroup direction='horizontal'>
      <ResizablePanel defaultSize={50}>
        <SystemControl systemName='Test1' />
        <SystemControl systemName='Test2' />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <SystemControl systemName='Test1' />
        <SystemControl systemName='Test2' />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <SystemControl systemName='Test1' />
        <SystemControl systemName='Test2' />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

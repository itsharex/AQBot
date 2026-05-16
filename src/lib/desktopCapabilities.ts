import { invoke } from '@/lib/invoke';
import { writeStartupDiagnostic } from '@/lib/startupDiagnostics';
import type { DesktopCapability } from '@/types';

const DEVTOOLS_CONTEXT_MENU_CAPABILITY = 'devtools_context_menu';

export function hasDesktopCapability(
  capabilities: DesktopCapability[],
  key: string,
): boolean {
  return capabilities.some((capability) => (
    capability.key === key && capability.supported === true
  ));
}

export async function loadDevtoolsContextMenuEnabled(
  isDevBuild = import.meta.env.DEV,
): Promise<boolean> {
  if (isDevBuild) return true;

  try {
    const capabilities = await invoke<DesktopCapability[]>('get_desktop_capabilities');
    return hasDesktopCapability(capabilities, DEVTOOLS_CONTEXT_MENU_CAPABILITY);
  } catch (error) {
    await writeStartupDiagnostic(
      'warn',
      `failed to load desktop capabilities for devtools context menu: ${String(error)}`,
    );
    return false;
  }
}

export async function openDevtoolsWithDiagnostics(): Promise<void> {
  try {
    await invoke('open_devtools');
    await writeStartupDiagnostic('info', 'open_devtools command completed');
  } catch (error) {
    await writeStartupDiagnostic(
      'error',
      `open_devtools command failed: ${String(error)}`,
    );
  }
}

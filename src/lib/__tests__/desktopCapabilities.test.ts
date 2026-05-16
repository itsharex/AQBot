import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  hasDesktopCapability,
  loadDevtoolsContextMenuEnabled,
  openDevtoolsWithDiagnostics,
} from '@/lib/desktopCapabilities';

const mocks = vi.hoisted(() => ({
  invoke: vi.fn(),
  writeStartupDiagnostic: vi.fn(),
}));

vi.mock('@/lib/invoke', () => ({
  invoke: mocks.invoke,
}));

vi.mock('@/lib/startupDiagnostics', () => ({
  writeStartupDiagnostic: mocks.writeStartupDiagnostic,
}));

describe('desktopCapabilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.writeStartupDiagnostic.mockResolvedValue(undefined);
  });

  it('detects supported capabilities by key', () => {
    expect(hasDesktopCapability([
      { key: 'notification', supported: true },
      { key: 'devtools_context_menu', supported: true },
    ], 'devtools_context_menu')).toBe(true);

    expect(hasDesktopCapability([
      { key: 'devtools_context_menu', supported: false },
    ], 'devtools_context_menu')).toBe(false);
  });

  it('keeps devtools context menu hidden in release mode without capability', async () => {
    mocks.invoke.mockResolvedValue([
      { key: 'devtools_context_menu', supported: false },
    ]);

    await expect(loadDevtoolsContextMenuEnabled(false)).resolves.toBe(false);
  });

  it('enables devtools context menu in release mode when capability is present', async () => {
    mocks.invoke.mockResolvedValue([
      { key: 'devtools_context_menu', supported: true },
    ]);

    await expect(loadDevtoolsContextMenuEnabled(false)).resolves.toBe(true);
  });

  it('logs open_devtools failures', async () => {
    mocks.invoke.mockRejectedValue(new Error('permission denied'));

    await openDevtoolsWithDiagnostics();

    expect(mocks.writeStartupDiagnostic).toHaveBeenCalledWith(
      'error',
      expect.stringContaining('permission denied'),
    );
  });
});

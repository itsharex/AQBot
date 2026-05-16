import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GlobalCopyMenu } from '../GlobalCopyMenu';

const mocks = vi.hoisted(() => ({
  loadDevtoolsContextMenuEnabled: vi.fn(),
  openDevtoolsWithDiagnostics: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const labels: Record<string, string> = {
        'common.openDevtools': 'Open DevTools',
        'common.copy': 'Copy',
        'common.copySuccess': 'Copied',
      };
      return labels[key] ?? key;
    },
  }),
}));

vi.mock('antd', () => ({
  message: {
    success: vi.fn(),
  },
  theme: {
    useToken: () => ({
      token: {
        colorBgElevated: '#ffffff',
        colorBorderSecondary: '#eeeeee',
        colorText: '#111111',
        colorTextDisabled: '#999999',
        boxShadowSecondary: 'none',
      },
    }),
  },
}));

vi.mock('@/stores', () => ({
  useConversationStore: (selector: (state: { activeConversationId: string | null }) => unknown) => (
    selector({ activeConversationId: null })
  ),
}));

vi.mock('@/lib/desktopCapabilities', () => ({
  loadDevtoolsContextMenuEnabled: mocks.loadDevtoolsContextMenuEnabled,
  openDevtoolsWithDiagnostics: mocks.openDevtoolsWithDiagnostics,
}));

describe('GlobalCopyMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.loadDevtoolsContextMenuEnabled.mockResolvedValue(false);
  });

  it('does not show devtools in release mode when diagnostic capability is disabled', async () => {
    render(<GlobalCopyMenu />);

    await waitFor(() => expect(mocks.loadDevtoolsContextMenuEnabled).toHaveBeenCalled());
    fireEvent.contextMenu(document.body, { clientX: 20, clientY: 20 });

    expect(screen.queryByText('Open DevTools')).not.toBeInTheDocument();
  });

  it('shows devtools in release mode when diagnostic capability is enabled', async () => {
    mocks.loadDevtoolsContextMenuEnabled.mockResolvedValue(true);
    render(<GlobalCopyMenu />);

    await waitFor(() => expect(mocks.loadDevtoolsContextMenuEnabled).toHaveBeenCalled());
    fireEvent.contextMenu(document.body, { clientX: 20, clientY: 20 });

    expect(await screen.findByText('Open DevTools')).toBeInTheDocument();
  });

  it('opens devtools through diagnostic wrapper', async () => {
    mocks.loadDevtoolsContextMenuEnabled.mockResolvedValue(true);
    render(<GlobalCopyMenu />);

    await waitFor(() => expect(mocks.loadDevtoolsContextMenuEnabled).toHaveBeenCalled());
    fireEvent.contextMenu(document.body, { clientX: 20, clientY: 20 });
    fireEvent.click(await screen.findByText('Open DevTools'));

    expect(mocks.openDevtoolsWithDiagnostics).toHaveBeenCalled();
  });
});

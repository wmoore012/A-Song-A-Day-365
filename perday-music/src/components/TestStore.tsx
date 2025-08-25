import { useAppStore } from "../store/store";
import { FlowState } from "../types";

export default function TestStore() {
  const { session, dispatch, settings, _hydrated } = useAppStore();

  if (!_hydrated) {
    return <div className="text-white">Loading store...</div>;
  }

  return (
    <>
      <div className="fixed top-4 left-4 z-50 bg-black/80 p-4 rounded-lg text-white text-sm">
        <div>State: {session.state}</div>
        <div>Ready: {session.readyPressed ? 'Yes' : 'No'}</div>
        <div>Sound: {settings.soundEnabled ? 'On' : 'Off'}</div>
        <div>Hydrated: {_hydrated ? 'Yes' : 'No'}</div>
        <button
          onClick={() => dispatch({ type: 'READY' })}
          className="mt-2 px-2 py-1 bg-blue-600 rounded text-xs"
          disabled={session.state !== FlowState.PRE_START}
        >
          Ready
        </button>
        <button
          onClick={() => dispatch({ type: 'TIMER_ZERO' })}
          className="mt-2 ml-2 px-2 py-1 bg-green-600 rounded text-xs"
          disabled={session.state !== FlowState.PRE_START}
        >
          Timer Zero
        </button>
      </div>

      {/* Page visibility badge for tests */}
      {typeof document !== 'undefined' && document.hidden && (
        <div
          data-testid="page-visibility-badge"
          className="fixed top-4 right-4 z-50 bg-red-600/80 p-2 rounded-lg text-white text-sm"
        >
          Page Hidden
        </div>
      )}
    </>
  );
}

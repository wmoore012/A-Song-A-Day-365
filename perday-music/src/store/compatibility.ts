// Compatibility shim - re-export useAppStore as useSessionStore
export { useAppStore as useSessionStore } from "../store/store";

// Also export the types for backward compatibility
export type { FlowState, Session, Action } from "../types";

// Re-export from each domain
export * from './home';

// Aggregate all NGXS states for store configuration
import { HomeState } from './home';

export const APP_STATES = [HomeState];

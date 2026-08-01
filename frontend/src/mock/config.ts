// Default to database/backend operations, unless VITE_USE_MOCK_DATA is explicitly 'true'
export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

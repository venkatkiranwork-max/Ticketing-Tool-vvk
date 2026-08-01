import { mockUsers, saveUsersToStorage, INITIAL_MOCK_USERS } from './users';

export function runLocalStorageMigrations() {
  try {
    const data = localStorage.getItem('mock_users_db');
    if (data) {
      const users = JSON.parse(data);
      let migrated = false;
      
      const updatedUsers = users.map((u: any) => {
        // Migrate Admin or admin roles to Project Manager
        if (u.role === 'Admin' || u.role === 'admin') {
          u.role = 'Project Manager';
          migrated = true;
        }
        return u;
      });

      // Synchronize missing default mock users (e.g. newly added members)
      INITIAL_MOCK_USERS.forEach((defaultUser) => {
        const exists = updatedUsers.some(
          (u: any) => u.id === defaultUser.id || u.email.toLowerCase() === defaultUser.email.toLowerCase()
        );
        if (!exists) {
          updatedUsers.push(defaultUser);
          migrated = true;
        }
      });

      if (migrated) {
        saveUsersToStorage(updatedUsers);
        // Refresh local mockUsers in-memory array reference
        mockUsers.length = 0;
        mockUsers.push(...updatedUsers);
        console.log('✅ LocalStorage Migration: Migrated and synchronized mock users database.');
      }
    } else {
      saveUsersToStorage(INITIAL_MOCK_USERS);
      mockUsers.length = 0;
      mockUsers.push(...INITIAL_MOCK_USERS);
      console.log('✅ LocalStorage Migration: Populated initial mock users database.');
    }
  } catch (e) {
    console.error('Failed to run localStorage migrations:', e);
  }
}

// Automatically run on import
runLocalStorageMigrations();

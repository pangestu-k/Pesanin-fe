// Local Storage Helper Functions

export const setItem = <T>(key: string, value: T): void => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`Error setting item ${key} to localStorage:`, error);
  }
};

export const getItem = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return null;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error getting item ${key} from localStorage:`, error);
    return null;
  }
};

export const removeItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing item ${key} from localStorage:`, error);
  }
};

export const clearStorage = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

// Session Storage Helper Functions
export const setSessionItem = <T>(key: string, value: T): void => {
  try {
    const serializedValue = JSON.stringify(value);
    sessionStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`Error setting item ${key} to sessionStorage:`, error);
  }
};

export const getSessionItem = <T>(key: string): T | null => {
  try {
    const item = sessionStorage.getItem(key);
    if (item === null) return null;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error getting item ${key} from sessionStorage:`, error);
    return null;
  }
};

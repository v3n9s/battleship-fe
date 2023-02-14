import { UserData } from '../types';

export const saveUserData = (data: UserData | null) => {
  localStorage.setItem('user-data', JSON.stringify(data));
};

export const getUserData = () => {
  try {
    return JSON.parse(
      localStorage.getItem('user-data') || 'null',
    ) as UserData | null;
  } catch {
    return null;
  }
};

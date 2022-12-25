import { UserData } from '../types';

export const saveUserData = (data: UserData) => {
  localStorage.setItem('user-data', JSON.stringify(data));
};

export const getUserData = () => {
  const userData = localStorage.getItem('user-data');
  return userData ? (JSON.parse(userData) as UserData) : null;
};

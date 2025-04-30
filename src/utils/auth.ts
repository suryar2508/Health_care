export interface User {
  email: string;
  password: string;
  userType: 'admin' | 'doctor' | 'patient' | 'pharmacist';
  name: string;
}

export const defaultUsers: User[] = [
  {
    email: 'admin@smartvital.com',
    password: 'admin123',
    userType: 'admin',
    name: 'Admin User'
  },
  {
    email: 'doctor@smartvital.com',
    password: 'doctor123',
    userType: 'doctor',
    name: 'Dr. John Smith'
  },
  {
    email: 'patient@smartvital.com',
    password: 'patient123',
    userType: 'patient',
    name: 'John Doe'
  },
  {
    email: 'pharmacist@smartvital.com',
    password: 'pharma123',
    userType: 'pharmacist',
    name: 'Sarah Wilson'
  }
];

export const loginUser = (email: string, password: string): User | null => {
  const user = defaultUsers.find(
    (u) => u.email === email && u.password === password
  );
  return user || null;
};

export const getUserByEmail = (email: string): User | null => {
  const user = defaultUsers.find((u) => u.email === email);
  return user || null;
}; 
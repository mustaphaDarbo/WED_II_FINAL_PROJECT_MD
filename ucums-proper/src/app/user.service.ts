export interface User {
  id: string;
  fullname: string;
  email: string;
  password: string;
  role: 'admin' | 'student' | 'lecturer';
  createdAt: Date;
}

export class UserService {
  private readonly STORAGE_KEY = 'ucums_users';
  
  constructor() {
    this.initializeDefaultAdmin();
  }
  
  private initializeDefaultAdmin() {
    const users = this.getUsers();
    const adminExists = users.some(user => user.email === 'admin@ucums.edu');
    
    if (!adminExists) {
      const defaultAdmin: User = {
        id: this.generateId(),
        fullname: 'System Administrator',
        email: 'admin@ucums.edu',
        password: 'admin123',
        role: 'admin',
        createdAt: new Date()
      };
      
      users.push(defaultAdmin);
      this.saveUsers(users);
    }
  }
  
  getUsers(): User[] {
    const usersJson = localStorage.getItem(this.STORAGE_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  }
  
  saveUsers(users: User[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
  }
  
  createUser(fullname: string, email: string, password: string, role: 'student' | 'lecturer'): User {
    const users = this.getUsers();
    
    // Check if email already exists
    if (users.some(user => user.email === email)) {
      throw new Error('Email already exists');
    }
    
    const newUser: User = {
      id: this.generateId(),
      fullname,
      email,
      password,
      role,
      createdAt: new Date()
    };
    
    users.push(newUser);
    this.saveUsers(users);
    
    return newUser;
  }
  
  authenticateUser(email: string, password: string): User | null {
    const users = this.getUsers();
    return users.find(user => user.email === email && user.password === password) || null;
  }
  
  deleteUser(userId: string): boolean {
    const users = this.getUsers();
    const filteredUsers = users.filter(user => user.id !== userId);
    
    if (filteredUsers.length < users.length) {
      this.saveUsers(filteredUsers);
      return true;
    }
    
    return false;
  }
  
  updateUser(userId: string, updates: Partial<User>): boolean {
    const users = this.getUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      this.saveUsers(users);
      return true;
    }
    
    return false;
  }
  
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

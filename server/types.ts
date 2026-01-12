declare global {
  namespace Express {
    interface User {
      id: string;
      username: string;
      password: string;
      userType: string;
      profileData?: unknown;
    }
  }
}

export {};

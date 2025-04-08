interface UserData {
  id: string;
  email: string;
  emailVerified: boolean;
  name?: string | null;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
  role?: string | null;
}

interface ServerResponse<T> {
  data?: T | null;
  error?: string | null;
}

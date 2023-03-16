interface UserData {
  rows: {
    id: number;
    email: string;
    password: string;
    tokens: number;
    lastTokenRefresh: string;
  }[]
}

export interface AccountFields {
  email: string;
  password: string;
}

export default UserData;
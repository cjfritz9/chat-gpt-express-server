interface UserData {
  rows: {
    id: number;
    email: string;
    password: string;
    tokens: number;
    last_token_refresh: string;
  }[]
}

export interface AccountFields {
  email: string;
  password: string;
}

export default UserData;
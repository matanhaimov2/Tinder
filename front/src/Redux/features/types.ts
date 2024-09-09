export interface UserData {
    id: number;
    user_id: number;
    first_name: string;
    isFirstLogin: boolean;
    gender: string;
    age: number;
    interested_in: string;
    location: string;
    images: string[];
    bio: string;
    distance: number;
    ageRange: number[];
}

export interface UpdatedUserData {
    id: number;
    user_id: number;
    first_name: string;
    isFirstLogin: boolean;
    gender: string;
    age: number;
    interested_in: string;
    location: string;
    images: string[];
    bio: string;
    distance: number;
    ageRange: number[];
}

export interface AuthState {
    accessToken: string;
    userData: UserData | null;
    updatedUserData: UpdatedUserData | null;
    isLoggedIn: boolean;
    csrfToken: string | null;
}
  
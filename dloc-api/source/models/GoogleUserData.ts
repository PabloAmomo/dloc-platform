export interface GoogleUserData {
  /* Standard for all providers */
  userId: string;
  email: string;
  /* Google specific */
  id: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export class RegisterDto {
  username: string;
  email: string;
  password: string;
  role: 'CUSTOMER'| 'AGENT';
  
  profileImage?: string;
}

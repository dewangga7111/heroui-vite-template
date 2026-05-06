export type UserItem = {
  user_id: number;
  name: string;
  username: string;
  user_code: string;
  role_name: string;
  nama_kota: string | null;
  supervisor_name: string | null;
};

export const usersList: UserItem[] = [
  { user_id: 1, name: "John Doe", username: "johndoe", user_code: "USR001", role_name: "Superadmin", nama_kota: "Jakarta", supervisor_name: null },
  { user_id: 2, name: "Jane Smith", username: "janesmith", user_code: "USR002", role_name: "Supervisor", nama_kota: "Bandung", supervisor_name: "John Doe" },
  { user_id: 3, name: "Bob Johnson", username: "bobjohnson", user_code: "USR003", role_name: "Auditor", nama_kota: "Surabaya", supervisor_name: "John Doe" },
  { user_id: 4, name: "Alice Brown", username: "alicebrown", user_code: "USR004", role_name: "Surveyor", nama_kota: "Medan", supervisor_name: "Jane Smith" },
  { user_id: 5, name: "Charlie Davis", username: "charliedavis", user_code: "USR005", role_name: "Surveyor", nama_kota: "Makassar", supervisor_name: "Jane Smith" },
  { user_id: 6, name: "Diana Wilson", username: "dianawilson", user_code: "USR006", role_name: "Surveyor", nama_kota: "Semarang", supervisor_name: "Jane Smith" },
  { user_id: 7, name: "Eve Martinez", username: "evemartinez", user_code: "USR007", role_name: "Auditor", nama_kota: "Yogyakarta", supervisor_name: "John Doe" },
  { user_id: 8, name: "Frank Garcia", username: "frankgarcia", user_code: "USR008", role_name: "Surveyor", nama_kota: "Palembang", supervisor_name: "Bob Johnson" },
];

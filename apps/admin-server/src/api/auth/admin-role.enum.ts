export enum AdminRole {
  SuperAdmin = 'SUPER_ADMIN',
  Admin = 'ADMIN',
  MagazineAdmin = 'MAGAZINE_ADMIN',
}

export const AdminRoleOrder: Record<AdminRole, number> = {
  [AdminRole.SuperAdmin]: 100,
  [AdminRole.Admin]: 60,
  [AdminRole.MagazineAdmin]: 20,
};

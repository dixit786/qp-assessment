import { Document, Model } from 'mongoose';

export interface IRole {
  roleName: string;
  apis: string[];
  containers: IContainer;
}

export interface IContainer {
  name: string;
  container: string;
  isSidebar: boolean;
  noParent: boolean;
}

export interface RoleDocument extends IRole, Document {}

export interface RoleModel extends Model<RoleDocument> {
  createRole(roleDetails: IRole): Promise<RoleDocument>;
  getRoles(): Promise<RoleDocument>;
  getRoleByName(name: string): Promise<RoleDocument>;
  deleteRoleById(id: string): Promise<RoleDocument>;
}

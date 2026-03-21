import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  rolename: string;

  @IsOptional()
  @IsBoolean()
  isactive?: boolean;

  @IsOptional()
  @IsString()
  status?: string;
}

export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  rolename?: string;

  @IsOptional()
  @IsBoolean()
  isactive?: boolean;

  @IsOptional()
  @IsString()
  status?: string;
}
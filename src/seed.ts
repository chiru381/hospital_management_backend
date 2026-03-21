import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RolesService } from './roles/roles.service';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const rolesService = app.get(RolesService);

  // Create default roles
  await rolesService.create({ rolename: 'admin', isactive: true, status: 'active' });
  await rolesService.create({ rolename: 'doctor', isactive: true, status: 'active' });
  await rolesService.create({ rolename: 'nurse', isactive: true, status: 'active' });
  await rolesService.create({ rolename: 'patient', isactive: true, status: 'active' });

  console.log('Roles seeded');
  await app.close();
}

seed();
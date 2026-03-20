import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PatientsModule } from './patients/patients.module';
import { AppModuleModule } from './modules/module.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'chiru123',
      database: 'hospital_db',
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),
    PatientsModule,
    AppModuleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ModuleController } from "./module.controller";
import { ModuleService } from "./module.service";
import {
  ModuleEntity,
  SubModuleEntity,
  FormEntity,
} from "./module.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ModuleEntity,
      SubModuleEntity,
      FormEntity,
    ]),
  ],
  controllers: [ModuleController],
  providers: [ModuleService],
})
export class AppModuleModule {}
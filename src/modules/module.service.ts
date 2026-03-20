import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  ModuleEntity,
  SubModuleEntity,
  FormEntity,
} from "./module.entity";
import { CreateModuleDto } from "./dto/create-module.dto";

@Injectable()
export class ModuleService {
  constructor(
    @InjectRepository(ModuleEntity)
    private moduleRepo: Repository<ModuleEntity>,

    @InjectRepository(SubModuleEntity)
    private subModuleRepo: Repository<SubModuleEntity>,

    @InjectRepository(FormEntity)
    private formRepo: Repository<FormEntity>
  ) {}

  /* 🔥 CREATE FULL STRUCTURE */
  async create(data: CreateModuleDto) {
    const module = this.moduleRepo.create({ name: data.name });
    const savedModule = await this.moduleRepo.save(module);

    // Save module-level forms
    if (data.forms?.length) {
      const forms = data.forms.map((f) =>
        this.formRepo.create({
          ...f,
          module: savedModule,
        })
      );
      await this.formRepo.save(forms);
    }

    // Save submodules + forms
    if (data.submodules?.length) {
      for (const sub of data.submodules) {
        const subModule = this.subModuleRepo.create({
          name: sub.name,
          module: savedModule,
        });

        const savedSub = await this.subModuleRepo.save(subModule);

        if (sub.forms?.length) {
          const forms = sub.forms.map((f) =>
            this.formRepo.create({
              ...f,
              module: savedModule,
              submodule: savedSub,
            })
          );
          await this.formRepo.save(forms);
        }
      }
    }

    return { message: "Module created successfully" };
  }

  /* 🔥 GET FULL TREE */
  async findAll() {
    return this.moduleRepo.find({
      relations: ["forms", "submodules", "submodules.forms"],
      order: { name: "ASC" },
    });
  }

  /* 🔥 DELETE MODULE */
  async remove(id: number) {
    await this.moduleRepo.delete(id);
    return { message: "Deleted successfully" };
  }
}
import { Controller, Get, Post, Body, Delete, Param } from "@nestjs/common";
import { ModuleService } from "./module.service";
import { CreateModuleDto } from "./dto/create-module.dto";

@Controller("modules")
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  /* CREATE */
  @Post()
  create(@Body() body: CreateModuleDto) {
    return this.moduleService.create(body);
  }

  /* GET ALL */
  @Get()
  findAll() {
    return this.moduleService.findAll();
  }

  /* DELETE */
  @Delete(":id")
  remove(@Param("id") id: number) {
    return this.moduleService.remove(id);
  }
}
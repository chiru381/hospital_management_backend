export class CreateFormDto {
  name: string;
  path: string;
}

export class CreateSubModuleDto {
  name: string;
  forms?: CreateFormDto[];
}

export class CreateModuleDto {
  name: string;
  forms?: CreateFormDto[];
  submodules?: CreateSubModuleDto[];
}
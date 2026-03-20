import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

export abstract class BaseEntity {
  @Column({ default: true })
  isActive: boolean;

  @Column({ default: "ACTIVE" })
  status: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}

/* ================= MODULE ================= */
@Entity("modules")
export class ModuleEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => SubModuleEntity, (sub) => sub.module, {
    cascade: true,
  })
  submodules: SubModuleEntity[];

  @OneToMany(() => FormEntity, (form) => form.module, {
    cascade: true,
  })
  forms: FormEntity[];
}

/* ================= SUBMODULE ================= */
@Entity("submodules")
export class SubModuleEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;


  @Column()
  name: string;

  @ManyToOne(() => ModuleEntity, (module) => module.submodules, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "module_id" })
  module: ModuleEntity;

  @OneToMany(() => FormEntity, (form) => form.submodule, {
    cascade: true,
  })
  forms: FormEntity[];
}

/* ================= FORM ================= */
@Entity("forms")
export class FormEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  path: string;

  @ManyToOne(() => ModuleEntity, (module) => module.forms, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "module_id" })
  module: ModuleEntity;

  @ManyToOne(() => SubModuleEntity, (sub) => sub.forms, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "submodule_id" })
  submodule: SubModuleEntity;
}
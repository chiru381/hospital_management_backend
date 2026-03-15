import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './patients.entity';

@Injectable()
export class PatientsService {

  constructor(
    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,
  ) {}

  create(data: Partial<Patient>) {
    const patient = this.patientRepo.create(data);
    return this.patientRepo.save(patient);
  }

  findAll() {
    return this.patientRepo.find();
  }
}
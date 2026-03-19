import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Patient } from './patients.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
  ) {}

  async create(createDto: CreatePatientDto): Promise<Patient> {
    const patient = this.patientRepo.create(createDto);
    return await this.patientRepo.save(patient);
  }

  async findAll(query: {
    page?: string;
    limit?: string;
    search?: string;
  }): Promise<{
    data: Patient[];
    total: number;
    page: number;
    lastPage: number;
  }> {
    const page = parseInt(query.page ?? '1', 10);
    const limit = parseInt(query.limit ?? '10', 10);
    const search = query.search ?? '';

    const [data, total] = await this.patientRepo.findAndCount({
      where: [
        { firstName: ILike(`%${search}%`) },
        { lastName: ILike(`%${search}%`) },
        { email: ILike(`%${search}%`) },
      ],
      take: limit,
      skip: (page - 1) * limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Patient> {
    const patient = await this.patientRepo.findOne({
      where: { id },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    return patient;
  }

  async update(id: number, updateDto: UpdatePatientDto): Promise<Patient> {
    const patient = await this.findOne(id);

    Object.assign(patient, updateDto);

    return await this.patientRepo.save(patient);
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.findOne(id);

    await this.patientRepo.delete(id);

    return { message: 'Patient deleted successfully' };
  }
}
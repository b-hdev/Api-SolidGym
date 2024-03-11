import { Gym } from '@prisma/client';
import { GymsRepository } from '@/repositories/gyms-repository';

interface SearchGymsUseCaseSchema {
  query: string;
  page: number;
}

interface SearchGymsUseCaseResponse {
  gym: Gym;
}

export class SearchGymsUseCase {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    query,
    page,
  }: SearchGymsUseCaseSchema): Promise<SearchGymsUseCaseResponse> {
    const gym = await this.gymsRepository.create({
      title,
      description,
      phone,
      latitude,
      longitude,
    });

    return {
      gym,
    };
  }
}

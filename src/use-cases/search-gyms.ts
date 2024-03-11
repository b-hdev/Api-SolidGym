import { Gym } from '@prisma/client';
import { GymsRepository } from '@/repositories/gyms-repository';

interface SearchGymsUseCaseSchema {
  query: string;
  page: number;
}

interface SearchGymsUseCaseResponse {
  gyms: Gym[];
}

export class SearchGymsUseCase {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    query,
    page,
  }: SearchGymsUseCaseSchema): Promise<SearchGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page);

    return {
      gyms,
    };
  }
}

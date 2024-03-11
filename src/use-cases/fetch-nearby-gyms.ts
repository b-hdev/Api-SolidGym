import { Gym } from '@prisma/client';
import { GymsRepository } from '@/repositories/gyms-repository';

interface FetchNearbyGymsUseCaseSchema {
  userLatitude: number;
  userLongitude: number;
}

interface FetchNearbyGymsUseCaseResponse {
  gyms: Gym[];
}

export class FetchNearbyGymsUseCase {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: FetchNearbyGymsUseCaseSchema): Promise<FetchNearbyGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    });

    return {
      gyms,
    };
  }
}

import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { CheckInUseCase } from './check-in';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';

let checkInsRepository: InMemoryCheckInsRepository;
let gymRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe('Check-in Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymRepository);

    gymRepository.items.push({
      id: 'gym-01',
      title: 'Javascript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(0),
      longitude: new Decimal(0),
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be able to check in ', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 17.8003316,
      userLongitude: -50.9393447,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in twice the same day ', async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 12, 0, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 17.8003316,
      userLongitude: -50.9393447,
    });

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: 17.8003316,
        userLongitude: -50.9393447,
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  it('should be able to check in twice but in different days ', async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 12, 0, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 17.8003316,
      userLongitude: -50.9393447,
    });

    vi.setSystemTime(new Date(2024, 0, 21, 12, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: 17.8003316,
      userLongitude: -50.9393447,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});

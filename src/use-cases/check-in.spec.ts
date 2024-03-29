import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { CheckInUseCase } from './check-in';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository';
import { Decimal } from '@prisma/client/runtime/library';
import { MaxNumberCheckInsError } from './errors/max-number-of-check-ins-error';
import { MaxDistanceError } from './errors/max-distance-error';

let checkInsRepository: InMemoryCheckInsRepository;
let gymRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymRepository);

    await gymRepository.create({
      id: 'gym-01',
      title: 'Javascript Gym',
      description: '',
      phone: '',
      latitude: -16.6794501,
      longitude: -49.3805473,
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
      userLatitude: -16.6794501,
      userLongitude: -49.3805473,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it('should not be able to check in twice the same day ', async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 12, 0, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -16.6794501,
      userLongitude: -49.3805473,
    });

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -16.6794501,
        userLongitude: -49.3805473,
      }),
    ).rejects.toBeInstanceOf(MaxNumberCheckInsError); // caso o user faça checkin mais longe da academia 100m
  });

  it('should be able to check in twice but in different days ', async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 12, 0, 0));

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -16.6794501,
      userLongitude: -49.3805473,
    });

    vi.setSystemTime(new Date(2024, 0, 21, 12, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -16.6794501,
      userLongitude: -49.3805473,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
  it('should not be able to check in on distant gym ', async () => {
    gymRepository.items.push({
      id: 'gym-02',
      title: 'Javascript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-16.6792857),
      longitude: new Decimal(-49.2585819),
    });

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -16.6792857,
        userLongitude: -49.3805473,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});

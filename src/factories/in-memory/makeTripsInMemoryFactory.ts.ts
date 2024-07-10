import { InMemoryParticipantRepository } from '@/repositories/in-memory/InMemoryParticipantRepository.js';
import { InMemoryTripRepository } from '@/repositories/in-memory/InMemoryTripRepository.js';

const createTripDTO = {
  destination: 'São Paulo',
  startsAt: new Date(2024, 6, 10, 12),
  endsAt: new Date(2024, 6, 20, 12),
  ownerName: 'John Doe',
  ownerEmail: 'johndoe@test.com',
  emailsToInvite: ['johndoe@test.com'],
};

export async function makeTripsInMemoryFactory(
  inMemoryTripRepository: InMemoryTripRepository,
  inMemoryParticipantRepository: InMemoryParticipantRepository
) {
  inMemoryTripRepository.createTrip(createTripDTO);

  const { trips } = await inMemoryTripRepository.getTrips();

  trips.forEach((trip) => {
    inMemoryParticipantRepository.participants.push(...trip.participants);
  });

  return {
    tripsData: trips,
    participantsData: inMemoryParticipantRepository.participants,
  };
}

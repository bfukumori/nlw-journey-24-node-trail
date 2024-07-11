import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const startDate = faker.date.soon();
  const endDate = faker.date.soon({ refDate: startDate, days: 7 });

  const trips = await prisma.trip.createManyAndReturn({
    data: Array.from({ length: 2 }, () => ({
      destination: faker.location.city(),
      starts_at: startDate,
      ends_at: endDate,
    })),
  });

  trips.forEach(async (trip) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const participantFirstName = faker.person.firstName();
    const participantLastName = faker.person.lastName();

    await prisma.participant.createMany({
      data: [
        {
          name: faker.person.fullName({ firstName, lastName }),
          email: faker.internet.email({ firstName, lastName }),
          trip_id: trip.id,
          is_owner: true,
        },
        {
          name: faker.person.fullName({
            firstName: participantFirstName,
            lastName: participantLastName,
          }),
          email: faker.internet.email({
            firstName: participantFirstName,
            lastName: participantLastName,
          }),
          trip_id: trip.id,
          is_owner: false,
        },
      ],
    });

    await prisma.activity.createMany({
      data: Array.from({ length: 2 }, () => ({
        title: faker.lorem.sentence(),
        occurs_at: faker.date.between({
          from: trip.starts_at,
          to: trip.ends_at,
        }),
        trip_id: trip.id,
      })),
    });

    await prisma.link.create({
      data: {
        title: faker.lorem.sentence(),
        trip_id: trip.id,
        url: faker.internet.url(),
      },
    });
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

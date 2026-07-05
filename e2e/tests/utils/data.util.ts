import { faker } from '@faker-js/faker';

export interface UserData {
  name: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
}

export function generateUser(): UserData {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const timestamp = Date.now();

  return {
    name: `${firstName} ${lastName}`,
    email: `qa.${firstName}.${timestamp}@mailinator.com`.toLowerCase(),
    password: faker.internet.password({ length: 12 }),
    firstName,
    lastName,
    company: faker.company.name(),
    address1: faker.location.streetAddress(),
    address2: faker.location.secondaryAddress(),
    country: 'United States',
    state: faker.location.state(),
    city: faker.location.city(),
    zipcode: faker.location.zipCode(),
    mobileNumber: faker.phone.number({ style: 'national' }).replace(/\D/g, ''),
    dobDay: '15',
    dobMonth: 'May',
    dobYear: '1995',
  };
}

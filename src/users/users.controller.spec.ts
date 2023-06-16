import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { AuthService } from './auth.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    const users: User[] = [];

    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({ id, email: 'asdf', password: 'asdf' } as User);
      },
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: 'asdf' } as User]);
      },
      remove: (id: number) => {
        return Promise.resolve({ id, email: 'asdf', password: 'asdf' } as User);
      },
      update: (id: number, attrs: Partial<User>) => {
        let email;
        let password;
        if (attrs.email) {
          email = attrs.email;
        } else {
          email = 'asdf';
        }
        if (attrs.password) {
          password = attrs.password;
        } else {
          password = 'asdf';
        }
        return Promise.resolve({ id, email, password } as User);
      },
    };
    fakeAuthService = {
      signup: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
      signin: (email: string, password: string) => {
        const user: User = users.find((user) => {
          return user.email === email;
        });
        if (user && user.password === password) {
          return Promise.resolve(user);
        }
        if (user && user.password !== password) {
          return Promise.reject('invalid credentials');
        }
        return Promise.reject('user not found');
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('asdf');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('asdf');
  });

  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('signin updates session object and returns user', async () => {
    const session = { userId: -10 };
    const email = 'asdf@asdf.com';
    const password = 'asdf';
    await fakeAuthService.signup(email, password);
    const user = await controller.signIn({ email, password }, session);

    expect(user.email).toEqual(email);
    expect(session.userId).toEqual(user.id);
  });
});

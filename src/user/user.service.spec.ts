import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserNotFoundException } from '../exceptions/UserNotFoundException';
import { UpdateUserDto } from './dto/update-user.dto';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'userName',
        email: 'test@example.com',
        password: 'password',
      };

      const hashedPassword = 'hashedPassword';
      const user: User = {
        id: uuidv4(),
        ...createUserDto,
        password: hashedPassword,
        customers: [],
      } as User;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      jest.spyOn(userRepository, 'create').mockReturnValue(user);
      jest.spyOn(userRepository, 'save').mockResolvedValue(user);

      const result = await service.create(createUserDto);

      expect(result).toEqual(user);
      expect(userRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        ...createUserDto,
        password: hashedPassword,
      }));
      expect(userRepository.save).toHaveBeenCalledWith(user);
    });

    it('should throw ConflictException if user already exists', async () => {
      const createUserDto: CreateUserDto = { username: 'testuser', email: 'test@example.com', password: 'password' };
      const existingUser = new User();
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(existingUser);

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
    });

    it('should handle bcrypt hash failure', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockRejectedValue(new Error('Hashing failed'));

      await expect(service.create(createUserDto)).rejects.toThrow('Hashing failed');
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: [{ username: createUserDto.username }, { email: createUserDto.email }],
      });
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [new User(), new User()];
      jest.spyOn(userRepository, 'find').mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user = new User();
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);

      const result = await service.findOne('1');

      expect(result).toEqual(user);
    });

    it('should throw UserNotFoundException if user not found', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(UserNotFoundException);
    });
  });

  describe('findOneById', () => {
    it('should return a user by id', async () => {
      const user = new User();
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const result = await service.findOneById('1');

      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOneById('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user by email', async () => {
      const user = new User();
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const result = await service.findOneByEmail('test@example.com');

      expect(result).toEqual(user);
    });

    it('should return null if user not found by email', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      const result = await service.findOneByEmail('test@example.com');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = { username: 'updatedUser' };
      const user = new User();
      jest.spyOn(service, 'findOneById').mockResolvedValue(user);
      jest.spyOn(userRepository, 'save').mockResolvedValue(user);

      const result = await service.update('1', updateUserDto);

      expect(result).toEqual(user);
      expect(userRepository.save).toHaveBeenCalledWith(user);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const user = new User();
      user.id = '1';
      jest.spyOn(service, 'findOneById').mockResolvedValue(user);
      jest.spyOn(userRepository, 'remove').mockResolvedValue(user);

      await service.remove('1');

      expect(userRepository.remove).toHaveBeenCalledWith(user);
    });
  });

  describe('changePassword', () => {
    it('should change the user password', async () => {
      const user = new User();
      user.password = 'oldHashedPassword';
      jest.spyOn(service, 'findOneById').mockResolvedValue(user);
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHashedPassword');
      jest.spyOn(userRepository, 'save').mockResolvedValue(user);

      const result = await service.changePassword('1', 'newPassword');

      expect(result).toEqual(user);
      expect(user.password).toBe('newHashedPassword');
      expect(userRepository.save).toHaveBeenCalledWith(user);
    });
  });
});
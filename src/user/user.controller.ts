import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Post, Put, Logger } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('users')
@Controller('/api/v1/users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created.', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    this.logger.log('Creating a new user');
    const user = await this.userService.create(createUserDto);
    return this.userService.mapUserToResponseDto(user);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiResponse({ status: 200, description: 'List of users retrieved successfully.', type: [UserResponseDto] })
  @ApiResponse({ status: 500, description: 'Server error' })
  async findAll(): Promise<UserResponseDto[]> {
    this.logger.log('Retrieving all users');
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a user by ID' })
  @ApiResponse({ status: 200, description: 'User found successfully.', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    this.logger.log(`Retrieving user with ID: ${id}`);
    const user = await this.userService.findOneById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Retrieve a user by email' })
  @ApiResponse({ status: 200, description: 'User found successfully.', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findByEmail(@Param('email') email: string): Promise<UserResponseDto> {
    this.logger.log(`Retrieving user with email: ${email}`);
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing user' })
  @ApiResponse({ status: 200, description: 'User updated successfully.', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    this.logger.log(`Updating user with ID: ${id}`);
    return this.userService.update(id, updateUserDto);
  }

  @Put(':id/password')
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, description: 'User password changed successfully.' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async changePassword(@Param('id') id: string, @Body('newPassword') newPassword: string): Promise<User> {
    this.logger.log(`Changing password for user with ID: ${id}`);
    return this.userService.changePassword(id, newPassword);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a user' })
  @ApiResponse({ status: 204, description: 'User successfully deleted.' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id') id: string): Promise<void> {
    this.logger.log(`Removing user with ID: ${id}`);
    await this.userService.remove(id);
  }
}
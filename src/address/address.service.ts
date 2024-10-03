import {Injectable, Logger} from '@nestjs/common';
import {CreateAddressDto} from './dto/create-address.dto';
import {UpdateAddressDto} from './dto/update-address.dto';
import {Address} from "./entities/address.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Customer} from "../customer/entities/customer.entity";
import {CustomerNotFoundException} from "../exceptions/CustomerNotFoundException";
import {AddressNotFoundException} from "../exceptions/AddressNotFoundException";

@Injectable()
export class AddressService {
  private readonly logger = new Logger(AddressService.name);

  constructor(
      @InjectRepository(Address)
      private addressRepository: Repository<Address>,
      @InjectRepository(Customer)
      private customerRepository: Repository<Customer>,
  ) {}

  async create(createAddressDto: CreateAddressDto): Promise<Address> {
    this.logger.log('Iniciando a criação de um novo endereço');

    const customer = await this.customerRepository.findOne({ where: { id: createAddressDto.customerId } });
    if (!customer) {
      this.logger.warn(`Cliente com ID ${createAddressDto.customerId} não encontrado`);
      throw new CustomerNotFoundException(createAddressDto.customerId);
    }

    const address = this.addressRepository.create({
      ...createAddressDto,
      customer,
    });

    const savedAddress = await this.addressRepository.save(address);
    this.logger.log(`Endereço criado com sucesso: ${savedAddress.id}`);
    return savedAddress;
  }

  async findAll(): Promise<Address[]> {
    this.logger.log('Buscando todos os endereços');
    const addresses = await this.addressRepository.find({ relations: ['customer'] });
    this.logger.log(`Total de endereços encontrados: ${addresses.length}`);
    return addresses;
  }

  async findOne(id: string): Promise<Address> {
    this.logger.log(`Buscando endereço com ID: ${id}`);
    const address = await this.addressRepository.findOne({ where: { id }, relations: ['customer'] });

    if (!address) {
      this.logger.warn(`Endereço com ID ${id} não encontrado`);
      throw new AddressNotFoundException(id);
    }

    this.logger.log(`Endereço encontrado: ${address.id}`);
    return address;
  }

  async update(id: string, updateAddressDto: UpdateAddressDto): Promise<Address> {
    this.logger.log(`Iniciando a atualização do endereço com ID: ${id}`);

    const existingAddress = await this.addressRepository.findOne({ where: { id }, relations: ['customer'] });
    if (!existingAddress) {
      this.logger.warn(`Endereço com ID ${id} não encontrado para atualização`);
      throw new AddressNotFoundException(id); // Certifique-se de criar essa exceção
    }

    Object.assign(existingAddress, updateAddressDto);
    await this.addressRepository.save(existingAddress);

    this.logger.log(`Endereço com ID ${id} atualizado com sucesso`);
    return existingAddress;
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Iniciando a exclusão do endereço com ID: ${id}`);

    const existingAddress = await this.addressRepository.findOneBy({ id });
    if (!existingAddress) {
      this.logger.warn(`Endereço com ID ${id} não encontrado para exclusão`);
      throw new AddressNotFoundException(id); // Certifique-se de criar essa exceção
    }

    await this.addressRepository.delete(id);
    this.logger.log(`Endereço com ID ${id} excluído com sucesso`);
  }
}

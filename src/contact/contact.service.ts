import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact } from './schemas/contact.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ContactService {
  constructor( @InjectModel(Contact.name) private readonly contactModel: Model<Contact> ) {}
  create(createContact: any) {
    return this.contactModel.create(createContact);
  }

  findAll() {
    return this.contactModel.find();
  }

  findOne(id: string) {
    return this.contactModel.find({ user: id });
  }

  findbyUser(id: string) {
    return this.contactModel.find({ user: id }).populate('user');
  }

  update(id: string, updateContact: Contact) {
    return  this.contactModel.findByIdAndUpdate(id, updateContact);
  }

  remove(id: string) {
    return this.contactModel.findByIdAndDelete(id);
  }
}

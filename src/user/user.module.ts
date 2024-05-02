import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Contact, ContactSchema } from 'src/contact/schemas/contact.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, { name: Contact.name, schema: ContactSchema }])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

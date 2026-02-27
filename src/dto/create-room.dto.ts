import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateRoomDto {
  @IsMongoId()
  @IsNotEmpty()
  calleeId: string; // O ID do usuário que vai receber a chamada (MongoID válido)

  // Se quiseres manter o title para lógica interna, podes,
  // mas ele não será gravado no banco conforme o teu Schema atual.
  @IsString()
  @IsNotEmpty()
  title: string;
}

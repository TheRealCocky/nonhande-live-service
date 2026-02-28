import { IsString, IsNotEmpty, IsMongoId, IsOptional } from 'class-validator';

export class CreateRoomDto {
  @IsMongoId({ message: 'O ID do aluno deve ser um MongoID válido' })
  @IsNotEmpty()
  calleeId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  // Adicionamos este campo para o NestJS aceitar o ID que vem do Frontend
  @IsMongoId({ message: 'O seu ID de professor deve ser um MongoID válido' })
  @IsNotEmpty()
  callerId: string;
}

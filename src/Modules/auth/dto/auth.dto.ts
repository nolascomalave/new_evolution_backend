import { IsInt, IsNumber, IsString, MaxLength, MinLength} from 'class-validator';

export class LoginDto {
    @IsNumber()
    @IsInt()
    id_system: number;

    @IsNumber()
    @IsInt()
    id_system_subscription: number;

    @IsString()
    @MinLength(5)
    @MaxLength(250)
    username: string;

    @IsString()
    @MinLength(5)
    @MaxLength(250)
    password: string;
}
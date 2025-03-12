import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, MaxLength, MinLength} from 'class-validator';
import { booleanFormat } from 'src/util/formats';

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

export class LoginOptionsDto {
    @IsOptional()
    @Transform(({ value }) => booleanFormat(value))
    @IsBoolean()
    "cookie-session": boolean;
}
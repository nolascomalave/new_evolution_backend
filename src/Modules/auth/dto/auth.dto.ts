import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, MaxLength, MinLength} from 'class-validator';
import { booleanFormat } from 'src/util/formats';

export class LoginDto {
    // @Transform(({value}) => (() => {console.log(value); return value})())
    @IsString()
    @MaxLength(250)
    system_id: string;

    @IsString()
    @MaxLength(250)
    system_subscription_id: string;

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
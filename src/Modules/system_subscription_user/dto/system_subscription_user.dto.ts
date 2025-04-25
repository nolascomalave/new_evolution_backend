import { Transform, Type } from "class-transformer";
import { IsArray, IsString, MaxLength, MinLength, ValidateNested, IsNumber, IsInt, Min, IsEnum, IsOptional, IsBoolean } from "class-validator";
import { booleanFormat } from "src/util/formats";

enum GenderEnum {
    Male,
    Female
};

class NameDto {
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    name: string;

    @IsNumber()
    @IsInt()
    @Min(0)
    order: number

    @IsString()
    @MaxLength(250)
    entity_name_type_id: string
}

class DocumentDto {
    @IsString()
    @MinLength(1)
    @MaxLength(50)
    document: string;

    @IsNumber()
    @IsInt()
    @Min(0)
    order: number

    @IsString()
    @MaxLength(250)
    entity_document_category_id: string
}

class PhoneDto {
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    phone: string;

    @IsNumber()
    @IsInt()
    @Min(0)
    order: number
}

class EmailDto {
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    email: string;

    @IsNumber()
    @IsInt()
    @Min(0)
    order: number
}

const transformJSON = ({ value }) => {
    try {
        value = JSON.parse(value);
    } catch(e) {}

    return value;
}

export class AddOrUpdateDto {
    @IsOptional()
    @IsString()
    @MaxLength(250)
    system_subscription_user_id?: string;

    @Transform(transformJSON)
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => NameDto)
    names: NameDto[];

    @Transform(transformJSON)
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DocumentDto)
    documents: DocumentDto[];

    @Transform(transformJSON)
    @IsArray()
    phones: string[];

    @Transform(transformJSON)
    @IsArray()
    emails: string[];

    @IsEnum(['Male', 'Female'])
    gender: GenderEnum;

    @IsOptional()
    @IsString()
    @MinLength(5)
    @MaxLength(2500)
    address?: string;

    @IsOptional()
    @Transform(({value}) => booleanFormat(value))
    @IsBoolean()
    removePhoto?: boolean;
}

export class GetByIdDto {
    @IsString()
    @MaxLength(250)
    id: string;
}

export class GetByIdQueryDto {
    // @IsOptional()
    @Transform(({value}) => booleanFormat(value))
    @IsBoolean()
    allEntityInfo: boolean;
}

export class ChangeStatusDto {
    @IsString()
    @MaxLength(50)
    system_subscription_user_id: string;

    @IsEnum(['ACTIVE', 'INACTIVE'])
    type: GenderEnum;
}

export class ResetPasswordDto {
    @IsString()
    @MaxLength(250)
    system_subscription_user_id: string;
}

export class ChangePasswordDto {
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    current_password?: string;

    @IsString()
    @MinLength(8)
    @MaxLength(30)
    new_password?: string;
}
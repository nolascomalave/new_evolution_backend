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

    @IsNumber()
    @IsInt()
    id_entity_name_type: number
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

    @IsNumber()
    @IsInt()
    id_entity_document_category: number
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
    @IsInt()
    id_system_subscription_user?: number;

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
    @Transform(({ value }) => (isNaN(value) ? value : Number(value)))
    @IsInt()
    id: number;
}

export class GetByIdQueryDto {
    // @IsOptional()
    @Transform(({value}) => booleanFormat(value))
    @IsBoolean()
    allEntityInfo: boolean;
}

export class ChangeStatusDto {
    @IsInt()
    id_system_subscription_user: number;

    @IsEnum(['ACTIVE', 'INACTIVE'])
    type: GenderEnum;
}

export class ResetPasswordDto {
    @Transform(({value}) => Number(value))
    @IsInt()
    id_system_subscription_user: number;
}
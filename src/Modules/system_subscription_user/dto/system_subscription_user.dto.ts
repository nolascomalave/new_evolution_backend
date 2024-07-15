import { Transform, Type } from "class-transformer";
import { IsArray, IsString, MaxLength, MinLength, ValidateNested, IsNumber, IsInt, Min, IsEnum, IsOptional } from "class-validator";

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

export class AddDto {
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
    address?: string
}
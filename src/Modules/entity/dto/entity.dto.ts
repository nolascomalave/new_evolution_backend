import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsString, MaxLength, Min, MinLength, ValidateNested } from "class-validator";
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
    entity_document_category_id: string;
}


export class GetByIdDto {
    @IsString()
    @MaxLength(250)
    id: string;
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
    entity_id?: string;

    @Transform(({value}) => booleanFormat(value))
    @IsBoolean()
    is_natural?: boolean;

    @Transform(transformJSON)
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => NameDto)
    names: NameDto[];

    @IsOptional()
    @Transform(transformJSON)
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DocumentDto)
    documents?: DocumentDto[];

    @Transform(transformJSON)
    @IsArray()
    phones: string[];

    @Transform(transformJSON)
    @IsArray()
    emails: string[];

    @IsOptional()
    @IsEnum(['Male', 'Female'])
    gender?: GenderEnum;

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
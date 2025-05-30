import { IsOptional, IsString, MaxLength } from "class-validator";

export class GetEntityTypeHierarchyDto {
    @IsOptional()
    @IsString()
    @MaxLength(250)
    entity_type_root_code?: string;

    @IsOptional()
    @IsString()
    @MaxLength(250)
    entity_type_root_id?: string;
}
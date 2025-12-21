import { IsArray, IsDecimal, IsInt, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateProductDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsDecimal()
    price: number;

    @IsString()
    sku: string;

    @IsArray()
    @IsString({ each: true })
    images: string[];

    @IsString()
    category: string;

    @IsInt()
    @IsOptional()
    stock?: number;

    @IsBoolean()
    @IsOptional()
    isCustomizable?: boolean;
}

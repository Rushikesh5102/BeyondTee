import {
  IsArray,
  IsDecimal,
  IsInt,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';

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

  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  collection?: string;

  @IsString()
  @IsOptional()
  fit?: string;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsString()
  @IsOptional()
  fabricDetails?: string;

  @IsString()
  @IsOptional()
  careInstructions?: string;

  @IsBoolean()
  @IsOptional()
  isCustomizable?: boolean;
}

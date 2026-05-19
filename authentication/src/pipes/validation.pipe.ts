import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import z from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: z.ZodType) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new BadRequestException(
          error.issues.map((issue) => issue.message).join(', '),
        );
      }
      throw new BadRequestException('Validation failed');
    }
  }
}

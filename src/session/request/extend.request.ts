import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ExtendRequest {
  @ApiProperty({ type: 'uuid', example: 'd0f5c2c0-0f8a-4f1a-8f0a-2b5b8a0e1c1e' })
  @IsUUID()
  refreshToken: string;
}

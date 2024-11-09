import { ApiExtraModels, ApiProperty, getSchemaPath } from "@nestjs/swagger";

@ApiExtraModels()
export class CursorPageMetaResponseDto {
  @ApiProperty({ description: "다음 페이지 존재 여부" })
  hasNextData: boolean;
  @ApiProperty({
    description: "다음페이지 조회용 커서, 다음페이지 없으면 null",
  })
  nextCursor: string;
}

export class CursorPageResponseDto<T> {
  @ApiProperty({
    description: "데이터 목록",
    type: "array",
    items: {
      oneOf: [],
    },
  })
  data: T[];

  @ApiProperty({ description: "페이징 관련 메타데이터" })
  meta: CursorPageMetaResponseDto;
}

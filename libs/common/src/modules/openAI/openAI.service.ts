import { DescriptionRecommendResponseDto } from '@admin/api/magazine/dto/response/description-recommend.response.dto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService {
  private readonly apiKey: string;
  private readonly client: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('OPENAI_API_KEY') || '';
    this.client = new OpenAI({ apiKey: this.apiKey });
  }

  public async recommendDescription(
    title: string,
    content: string,
    imagePath: string,
    prompt: string,
  ): Promise<DescriptionRecommendResponseDto> {
    const promptText = `
[데이터 정보]
- 제목: ${title}
- 내용: ${content.slice(0, 200)}
- 추가 요청: "${prompt}"
    `.trim();

    const response = await this.client.responses.create({
      model: 'gpt-5-mini',
      instructions: `
당신은 베테랑 매거진 에디터입니다.
주어진 [데이터 정보]와 [추가 요청사항]을 반영하여 매거진 소개글을 작성하세요.

[작성 규칙]
1. 핵심 요약: 제목과 내용의 핵심을 꿰뚫으면서도 이미지와 어울리는 문장을 만드세요.
2. 요청 반영: [추가 요청사항]에 적힌 내용을 적절히 반영하되, 내용의 사실관계를 왜곡하지 마세요.
3. 길이 제약: 공백 포함 50자 내외의 한 문장으로 작성하세요.
4. 언어: 자연스러운 한국어로 작성하세요.
5. 형식: 부연 설명 없이 완성된 문장 하나만 출력하세요.
      `.trim(),
      input: [
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: promptText,
            },
            {
              type: 'input_image',
              image_url: imagePath,
              detail: 'low',
            },
          ],
        },
      ],
    });

    return { description: response.output_text };
  }
}

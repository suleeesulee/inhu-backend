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

  public async completeWithImage<T>(
    prompt: string,
    imagePath: string,
    instructions: string,
  ): Promise<T> {
    const response = await this.client.responses.create({
      // model: 'gpt-5.4-mini-2026-03-17',
      model: 'gpt-5',
      instructions,
      input: [
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: prompt,
            },
            {
              type: 'input_image',
              image_url: imagePath,
              detail: 'high',
            },
          ],
        },
      ],
    });

    const responseText = response.output_text?.trim() || '';

    try {
      const jsonString = responseText
        .replace(/^```json\n?/, '')
        .replace(/\n?```$/, '');
      return JSON.parse(jsonString) as T;
    } catch (err) {
      return responseText as unknown as T;
    }
  }

  public async complete<T>(prompt: string, instructions: string): Promise<T> {
    const response = await this.client.responses.create({
      model: 'gpt-5-mini',
      instructions,
      input: [
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: prompt,
            },
          ],
        },
      ],
    });

    const responseText = response.output_text?.trim() || '';

    try {
      const jsonString = responseText
        .replace(/^```json\n?/, '')
        .replace(/\n?```$/, '');
      return JSON.parse(jsonString) as T;
    } catch (err) {
      return responseText as unknown as T;
    }
  }
}

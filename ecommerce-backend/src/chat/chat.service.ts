import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

interface KnowledgeEntry {
  keywords: string[];
  answer: string;
}

@Injectable()
export class ChatService implements OnModuleInit {
  private knowledge: KnowledgeEntry[] = [];

onModuleInit() {
  const filePath = path.join(process.cwd(), 'src', 'chat', 'documents', 'store-info.json');
  const content = fs.readFileSync(filePath, 'utf-8');
  this.knowledge = JSON.parse(content);
  console.log(`Loaded ${this.knowledge.length} knowledge entries`);
}

  private findAnswer(message: string): string {
    const input = message.toLowerCase();

    // Score each entry by how many keywords match
    const scored = this.knowledge.map((entry) => {
      const score = entry.keywords.filter((kw) =>
        input.includes(kw.toLowerCase())
      ).length;
      return { entry, score };
    });

    // Get best match
    const best = scored.sort((a, b) => b.score - a.score)[0];

    if (best.score === 0) {
      return "I'm not sure about that. Please contact our support team for help, or ask me about shipping, returns, payments, or order tracking!";
    }

    return best.entry.answer;
  }

  chat(message: string) {
    const reply = this.findAnswer(message);
    return { reply };
  }
}
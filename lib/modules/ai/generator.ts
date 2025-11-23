import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { Settings } from '@/lib/config/settings';
import { NormalizedProfile, AboutData, SEOData } from '@/types/github';

const groq = createGroq({
  apiKey: Settings.GROQ_API_KEY,
});

export class AIDescriptionGenerator {
  private model = groq('llama-3.3-70b-versatile');

  async generateProfileSummary(profile: NormalizedProfile): Promise<AboutData> {
    try {
      const prompt = this.buildProfilePrompt(profile);

      const { text } = await generateText({
        model: this.model,
        system:
          'You are a masterful storyteller and technical biographer who crafts compelling narratives about developers. Write in a storytelling format that weaves together their journey, achievements, and impact. Use vivid language, narrative flow, and engaging anecdotes. Make the reader feel the developer\'s passion and see their evolution. Write as if telling a story about their professional journey, not just listing facts.',
        prompt,
        temperature: 0.8,
        maxOutputTokens: 600,
      });

      return this.parseProfileSummary(text, profile);
    } catch (error) {
      console.error('Failed to generate AI profile summary:', error);
      return this.generateFallbackSummary(profile);
    }
  }

  async generateSEOContents(profile: NormalizedProfile): Promise<SEOData> {
    try {
      const prompt = this.buildSEOPrompt(profile);

      const { text } = await generateText({
        model: this.model,
        system: 'You are an SEO expert. Generate SEO-optimized metadata for developer portfolios.',
        prompt,
        temperature: 0.5,
        maxOutputTokens: 300,
      });

      return this.parseSEOContent(text, profile);
    } catch (error) {
      console.error('Failed to generate SEO content:', error);
      return this.generateFallbackSEO(profile);
    }
  }

  private buildProfilePrompt(profile: NormalizedProfile): string {
    const metrics = profile.metrics ? `
PRs Merged: ${profile.metrics.prs_merged}
PRs Open: ${profile.metrics.prs_open}
Total Contributions: ${profile.metrics.total_contributions || 'N/A'}
` : '';

    return `Craft a compelling storytelling narrative about ${profile.name || profile.username}, a developer whose journey and impact deserve to be told.

Bio: ${profile.bio || 'Not provided'}
Location: ${profile.location || 'Not specified'}
Company: ${profile.company || 'Not specified'}
Public Repositories: ${profile.public_repos}
Followers: ${profile.followers}
${metrics}

Write in a storytelling format that:
1. Opens with a narrative summary (3-4 sentences) that tells their story - where they started, what drives them, and their impact. Use vivid, engaging language.
2. Highlights (3-5 items) written as story beats - each should feel like a chapter in their journey, not just a bullet point. Use phrases like "From building X to achieving Y" or "Their journey led them to..."
3. Skills (5-8 items) presented as areas where their expertise shines

IMPORTANT: Return ONLY valid JSON. Do not include markdown code blocks, explanations, or any text outside the JSON object. Start with { and end with }.

{
  "summary": "A narrative opening that tells their story...",
  "highlights": ["Story-driven highlight 1...", "Story-driven highlight 2..."],
  "skills": ["Skill 1", "Skill 2", ...]
}`;
  }

  private buildSEOPrompt(profile: NormalizedProfile): string {
    return `Generate SEO metadata for ${profile.name || profile.username}'s developer portfolio.

Bio: ${profile.bio || 'Not provided'}
Public Repositories: ${profile.public_repos}

Provide:
1. SEO title (50-60 characters)
2. Meta description (150-160 characters)
3. 5-10 relevant keywords

IMPORTANT: Return ONLY valid JSON. Do not include markdown code blocks, explanations, or any text outside the JSON object. Start with { and end with }.

{
  "title": "...",
  "description": "...",
  "keywords": ["...", "..."]
}`;
  }

  private parseProfileSummary(content: string, profile: NormalizedProfile): AboutData {
    try {
      let jsonString = this.extractJSON(content);
      if (!jsonString) {
        console.error('No JSON found in AI response:', content.substring(0, 200));
        return this.generateFallbackSummary(profile);
      }

      jsonString = this.cleanJSON(jsonString);
      const parsed = JSON.parse(jsonString);
      
      return {
        summary: parsed.summary || '',
        highlights: Array.isArray(parsed.highlights) ? parsed.highlights : [],
        skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      };
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      console.error('Response content:', content.substring(0, 500));
      return this.generateFallbackSummary(profile);
    }
  }

  private parseSEOContent(content: string, profile: NormalizedProfile): SEOData {
    try {
      let jsonString = this.extractJSON(content);
      if (!jsonString) {
        console.error('No JSON found in SEO response:', content.substring(0, 200));
        return this.generateFallbackSEO(profile);
      }

      jsonString = this.cleanJSON(jsonString);
      const parsed = JSON.parse(jsonString);
      
      return {
        title: parsed.title || '',
        description: parsed.description || '',
        keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
      };
    } catch (error) {
      console.error('Failed to parse SEO response:', error);
      console.error('Response content:', content.substring(0, 500));
      return this.generateFallbackSEO(profile);
    }
  }

  private generateFallbackSummary(profile: NormalizedProfile): AboutData {
    const name = profile.name || profile.username;
    return {
      summary:
        profile.bio ||
        `${name} is a developer with ${profile.public_repos} public repositories on GitHub.`,
      highlights: [
        `${profile.public_repos} public repositories`,
        `${profile.followers} followers on GitHub`,
        profile.location ? `Based in ${profile.location}` : 'Active developer',
      ],
      skills: ['Software Development', 'Open Source', 'GitHub'],
    };
  }

  private generateFallbackSEO(profile: NormalizedProfile): SEOData {
    const name = profile.name || profile.username;
    return {
      title: `${name} - Developer Portfolio`,
      description: profile.bio || `${name}'s developer portfolio showcasing projects and contributions on GitHub.`,
      keywords: ['developer', 'portfolio', 'github', profile.username, 'software engineer'],
    };
  }

  private extractJSON(content: string): string | null {
    if (!content) return null;

    const trimmed = content.trim();

    const markdownCodeBlockRegex = /```(?:json)?\s*(\{[\s\S]*\})\s*```/;
    const markdownMatch = trimmed.match(markdownCodeBlockRegex);
    if (markdownMatch && markdownMatch[1]) {
      return markdownMatch[1].trim();
    }

    let braceCount = 0;
    let startIndex = -1;
    let endIndex = -1;

    for (let i = 0; i < trimmed.length; i++) {
      if (trimmed[i] === '{') {
        if (startIndex === -1) {
          startIndex = i;
        }
        braceCount++;
      } else if (trimmed[i] === '}') {
        braceCount--;
        if (braceCount === 0 && startIndex !== -1) {
          endIndex = i;
          break;
        }
      }
    }

    if (startIndex !== -1 && endIndex !== -1) {
      return trimmed.substring(startIndex, endIndex + 1);
    }

    const fallbackMatch = trimmed.match(/\{[\s\S]*\}/);
    return fallbackMatch ? fallbackMatch[0] : null;
  }

  private cleanJSON(jsonString: string): string {
    let cleaned = jsonString.trim();

    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');
    cleaned = cleaned.replace(/\s*```$/i, '');

    cleaned = cleaned.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, '');

    cleaned = cleaned.replace(/,\s*}/g, '}');
    cleaned = cleaned.replace(/,\s*]/g, ']');

    const trailingCommaRegex = /,(\s*[}\]])/g;
    cleaned = cleaned.replace(trailingCommaRegex, '$1');

    return cleaned;
  }
}


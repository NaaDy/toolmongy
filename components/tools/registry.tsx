import type { ComponentType } from "react"
import {
  AgeCalculator,
  PercentageCalculator,
  LoanCalculator,
} from "@/components/tools/impl/calculators"
import {
  PasswordGenerator,
  RandomNumberGenerator,
  UuidGenerator,
  QrCodeGenerator,
  FakeDataGenerator,
} from "@/components/tools/impl/generators"
import {
  WordCounter,
  CharacterCounter,
  TextCaseConverter,
  LoremIpsumGenerator,
  SlugGenerator,
  DiffChecker,
} from "@/components/tools/impl/text"
import { BmiCalculator } from "@/components/tools/impl/health"
import {
  Base64Encoder,
  Base64Decoder,
  UrlEncoder,
  UrlDecoder,
  JsonValidator,
  JwtDecoder,
  CssGradientGenerator,
  MarkdownToHtml,
} from "@/components/tools/impl/developer"
import { ColorConverter, TimestampConverter } from "@/components/tools/impl/converters"
import {
  ImageCompressor,
  ImageResizer,
  ImageFormatConverter,
  ImageToBase64Converter,
  FaviconGenerator,
  ColorPaletteGenerator,
  SvgOptimizer,
} from "@/components/tools/impl/images"
import { MergePdf, SplitPdf, PdfToImages, ImagesToPdf, RotatePdf } from "@/components/tools/impl/pdf"
import { MetaTagsGenerator } from "@/components/tools/impl/seo"
import { YoutubeThumbnailDownloader } from "@/components/tools/impl/social"
import { PomodoroTimer } from "@/components/tools/impl/productivity"
import { GpaCalculator } from "@/components/tools/impl/education"
import { PromptGenerator } from "@/components/tools/impl/ai"
import { SalaryCalculator } from "@/components/tools/impl/finance"
import { JsonFormatter } from "@/components/tools/impl/json-formatter"
import { RegexTester } from "@/components/tools/impl/regex-tester"
import { ImageConverter } from "@/components/tools/impl/image-converter"
import { UtmBuilder } from "@/components/tools/impl/utm-builder"
import { SqlFormatter } from "@/components/tools/impl/sql-formatter"
/**
 * Maps a tool's `slug` (from lib/tools/data.ts) to its interactive component.
 * A slug missing from this map has no UI yet — app/tools/[slug]/page.tsx
 * falls back to a "coming soon" placeholder for it.
 *
 * To wire up a new tool: build its component in components/tools/impl/,
 * then add one line here.
 */
export const toolComponents: Record<string, ComponentType<any>> = {
  "age-calculator": AgeCalculator,
  "percentage-calculator": PercentageCalculator,
  "loan-calculator": LoanCalculator,
  "password-generator": PasswordGenerator,
  "random-number-generator": RandomNumberGenerator,
  "uuid-generator": UuidGenerator,
  "qr-code-generator": QrCodeGenerator,
  "word-counter": WordCounter,
  "character-counter": CharacterCounter,
  "text-case-converter": TextCaseConverter,
  "lorem-ipsum-generator": LoremIpsumGenerator,
  "bmi-calculator": BmiCalculator,
  "base64-encoder": Base64Encoder,
  "base64-decoder": Base64Decoder,
  "url-encoder": UrlEncoder,
  "url-decoder": UrlDecoder,
  "json-formatter": JsonFormatter,
  "json-validator": JsonValidator,
  "color-converter": ColorConverter,
  "timestamp-converter": TimestampConverter,
  "image-compressor": ImageCompressor,
  "image-resizer": ImageResizer,
  "image-format-converter": ImageFormatConverter,
  "image-to-base64": ImageToBase64Converter,
  "favicon-generator": FaviconGenerator,
  "merge-pdf": MergePdf,
  "split-pdf": SplitPdf,
  "pdf-to-images": PdfToImages,
  "images-to-pdf": ImagesToPdf,
  "rotate-pdf": RotatePdf,
  "meta-tags-generator": MetaTagsGenerator,
  "youtube-thumbnail-downloader": YoutubeThumbnailDownloader,
  "pomodoro-timer": PomodoroTimer,
  "gpa-calculator": GpaCalculator,
  "prompt-generator": PromptGenerator,
  // New batch
  "jwt-decoder": JwtDecoder,
  "css-gradient-generator": CssGradientGenerator,
  "regex-tester": RegexTester,
  "markdown-to-html": MarkdownToHtml,
  "diff-checker": DiffChecker,
  "slug-generator": SlugGenerator,
  "color-palette-generator": ColorPaletteGenerator,
  "svg-optimizer": SvgOptimizer,
  "fake-data-generator": FakeDataGenerator,
  "salary-calculator": SalaryCalculator,
  "image-converter": ImageConverter,
  "utm-builder": UtmBuilder,
  "sql-formatter": SqlFormatter,
}

export function getToolComponent(slug: string): ComponentType<any> | undefined {
  return toolComponents[slug]
}
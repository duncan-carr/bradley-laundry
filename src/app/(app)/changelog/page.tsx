import { ArrowLeft } from "lucide-react";
import insane from "insane";
import { marked } from "marked";
import { promises as fs } from "fs";
import path from "path";
import Link from "next/link";

export default async function ChangeLog() {
  try {
    // Read the file from the public directory
    const markdownContent = await fs.readFile(
      path.join(process.cwd(), "public", "changelog.md"),
      "utf-8",
    );

    const parsedHtml = await marked.parse(markdownContent);
    const sanitizedHtml = insane(parsedHtml);

    return (
      <main className="px-4 py-6 md:px-6 md:py-8">
        <Link
          href="/"
          className="mb-3 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3" />
          Back to home
        </Link>
        <div
          className="prose prose-sm prose-slate max-w-2xl dark:prose-invert prose-headings:tracking-tight prose-headings:font-bold prose-p:leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: sanitizedHtml,
          }}
        ></div>
      </main>
    );
  } catch (error) {
    console.error("Error loading changelog:", error);
    return (
      <main className="px-4 py-6 md:px-6 md:py-8">
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          Error loading changelog
        </div>
      </main>
    );
  }
}

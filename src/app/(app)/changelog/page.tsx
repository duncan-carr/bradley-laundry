import insane from "insane";
import { marked } from "marked";
import { promises as fs } from "fs";
import path from "path";

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
      <div className="p-6">
        <div
          className="prose prose-slate dark:prose-invert"
          dangerouslySetInnerHTML={{
            __html: sanitizedHtml,
          }}
        ></div>
      </div>
    );
  } catch (error) {
    console.error("Error loading changelog:", error);
    return <div>Error loading changelog</div>;
  }
}

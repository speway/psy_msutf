import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { sanitizePostTextFields } from "../lib/text-sanitize";

type Post = {
  id?: string;
  title?: string;
  excerpt?: string;
  content?: string;
  date?: string;
  category?: string;
};

type PostsFile = Post[] | { posts?: Post[]; [key: string]: unknown };

const filePath = join(process.cwd(), "data", "posts.json");
const dirtyPatterns: Array<[RegExp, string]> = [
  [/\uFFFD|�/, "replacement character"],
  [/новости[_\s]*мгу/i, "raw новости_мгу tag"],
  [/https?:\/\/\S+/i, "raw URL"],
  [/\b(Сессия|Психология)\s*[-–‑‒−]\s*это\b/i, "bad hyphen before это"],
  [/9\s*Мая\s*[-–‑‒−]\s*это/i, "bad 9 Мая hyphen"],
  [/SPSS\s*[-–‑‒−]\s*(он|это)\b/i, "bad SPSS hyphen"],
];

function getPostsFile(): { raw: PostsFile; posts: Post[] } {
  if (!existsSync(filePath)) return { raw: { posts: [] }, posts: [] };
  const raw = JSON.parse(readFileSync(filePath, "utf8")) as PostsFile;
  if (Array.isArray(raw)) return { raw, posts: raw };
  if (raw && Array.isArray(raw.posts)) return { raw, posts: raw.posts };
  return { raw, posts: [] };
}

function writePostsFile(raw: PostsFile, posts: Post[]): void {
  const next = Array.isArray(raw) ? posts : { ...raw, posts };
  writeFileSync(filePath, JSON.stringify(next, null, 2) + "\n", "utf8");
}

const { raw, posts: originalPosts } = getPostsFile();
const posts = originalPosts.map((post) => sanitizePostTextFields(post));

if (JSON.stringify(posts) !== JSON.stringify(originalPosts)) {
  writePostsFile(raw, posts);
  console.log("Content auto-fix applied: normalized safe typography in data/posts.json");
}

const errors: string[] = [];
const seen = new Set<string>();

for (const post of posts) {
  const id = post.id || "<no-id>";
  if (!post.id) errors.push(`post without id`);
  if (post.id && seen.has(post.id)) errors.push(`duplicate id: ${post.id}`);
  if (post.id) seen.add(post.id);
  if (!post.title?.trim()) errors.push(`${id}: empty title`);
  if (!post.excerpt?.trim()) errors.push(`${id}: empty excerpt`);
  if (!post.date || Number.isNaN(new Date(post.date).getTime())) {
    errors.push(`${id}: invalid date`);
  }
  for (const [pattern, label] of dirtyPatterns) {
    if (pattern.test(`${post.title || ""} ${post.excerpt || ""}`)) {
      errors.push(`${id}: ${label}`);
    }
  }
}

if (errors.length > 0) {
  console.error(`Content check failed (${errors.length} issue(s)):`);
  for (const error of errors.slice(0, 80)) console.error(`- ${error}`);
  if (errors.length > 80) console.error(`...and ${errors.length - 80} more`);
  process.exit(1);
}

console.log(`Content check passed. posts=${posts.length}`);

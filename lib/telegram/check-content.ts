import type { StoredPost, NormalizedPost } from "./types";

export interface ContentCheckResult {
  name: string;
  passed: boolean;
  message: string;
}

function log(
  level: "info" | "warn" | "error",
  message: string,
  ...args: unknown[]
) {
  const timestamp = new Date().toISOString();
  const fn =
    level === "info"
      ? console.log
      : level === "warn"
        ? console.warn
        : console.error;
  fn(`${timestamp} [telegram:check] ${message}`, ...args);
}

export function checkEmptyPosts(posts: StoredPost[]): ContentCheckResult {
  const empty = posts.filter(
    (p) => !p.content || p.content.trim().length === 0
  );
  return {
    name: "empty-posts",
    passed: empty.length === 0,
    message:
      empty.length === 0
        ? "No empty posts found"
        : `Found ${empty.length} empty posts: ${empty.map((p) => p.id).join(", ")}`,
  };
}

export function checkDuplicateContent(posts: StoredPost[]): ContentCheckResult {
  const seen = new Map<string, string[]>();

  for (const post of posts) {
    const key = post.content.replace(/\s+/g, "").toLowerCase().slice(0, 100);
    const existing = seen.get(key) || [];
    existing.push(post.id);
    seen.set(key, existing);
  }

  const duplicates = Array.from(seen.entries()).filter(
    ([, ids]) => ids.length > 1
  );

  return {
    name: "duplicate-content",
    passed: duplicates.length === 0,
    message:
      duplicates.length === 0
        ? "No duplicate content found"
        : `Found ${duplicates.length} groups of duplicate posts`,
  };
}

export function checkBrokenPosts(posts: StoredPost[]): ContentCheckResult {
  const broken: string[] = [];

  for (const post of posts) {
    const issues: string[] = [];

    if (!post.title || post.title.trim().length === 0) {
      issues.push("missing title");
    }

    if (!post.date || post.date.trim().length === 0) {
      issues.push("missing date");
    }

    if (post.content && post.content.includes("\uFFFD")) {
      issues.push("contains replacement character");
    }

    if (
      post.content &&
      /<[^>]+>/.test(post.content) &&
      !post.content.includes("</")
    ) {
      issues.push("contains unclosed HTML tags");
    }

    if (issues.length > 0) {
      broken.push(`${post.id} (${post.messageId}): ${issues.join(", ")}`);
    }
  }

  return {
    name: "broken-posts",
    passed: broken.length === 0,
    message:
      broken.length === 0
        ? "No broken posts found"
        : `Found ${broken.length} broken posts:\n${broken.join("\n")}`,
  };
}

export function checkPostDates(posts: StoredPost[]): ContentCheckResult {
  const invalid: string[] = [];

  for (const post of posts) {
    const date = new Date(post.date);
    if (isNaN(date.getTime())) {
      invalid.push(
        `${post.id} (${post.messageId}): invalid date "${post.date}"`
      );
    }
  }

  return {
    name: "post-dates",
    passed: invalid.length === 0,
    message:
      invalid.length === 0
        ? "All dates are valid"
        : `Found ${invalid.length} posts with invalid dates:\n${invalid.join("\n")}`,
  };
}

export function checkContentHealth(
  posts: StoredPost[],
  normalizedPosts?: NormalizedPost[]
): ContentCheckResult[] {
  const results: ContentCheckResult[] = [];

  log("info", `Running content health checks on ${posts.length} posts`);

  results.push(checkEmptyPosts(posts));
  results.push(checkDuplicateContent(posts));
  results.push(checkBrokenPosts(posts));
  results.push(checkPostDates(posts));

  if (normalizedPosts) {
    const lostInNormalization = normalizedPosts.length - posts.length;
    results.push({
      name: "normalization-loss",
      passed: lostInNormalization <= 0,
      message:
        lostInNormalization <= 0
          ? "No posts lost during normalization"
          : `${lostInNormalization} posts may have been lost during normalization`,
    });
  }

  const failed = results.filter((r) => !r.passed);
  if (failed.length > 0) {
    log("warn", `${failed.length} content checks failed`);
    for (const f of failed) {
      log("warn", `  FAIL: ${f.name} — ${f.message}`);
    }
  } else {
    log("info", "All content health checks passed");
  }

  return results;
}

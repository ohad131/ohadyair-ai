import { useMemo } from "react";
import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface AttachmentMetadata {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  sha256: string;
  url: string;
}

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug || "";
  
  const { data: post, isLoading } = trpc.blog.getBySlug.useQuery({ slug });

  const attachmentsQuery = useQuery({
    queryKey: ["blog-post-files", post?.id],
    enabled: Boolean(post?.id),
    queryFn: async () => {
      const response = await fetch(`/api/blog-posts/${post!.id}/files`);
      if (!response.ok) {
        throw new Error("Failed to load attachments");
      }
      return (await response.json()) as AttachmentMetadata[];
    },
  });

  const coverUrl = useMemo(() => {
    if (!post) return null;
    if (post.coverFileId) return `/api/files/${post.coverFileId}`;
    return post.coverImage ?? null;
  }, [post]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">טוען...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-secondary mb-4">הפוסט לא נמצא</h1>
          <Link href="/#blog">
            <Button className="liquid-button">חזרה לבלוג</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-primary/10">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <a className="text-2xl font-bold text-primary hover:scale-105 transition-transform">
              OY
            </a>
          </Link>
          <Link href="/#blog">
            <Button variant="outline" className="glass">
              <ArrowRight className="w-4 h-4 ml-2" />
              חזרה לבלוג
            </Button>
          </Link>
        </nav>
      </header>

      {/* Article */}
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Cover Image */}
        {coverUrl && (
          <div className="mb-8 rounded-2xl overflow-hidden">
            <img
              src={coverUrl}
              alt={post.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-primary/10">
          <span>{post.author}</span>
          <span>•</span>
          <span>{new Date(post.publishedAt).toLocaleDateString('he-IL')}</span>
          <span>•</span>
          <span>{post.views} צפיות</span>
        </div>

        {/* Content */}
        <div
          className="prose prose-lg max-w-none text-secondary"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {attachmentsQuery.data && attachmentsQuery.data.length > 0 && (
          <section className="mt-12 space-y-6">
            <h2 className="text-2xl font-semibold text-secondary">תוכן מצורף</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {attachmentsQuery.data.map(file => {
                const isImage = file.mimeType.startsWith("image/");
                const isVideo = file.mimeType.startsWith("video/");
                return (
                  <div key={file.id} className="rounded-xl border border-border overflow-hidden">
                    {isImage ? (
                      <img src={file.url} alt={file.filename} className="w-full h-full object-cover" />
                    ) : isVideo ? (
                      <video src={file.url} controls className="w-full h-full" preload="metadata" />
                    ) : (
                      <div className="p-6">
                        <p className="text-sm text-muted-foreground">{file.filename}</p>
                        <p className="text-xs text-muted-foreground">{file.mimeType}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}


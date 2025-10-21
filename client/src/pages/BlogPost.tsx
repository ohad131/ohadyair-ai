import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Link, useParams } from "wouter";

export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";

  const { data: post, isLoading, error } = trpc.blog.getBySlug.useQuery(
    { slug },
    { enabled: !!slug }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[467px] h-[765px] right-[20%] top-[15%] opacity-25 bg-gradient-to-b from-[#2bffff]/25 to-[#2bffff]/0 blur-[40px] rotate-[25deg]" />
        </div>
        <div className="relative z-10 container mx-auto px-20 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/4" />
              <div className="h-12 bg-muted rounded w-3/4" />
              <div className="h-64 bg-muted rounded" />
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded" />
                <div className="h-4 bg-muted rounded" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[467px] h-[765px] right-[20%] top-[15%] opacity-25 bg-gradient-to-b from-[#2bffff]/25 to-[#2bffff]/0 blur-[40px] rotate-[25deg]" />
        </div>
        <div className="relative z-10 container mx-auto px-20 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-4">😕</div>
            <h1 className="text-4xl font-bold text-white mb-4">
              המאמר לא נמצא
            </h1>
            <p className="text-[#cee0e0] mb-8">
              המאמר שחיפשת אינו קיים או הוסר
            </p>
            <Link href="/blog">
              <Button className="bg-primary hover:bg-primary/90">
                חזרה לבלוג
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Background gradient effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[467px] h-[765px] right-[20%] top-[15%] opacity-25 bg-gradient-to-b from-[#2bffff]/25 to-[#2bffff]/0 blur-[40px] rotate-[25deg]" />
        <div className="absolute w-[406px] h-[783px] right-[25%] top-[10%] opacity-30 bg-gradient-to-b from-[#2bffff]/30 to-[#2bffff]/0 blur-[20px] rotate-[25deg]" />
      </div>

      <div className="relative z-10 container mx-auto px-20 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Link href="/blog">
            <Button
              variant="outline"
              className="mb-8 bg-transparent border-white/20 text-white hover:bg-white/5"
            >
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              חזרה לבלוג
            </Button>
          </Link>

          {/* Post header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 text-sm text-[#a7bdbd] mb-4">
              <span>
                {new Date(post.publishedAt).toLocaleDateString("he-IL", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span>•</span>
              <span>{post.author}</span>
              <span>•</span>
              <span>{post.views} צפיות</span>
            </div>
            <h1 className="text-5xl font-bold text-white mb-6">
              {post.title}
            </h1>
            <p className="text-xl text-[#cee0e0]">{post.excerpt}</p>
          </div>

          {/* Cover image */}
          {post.coverImage && (
            <div className="mb-8 rounded-xl overflow-hidden">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Post content */}
          <Card className="p-8 bg-card/50 border-border/50 backdrop-blur-sm">
            <div
              className="prose prose-invert prose-lg max-w-none"
              style={{
                color: "#cee0e0",
              }}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: post.content.replace(/\n/g, "<br />"),
                }}
              />
            </div>
          </Card>

          {/* Share section */}
          <div className="mt-12 text-center">
            <p className="text-[#a7bdbd] mb-4">אהבת את המאמר? שתף אותו!</p>
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                className="bg-transparent border-white/20 text-white hover:bg-white/5"
              >
                שתף בלינקדאין
              </Button>
              <Button
                variant="outline"
                className="bg-transparent border-white/20 text-white hover:bg-white/5"
              >
                שתף בטוויטר
              </Button>
            </div>
          </div>

          {/* CTA */}
          <Card className="mt-12 p-8 bg-primary/10 border-primary/30 backdrop-blur-sm text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              רוצה לדבר על הפרויקט שלך?
            </h3>
            <p className="text-[#cee0e0] mb-6">
              בוא נדבר על איך אני יכול לעזור לך להצליח
            </p>
            <Link href="/#contact">
              <Button className="bg-primary hover:bg-primary/90 text-white">
                צור קשר
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}


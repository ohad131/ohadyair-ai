import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

export default function Blog() {
  const { data: posts, isLoading } = trpc.blog.list.useQuery();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Background gradient effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[467px] h-[765px] right-[20%] top-[15%] opacity-25 bg-gradient-to-b from-[#2bffff]/25 to-[#2bffff]/0 blur-[40px] rotate-[25deg]" />
        <div className="absolute w-[406px] h-[783px] right-[25%] top-[10%] opacity-30 bg-gradient-to-b from-[#2bffff]/30 to-[#2bffff]/0 blur-[20px] rotate-[25deg]" />
      </div>

      <div className="relative z-10 container mx-auto px-20 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">בלוג</h1>
          <p className="text-lg text-[#cee0e0] max-w-2xl mx-auto">
            מאמרים, מדריכים ותובנות בתחומי AI, אוטומציה וטכנולוגיה
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className="overflow-hidden bg-card/50 border-border/50 backdrop-blur-sm animate-pulse"
              >
                <div className="h-48 bg-muted" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-muted rounded w-1/4" />
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              </Card>
            ))}
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="overflow-hidden bg-card/50 border-border/50 backdrop-blur-sm hover:bg-card/70 transition-all cursor-pointer group h-full">
                  {post.coverImage ? (
                    <div
                      className="h-48 bg-cover bg-center"
                      style={{ backgroundImage: `url(${post.coverImage})` }}
                    />
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-primary/30 to-secondary/20 flex items-center justify-center">
                      <div className="text-5xl">📝</div>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="text-xs text-[#a7bdbd] mb-2">
                      {new Date(post.publishedAt).toLocaleDateString("he-IL", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-[#a7bdbd] text-sm line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs text-[#a7bdbd]">
                      <span>{post.author}</span>
                      <span>{post.views} צפיות</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-semibold text-white mb-2">
              אין מאמרים עדיין
            </h3>
            <p className="text-[#a7bdbd]">
              מאמרים חדשים יתווספו בקרוב. חזור שוב בקרוב!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug || "";
  
  const { data: post, isLoading } = trpc.blog.getBySlug.useQuery({ slug });

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
        {post.coverImage && (
          <div className="mb-8 rounded-2xl overflow-hidden">
            <img 
              src={post.coverImage} 
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
      </article>
    </div>
  );
}


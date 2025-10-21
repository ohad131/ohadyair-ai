import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

export default function Blog() {
  const { data: posts, isLoading } = trpc.blog.list.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass p-8 rounded-2xl">
          <p className="text-secondary">טוען...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass border-b border-white/20">
        <nav className="container mx-auto py-4 flex items-center justify-between">
          <Link href="/">
            <div className="w-14 h-14 glass-hover rounded-xl overflow-hidden flex items-center justify-center glow-cyan cursor-pointer">
              <img src="/logo.png" alt="Ohad Yair Logo" className="w-full h-full object-contain p-2" />
            </div>
          </Link>
          <Link href="/" className="text-secondary hover:text-primary transition-colors text-sm font-medium">
            ← חזרה לדף הבית
          </Link>
        </nav>
      </header>

      {/* Blog Header */}
      <section className="container mx-auto py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-secondary mb-4">בלוג</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            מאמרים, מדריכים ותובנות בתחומי AI, אוטומציה וטכנולוגיה
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts?.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <Card className="glass glass-hover h-full cursor-pointer overflow-hidden">
                <div className="h-48 liquid-gradient flex items-center justify-center">
                  <div className="text-6xl">
                    {post.slug.includes('getting-started') && '📝'}
                    {post.slug.includes('n8n') && '⚡'}
                    {post.slug.includes('business') && '💡'}
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-xs text-primary font-medium mb-2">
                    {new Date(post.publishedAt).toLocaleDateString('he-IL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                  <h3 className="text-xl font-bold text-secondary mb-3">{post.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                  <div className="mt-4 text-primary text-sm font-medium hover:underline">
                    קרא עוד ←
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {posts?.length === 0 && (
          <div className="text-center py-20">
            <div className="glass p-12 rounded-2xl inline-block">
              <p className="text-muted-foreground text-lg">אין פוסטים עדיין</p>
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="glass-dark mt-20">
        <div className="container mx-auto py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src="/logo.png" alt="Ohad Yair" className="w-10 h-10" />
                <span className="text-white font-bold text-lg">Ohad Yair</span>
              </div>
              <p className="text-white/80 text-sm">
                בונה מערכות AI ואוטומציה שמייצרות אימפקט עסקי
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">קישורים מהירים</h4>
              <div className="space-y-2">
                <Link href="/#home" className="block text-white/80 text-sm hover:text-white transition-colors">
                  בית
                </Link>
                <Link href="/#services" className="block text-white/80 text-sm hover:text-white transition-colors">
                  שירותים
                </Link>
                <Link href="/#projects" className="block text-white/80 text-sm hover:text-white transition-colors">
                  פרויקטים
                </Link>
                <Link href="/blog" className="block text-white/80 text-sm hover:text-white transition-colors">
                  בלוג
                </Link>
                <Link href="/#contact" className="block text-white/80 text-sm hover:text-white transition-colors">
                  צור קשר
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">רשתות חברתיות</h4>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 glass-hover rounded-full flex items-center justify-center text-white hover:text-primary transition-colors">
                  LI
                </a>
                <a href="#" className="w-10 h-10 glass-hover rounded-full flex items-center justify-center text-white hover:text-primary transition-colors">
                  GH
                </a>
                <a href="#" className="w-10 h-10 glass-hover rounded-full flex items-center justify-center text-white hover:text-primary transition-colors">
                  TW
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/20 text-center">
            <p className="text-white/60 text-sm">
              © 2024 Ohad Yair. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}


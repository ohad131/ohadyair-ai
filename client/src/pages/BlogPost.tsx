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
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass p-8 rounded-2xl">
          <p className="text-secondary">טוען...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen">
        <header className="glass border-b border-white/20">
          <nav className="container mx-auto py-4">
            <Link href="/">
              <div className="w-14 h-14 glass-hover rounded-xl overflow-hidden flex items-center justify-center glow-cyan cursor-pointer inline-block">
                <img src="/logo.png" alt="Ohad Yair Logo" className="w-full h-full object-contain p-2" />
              </div>
            </Link>
          </nav>
        </header>

        <div className="container mx-auto py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="glass p-12 rounded-2xl">
              <div className="text-6xl mb-4">😕</div>
              <h1 className="text-4xl font-bold text-secondary mb-4">
                המאמר לא נמצא
              </h1>
              <p className="text-muted-foreground mb-8">
                המאמר שחיפשת אינו קיים או הוסר
              </p>
              <Link href="/blog">
                <Button className="liquid-button px-8 py-3 rounded-full text-white">
                  חזרה לבלוג
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass border-b border-white/20">
        <nav className="container mx-auto py-4">
          <Link href="/">
            <div className="w-14 h-14 glass-hover rounded-xl overflow-hidden flex items-center justify-center glow-cyan cursor-pointer inline-block">
              <img src="/logo.png" alt="Ohad Yair Logo" className="w-full h-full object-contain p-2" />
            </div>
          </Link>
        </nav>
      </header>

      <div className="container mx-auto py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Link href="/blog">
            <Button
              variant="outline"
              className="mb-8 glass glass-hover border-primary/30 text-secondary"
            >
              ← חזרה לבלוג
            </Button>
          </Link>

          {/* Article Header */}
          <Card className="glass glass-hover p-8 md:p-12 mb-8">
            <div className="mb-6">
              <div className="text-sm text-primary font-medium mb-2">
                {new Date(post.publishedAt).toLocaleDateString("he-IL", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4 leading-tight">
                {post.title}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {post.excerpt}
              </p>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-primary/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">
                    {post.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-secondary">{post.author}</div>
                  <div className="text-sm text-muted-foreground">{post.views} צפיות</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="glass glass-hover border-primary/30 text-secondary"
                  onClick={() => {
                    const url = window.location.href;
                    const text = `${post.title} - ${post.excerpt}`;
                    window.open(
                      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
                      "_blank"
                    );
                  }}
                >
                  שתף בלינקדאין
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="glass glass-hover border-primary/30 text-secondary"
                  onClick={() => {
                    const url = window.location.href;
                    const text = `${post.title} - ${post.excerpt}`;
                    window.open(
                      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
                      "_blank"
                    );
                  }}
                >
                  שתף בטוויטר
                </Button>
              </div>
            </div>
          </Card>

          {/* Article Content */}
          <Card className="glass glass-hover p-8 md:p-12 mb-8">
            <div
              className="prose prose-lg max-w-none text-secondary"
              style={{
                direction: "rtl",
                textAlign: "right",
              }}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: post.content.replace(/\n/g, "<br />"),
                }}
                className="leading-relaxed space-y-4"
              />
            </div>
          </Card>

          {/* CTA Card */}
          <Card className="glass glass-hover p-8 text-center">
            <h3 className="text-2xl font-bold text-secondary mb-4">
              רוצה לדבר על הפרויקט שלך?
            </h3>
            <p className="text-muted-foreground mb-6">
              בוא נדבר על איך אני יכול לעזור לך להצליח עם AI ואוטומציה
            </p>
            <Link href="/#contact">
              <Button className="liquid-button px-8 py-3 rounded-full text-white">
                צור קשר
              </Button>
            </Link>
          </Card>
        </div>
      </div>

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
                <Link href="/#home">
                  <a className="block text-white/80 text-sm hover:text-white transition-colors">בית</a>
                </Link>
                <Link href="/#services">
                  <a className="block text-white/80 text-sm hover:text-white transition-colors">שירותים</a>
                </Link>
                <Link href="/#projects">
                  <a className="block text-white/80 text-sm hover:text-white transition-colors">פרויקטים</a>
                </Link>
                <Link href="/blog">
                  <a className="block text-white/80 text-sm hover:text-white transition-colors">בלוג</a>
                </Link>
                <Link href="/#contact">
                  <a className="block text-white/80 text-sm hover:text-white transition-colors">צור קשר</a>
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


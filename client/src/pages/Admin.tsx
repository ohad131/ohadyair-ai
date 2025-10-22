import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Admin() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"leads" | "blog" | "content">("leads");

  // Blog form state
  const [blogForm, setBlogForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    author: "אוהד יאיר",
  });

  // Fetch data
  const { data: submissions } = trpc.contact.list.useQuery();
  const { data: posts } = trpc.blog.list.useQuery();

  // Mutations
  const createBlog = trpc.blog.create.useMutation({
    onSuccess: () => {
      alert("הבלוג פורסם בהצלחה!");
      setBlogForm({ title: "", slug: "", excerpt: "", content: "", author: "אוהד יאיר" });
    },
  });

  const deleteBlog = trpc.blog.delete.useMutation({
    onSuccess: () => alert("הבלוג נמחק בהצלחה!"),
  });

  const toggleFeatured = trpc.blog.toggleFeatured.useMutation({
    onSuccess: () => alert("הסטטוס עודכן!"),
  });

  // Check authentication
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="glass glass-hover p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-secondary mb-4">גישה מוגבלת</h1>
          <p className="text-muted-foreground mb-6">
            עמוד זה מיועד למנהלי האתר בלבד. יש להתחבר כדי לגשת.
          </p>
          <Link href="/">
            <Button className="w-full liquid-button rounded-full text-white">
              חזרה לדף הבית
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const handleBlogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.title || !blogForm.slug || !blogForm.excerpt || !blogForm.content) {
      alert("נא למלא את כל השדות");
      return;
    }
    createBlog.mutate(blogForm);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass border-b border-white/20">
        <nav className="container mx-auto py-4 flex items-center justify-between">
          <Link href="/">
            <div className="w-14 h-14 glass-hover rounded-full overflow-hidden flex items-center justify-center glow-cyan cursor-pointer">
              <img src="/logo-round.png" alt="Ohad Yair Logo" className="w-full h-full object-contain p-2" />
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-secondary text-sm">שלום, {user?.name}</span>
            <Link href="/" className="text-secondary hover:text-primary transition-colors text-sm font-medium">
              ← חזרה לאתר
            </Link>
          </div>
        </nav>
      </header>

      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-secondary mb-2">ניהול האתר</h1>
          <p className="text-muted-foreground">פאנל ניהול מרכזי לכל תכני האתר</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {[
            { id: "leads", label: "לידים", icon: "📧" },
            { id: "blog", label: "בלוג", icon: "📝" },
            { id: "content", label: "תוכן", icon: "✏️" },
          ].map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`${
                activeTab === tab.id
                  ? "liquid-button text-white"
                  : "glass glass-hover text-secondary"
              } px-6 py-3 rounded-full font-medium text-sm`}
            >
              {tab.icon} {tab.label}
            </Button>
          ))}
        </div>

        {/* Leads Tab */}
        {activeTab === "leads" && (
          <div className="space-y-4">
            <Card className="glass glass-hover p-6">
              <h2 className="text-2xl font-bold text-secondary mb-4">לידים מטופס יצירת קשר</h2>
              <p className="text-muted-foreground mb-6">
                סה"כ {submissions?.length || 0} פניות
              </p>

              <div className="space-y-4">
                {submissions && submissions.length > 0 ? (
                  submissions.map((submission) => (
                    <Card key={submission.id} className="glass p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">שם</p>
                          <p className="font-semibold text-secondary">{submission.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">אימייל</p>
                          <p className="font-semibold text-secondary">{submission.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">טלפון</p>
                          <p className="font-semibold text-secondary">{submission.phone || "לא צוין"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">תאריך</p>
                          <p className="font-semibold text-secondary">
                            {new Date(submission.createdAt).toLocaleDateString("he-IL")}
                          </p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-sm text-muted-foreground mb-2">הודעה</p>
                          <p className="text-secondary">{submission.message}</p>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">אין פניות עדיין</p>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Blog Tab */}
        {activeTab === "blog" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Create Blog Form */}
            <Card className="glass glass-hover p-6">
              <h2 className="text-2xl font-bold text-secondary mb-4">פרסום בלוג חדש</h2>
              <form onSubmit={handleBlogSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">כותרת</label>
                  <Input
                    value={blogForm.title}
                    onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                    placeholder="כותרת הבלוג"
                    className="glass"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Slug (URL)</label>
                  <Input
                    value={blogForm.slug}
                    onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                    placeholder="blog-post-url"
                    className="glass"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    יופיע ב-URL: /blog/{blogForm.slug || "slug"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">תקציר</label>
                  <Textarea
                    value={blogForm.excerpt}
                    onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                    placeholder="תקציר קצר של הבלוג"
                    rows={3}
                    className="glass"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">תוכן מלא</label>
                  <Textarea
                    value={blogForm.content}
                    onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                    placeholder="תוכן הבלוג (תומך ב-HTML)"
                    rows={8}
                    className="glass"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">מחבר</label>
                  <Input
                    value={blogForm.author}
                    onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                    placeholder="שם המחבר"
                    className="glass"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={createBlog.isPending}
                  className="w-full liquid-button rounded-full text-white"
                >
                  {createBlog.isPending ? "מפרסם..." : "פרסם בלוג"}
                </Button>
              </form>
            </Card>

            {/* Existing Blogs */}
            <Card className="glass glass-hover p-6">
              <h2 className="text-2xl font-bold text-secondary mb-4">בלוגים קיימים</h2>
              <p className="text-muted-foreground mb-6">
                סה"כ {posts?.length || 0} בלוגים
              </p>

              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {posts && posts.length > 0 ? (
                  posts.map((post) => (
                    <Card key={post.id} className="glass p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-secondary mb-1">{post.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{post.excerpt}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>👁️ {post.views} צפיות</span>
                            <span>📅 {new Date(post.publishedAt).toLocaleDateString("he-IL")}</span>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={post.isFeatured || false}
                                onChange={(e) => {
                                  toggleFeatured.mutate({ id: post.id, isFeatured: e.target.checked });
                                }}
                                className="w-4 h-4 accent-primary"
                              />
                              <span>⭐ מוצע</span>
                            </label>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/blog/${post.slug}`}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="glass glass-hover border-primary/30"
                            >
                              צפה
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              if (confirm("בטוח שברצונך למחוק את הבלוג?")) {
                                deleteBlog.mutate({ id: post.id });
                              }
                            }}
                            className="glass glass-hover border-red-500/30 text-red-600"
                          >
                            מחק
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">אין בלוגים עדיין</p>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === "content" && (
          <Card className="glass glass-hover p-6">
            <h2 className="text-2xl font-bold text-secondary mb-4">עריכת תוכן האתר</h2>
            <p className="text-muted-foreground mb-6">
              תכונה זו בפיתוח. בינתיים ניתן לערוך את התוכן ישירות בקבצי הקוד.
            </p>

            <div className="space-y-4">
              <Card className="glass p-4">
                <h3 className="font-bold text-secondary mb-2">📝 שירותים</h3>
                <p className="text-sm text-muted-foreground">
                  ערוך את הש ירותים בקובץ: <code className="bg-primary/10 px-2 py-1 rounded">client/src/pages/Home.tsx</code>
                </p>
              </Card>

              <Card className="glass p-4">
                <h3 className="font-bold text-secondary mb-2">🚀 פרויקטים</h3>
                <p className="text-sm text-muted-foreground">
                  ערוך את הפרויקטים בקובץ: <code className="bg-primary/10 px-2 py-1 rounded">client/src/pages/Home.tsx</code>
                </p>
              </Card>

              <Card className="glass p-4">
                <h3 className="font-bold text-secondary mb-2">❓ שאלות נפוצות</h3>
                <p className="text-sm text-muted-foreground">
                  ערוך את השאלות בקובץ: <code className="bg-primary/10 px-2 py-1 rounded">client/src/pages/Home.tsx</code>
                </p>
              </Card>

              <Card className="glass p-4">
                <h3 className="font-bold text-secondary mb-2">👤 אודות</h3>
                <p className="text-sm text-muted-foreground">
                  ערוך את סעיף אודות בקובץ: <code className="bg-primary/10 px-2 py-1 rounded">client/src/pages/Home.tsx</code>
                </p>
              </Card>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}


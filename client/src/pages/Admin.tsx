import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Upload, Trash2, Star } from "lucide-react";
import { translations, type Language } from "@/lib/translations";
import { isLanguageCode } from "@shared/language";

const CONTENT_FIELD_KEYS = ["heroTitle", "heroSubtitle", "aboutP1", "aboutP2", "aboutP3"] as const;
type ContentFieldKey = (typeof CONTENT_FIELD_KEYS)[number];

const isContentFieldKey = (value: string): value is ContentFieldKey =>
  (CONTENT_FIELD_KEYS as readonly string[]).includes(value);

const LANGUAGES: Language[] = ["he", "en"];

const contentFieldMeta: Array<{
  key: ContentFieldKey;
  labels: Record<Language, string>;
  multiline?: boolean;
  rows?: number;
}> = [
  {
    key: "heroTitle",
    labels: { he: "כותרת ראשית", en: "Hero Title" },
  },
  {
    key: "heroSubtitle",
    labels: { he: "תת-כותרת", en: "Hero Subtitle" },
    multiline: true,
    rows: 3,
  },
  {
    key: "aboutP1",
    labels: { he: "פסקה 1 (אודות)", en: "About Paragraph 1" },
    multiline: true,
    rows: 4,
  },
  {
    key: "aboutP2",
    labels: { he: "פסקה 2 (אודות)", en: "About Paragraph 2" },
    multiline: true,
    rows: 4,
  },
  {
    key: "aboutP3",
    labels: { he: "פסקה 3 (אודות)", en: "About Paragraph 3" },
    multiline: true,
    rows: 4,
  },
];

const languageLabels: Record<Language, string> = {
  he: "עברית",
  en: "English",
};

const defaultContentByLanguage: Record<Language, Record<ContentFieldKey, string>> = {
  he: {
    heroTitle: translations.he.heroTitle,
    heroSubtitle: translations.he.heroSubtitle,
    aboutP1: translations.he.aboutP1,
    aboutP2: translations.he.aboutP2,
    aboutP3: translations.he.aboutP3,
  },
  en: {
    heroTitle: translations.en.heroTitle,
    heroSubtitle: translations.en.heroSubtitle,
    aboutP1: translations.en.aboutP1,
    aboutP2: translations.en.aboutP2,
    aboutP3: translations.en.aboutP3,
  },
};

export default function Admin() {
  const { user, isAuthenticated, loading, refresh } = useAuth();
  const [activeTab, setActiveTab] = useState<"leads" | "blog" | "projects" | "content">("leads");
  const [contentLanguage, setContentLanguage] = useState<Language>("he");
  const [contentForm, setContentForm] = useState<Record<Language, Record<ContentFieldKey, string>>>(() => ({
    he: { ...defaultContentByLanguage.he },
    en: { ...defaultContentByLanguage.en },
  }));
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  // Blog form state
  const [blogForm, setBlogForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    author: "אוהד יאיר",
    coverImage: "",
  });

  // Project form state
  const [projectForm, setProjectForm] = useState({
    title: "",
    slug: "",
    description: "",
    fullDescription: "",
    coverImage: "",
    technologies: "",
    projectUrl: "",
    githubUrl: "",
  });

  // Fetch data
  const { data: submissions } = trpc.contact.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: posts } = trpc.blog.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: projects } = trpc.projects.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const siteContentList = trpc.siteContent.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const saveContent = trpc.siteContent.setMany.useMutation({
    onSuccess: async () => {
      await siteContentList.refetch();
      alert("התוכן נשמר בהצלחה!");
    },
  });

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: async () => {
      await refresh();
      setLoginForm({ email: "", password: "" });
    },
  });

  useEffect(() => {
    if (!siteContentList.data) return;

    setContentForm(prev => {
      const next: typeof prev = {
        he: { ...prev.he },
        en: { ...prev.en },
      };

      for (const [langKey, values] of Object.entries(siteContentList.data)) {
        if (!isLanguageCode(langKey)) continue;
        const languageKey = langKey as Language;
        const record = values as Record<string, unknown> | undefined;
        if (!record) continue;
        const target = { ...next[languageKey] };
        for (const [key, value] of Object.entries(record)) {
          if (!isContentFieldKey(key) || typeof value !== "string") continue;
          target[key] = value;
        }
        next[languageKey] = target;
      }

      return next;
    });
  }, [siteContentList.data]);

  // Blog mutations
  const createBlog = trpc.blog.create.useMutation({
    onSuccess: () => {
      alert("הבלוג פורסם בהצלחה!");
      setBlogForm({ title: "", slug: "", excerpt: "", content: "", author: "אוהד יאיר", coverImage: "" });
    },
  });

  const deleteBlog = trpc.blog.delete.useMutation({
    onSuccess: () => alert("הבלוג נמחק בהצלחה!"),
  });

  const toggleBlogFeatured = trpc.blog.toggleFeatured.useMutation({
    onSuccess: () => alert("הסטטוס עודכן!"),
  });

  // Project mutations
  const createProject = trpc.projects.create.useMutation({
    onSuccess: () => {
      alert("הפרויקט נוסף בהצלחה!");
      setProjectForm({
        title: "",
        slug: "",
        description: "",
        fullDescription: "",
        coverImage: "",
        technologies: "",
        projectUrl: "",
        githubUrl: "",
      });
    },
  });

  const deleteProject = trpc.projects.delete.useMutation({
    onSuccess: () => alert("הפרויקט נמחק בהצלחה!"),
  });

  const toggleProjectFeatured = trpc.projects.toggleFeatured.useMutation({
    onSuccess: () => alert("הסטטוס עודכן!"),
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="glass glass-hover p-8 max-w-md w-full text-center">
          <p className="text-secondary">טוען נתוני מנהל...</p>
        </Card>
      </div>
    );
  }

  // Check authentication
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="glass glass-hover p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-secondary mb-4">כניסת מנהל</h1>
          <p className="text-muted-foreground mb-6">
            אנא הזינו את פרטי ההתחברות כדי לנהל את התוכן והפניות.
          </p>
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">אימייל</label>
              <Input
                type="email"
                required
                value={loginForm.email}
                onChange={e => {
                  if (loginMutation.error) loginMutation.reset();
                  setLoginForm(prev => ({ ...prev, email: e.target.value }));
                }}
                className="glass"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">סיסמה</label>
              <Input
                type="password"
                required
                value={loginForm.password}
                onChange={e => {
                  if (loginMutation.error) loginMutation.reset();
                  setLoginForm(prev => ({ ...prev, password: e.target.value }));
                }}
                className="glass"
                placeholder="********"
              />
            </div>
            {loginMutation.error && (
              <p className="text-sm text-red-500">
                {loginMutation.error.message || "התחברות נכשלה. בדקו את הפרטים ונסו שוב."}
              </p>
            )}
            <Button
              type="submit"
              className="w-full liquid-button rounded-full text-white"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "מתחבר..." : "התחבר"}
            </Button>
            <Link href="/" className="block text-center text-sm text-muted-foreground hover:text-secondary">
              ← חזרה לדף הבית
            </Link>
          </form>
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

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.slug || !projectForm.description) {
      alert("נא למלא את כל השדות החובה");
      return;
    }
    createProject.mutate(projectForm);
  };

  const handleImageUpload = async (file: File, type: "blog" | "project") => {
    // For now, we'll use a simple data URL
    // In production, you should upload to S3 or similar
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      if (type === "blog") {
        setBlogForm({ ...blogForm, coverImage: imageUrl });
      } else {
        setProjectForm({ ...projectForm, coverImage: imageUrl });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleContentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const entries = CONTENT_FIELD_KEYS.map(key => ({
      key,
      value: contentForm[contentLanguage][key],
    }));

    try {
      await saveContent.mutateAsync({ language: contentLanguage, entries });
    } catch {
      // handled by mutation onError
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await loginMutation.mutateAsync(loginForm);
    } catch {
      // errors reported via mutation state
    }
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
            { id: "projects", label: "פרויקטים", icon: "🚀" },
            { id: "content", label: "תוכן", icon: "✏️" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-lg"
                  : "glass text-secondary hover:bg-primary/10"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Leads Tab */}
        {activeTab === "leads" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-secondary mb-4">פניות ליצירת קשר</h2>
            {submissions && submissions.length > 0 ? (
              submissions.map((submission: any) => (
                <Card key={submission.id} className="glass glass-hover p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-secondary text-lg">{submission.name}</h3>
                      <p className="text-sm text-muted-foreground">{submission.email}</p>
                      {submission.phone && (
                        <p className="text-sm text-muted-foreground">{submission.phone}</p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(submission.createdAt).toLocaleDateString("he-IL")}
                    </span>
                  </div>
                  <p className="text-secondary">{submission.message}</p>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8">אין פניות עדיין</p>
            )}
          </div>
        )}

        {/* Blog Tab */}
        {activeTab === "blog" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Create Blog Form */}
            <Card className="glass glass-hover p-6">
              <h2 className="text-2xl font-bold text-secondary mb-6">פרסום בלוג חדש</h2>
              <form onSubmit={handleBlogSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">כותרת</label>
                  <Input
                    value={blogForm.title}
                    onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                    className="glass"
                    placeholder="כותרת הבלוג"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Slug (URL)</label>
                  <Input
                    value={blogForm.slug}
                    onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                    className="glass"
                    placeholder="blog-url-slug"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">תקציר</label>
                  <Textarea
                    value={blogForm.excerpt}
                    onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                    className="glass"
                    placeholder="תקציר קצר"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">תוכן מלא</label>
                  <Textarea
                    value={blogForm.content}
                    onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                    className="glass"
                    placeholder="תוכן הבלוג (HTML supported)"
                    rows={8}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">תמונת כיסוי</label>
                  <div className="flex gap-2">
                    <Input
                      value={blogForm.coverImage}
                      onChange={(e) => setBlogForm({ ...blogForm, coverImage: e.target.value })}
                      className="glass flex-1"
                      placeholder="URL או העלה קובץ"
                    />
                    <label className="cursor-pointer">
                      <Button type="button" variant="outline" className="glass" asChild>
                        <span>
                          <Upload className="w-4 h-4 ml-2" />
                          העלה
                        </span>
                      </Button>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, "blog");
                        }}
                      />
                    </label>
                  </div>
                </div>

                <Button type="submit" className="w-full liquid-button rounded-full text-white">
                  פרסם בלוג
                </Button>
              </form>
            </Card>

            {/* Blog List */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-secondary mb-4">בלוגים קיימים</h2>
              {posts && posts.length > 0 ? (
                posts.map((post: any) => (
                  <Card key={post.id} className="glass glass-hover p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-secondary">{post.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{post.excerpt}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-muted-foreground">
                            {new Date(post.publishedAt).toLocaleDateString("he-IL")}
                          </span>
                          <span className="text-xs text-muted-foreground">• {post.views} צפיות</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleBlogFeatured.mutate({ id: post.id, isFeatured: !post.isFeatured })}
                          className={`p-2 rounded-lg transition-colors ${
                            post.isFeatured ? "text-yellow-500" : "text-muted-foreground hover:text-yellow-500"
                          }`}
                        >
                          <Star className="w-4 h-4" fill={post.isFeatured ? "currentColor" : "none"} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("האם למחוק את הבלוג?")) {
                              deleteBlog.mutate({ id: post.id });
                            }
                          }}
                          className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">אין בלוגים עדיין</p>
              )}
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Create Project Form */}
            <Card className="glass glass-hover p-6">
              <h2 className="text-2xl font-bold text-secondary mb-6">הוספת פרויקט חדש</h2>
              <form onSubmit={handleProjectSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">שם הפרויקט *</label>
                  <Input
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    className="glass"
                    placeholder="שם הפרויקט"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Slug (URL) *</label>
                  <Input
                    value={projectForm.slug}
                    onChange={(e) => setProjectForm({ ...projectForm, slug: e.target.value })}
                    className="glass"
                    placeholder="project-url-slug"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">תיאור קצר *</label>
                  <Textarea
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    className="glass"
                    placeholder="תיאור קצר של הפרויקט"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">תיאור מלא</label>
                  <Textarea
                    value={projectForm.fullDescription}
                    onChange={(e) => setProjectForm({ ...projectForm, fullDescription: e.target.value })}
                    className="glass"
                    placeholder="תיאור מפורט (HTML supported)"
                    rows={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">טכנולוגיות (מופרד בפסיקים)</label>
                  <Input
                    value={projectForm.technologies}
                    onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                    className="glass"
                    placeholder="React, Node.js, TypeScript"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">קישור לפרויקט</label>
                  <Input
                    value={projectForm.projectUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, projectUrl: e.target.value })}
                    className="glass"
                    placeholder="https://project-url.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">קישור GitHub</label>
                  <Input
                    value={projectForm.githubUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                    className="glass"
                    placeholder="https://github.com/username/repo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">תמונת כיסוי</label>
                  <div className="flex gap-2">
                    <Input
                      value={projectForm.coverImage}
                      onChange={(e) => setProjectForm({ ...projectForm, coverImage: e.target.value })}
                      className="glass flex-1"
                      placeholder="URL או העלה קובץ"
                    />
                    <label className="cursor-pointer">
                      <Button type="button" variant="outline" className="glass" asChild>
                        <span>
                          <Upload className="w-4 h-4 ml-2" />
                          העלה
                        </span>
                      </Button>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, "project");
                        }}
                      />
                    </label>
                  </div>
                </div>

                <Button type="submit" className="w-full liquid-button rounded-full text-white">
                  הוסף פרויקט
                </Button>
              </form>
            </Card>

            {/* Projects List */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-secondary mb-4">פרויקטים קיימים</h2>
              {projects && projects.length > 0 ? (
                projects.map((project: any) => (
                  <Card key={project.id} className="glass glass-hover p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-secondary">{project.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                        {project.technologies && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {JSON.parse(project.technologies).map((tech: string, i: number) => (
                              <span key={i} className="text-xs px-2 py-1 glass rounded-full text-primary">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleProjectFeatured.mutate({ id: project.id, isFeatured: !project.isFeatured })}
                          className={`p-2 rounded-lg transition-colors ${
                            project.isFeatured ? "text-yellow-500" : "text-muted-foreground hover:text-yellow-500"
                          }`}
                        >
                          <Star className="w-4 h-4" fill={project.isFeatured ? "currentColor" : "none"} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("האם למחוק את הפרויקט?")) {
                              deleteProject.mutate({ id: project.id });
                            }
                          }}
                          className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">אין פרויקטים עדיין</p>
              )}
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === "content" && (
          <Card className="glass glass-hover p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-secondary mb-4">עריכת תוכן האתר</h2>
            <p className="text-muted-foreground mb-6">
              ערוך את התוכן הראשי של האתר. השינויים נשמרים עבור כל שפה בנפרד.
            </p>

            <div className="flex gap-2 mb-6">
              {LANGUAGES.map(lang => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setContentLanguage(lang)}
                  className={`px-4 py-2 rounded-xl transition-all font-medium ${
                    contentLanguage === lang
                      ? "bg-primary text-white shadow-lg"
                      : "glass text-secondary hover:bg-primary/10"
                  }`}
                >
                  {languageLabels[lang]}
                </button>
              ))}
            </div>

            <form onSubmit={handleContentSubmit} className="space-y-6">
              <div className="space-y-4">
                {contentFieldMeta.map(field => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-secondary mb-2">
                      {field.labels[contentLanguage]}
                    </label>
                    {field.multiline ? (
                      <Textarea
                        value={contentForm[contentLanguage][field.key]}
                        onChange={e =>
                          setContentForm(prev => ({
                            ...prev,
                            [contentLanguage]: {
                              ...prev[contentLanguage],
                              [field.key]: e.target.value,
                            },
                          }))
                        }
                        className="glass"
                        rows={field.rows ?? 3}
                        placeholder={defaultContentByLanguage[contentLanguage][field.key]}
                      />
                    ) : (
                      <Input
                        value={contentForm[contentLanguage][field.key]}
                        onChange={e =>
                          setContentForm(prev => ({
                            ...prev,
                            [contentLanguage]: {
                              ...prev[contentLanguage],
                              [field.key]: e.target.value,
                            },
                          }))
                        }
                        className="glass"
                        placeholder={defaultContentByLanguage[contentLanguage][field.key]}
                      />
                    )}
                  </div>
                ))}
              </div>

              {saveContent.error && (
                <p className="text-sm text-red-500">שמירת התוכן נכשלה. נסו שוב.</p>
              )}

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="liquid-button rounded-full text-white px-6"
                  disabled={saveContent.isPending}
                >
                  {saveContent.isPending ? "שומר..." : "שמור שינויים"}
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}


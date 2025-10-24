import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Upload, Trash2, Star } from "lucide-react";

export default function Admin() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"leads" | "blog" | "projects" | "content">("leads");

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

  // Content form state
  const [contentForm, setContentForm] = useState({
    heroTitle: "",
    heroSubtitle: "",
    aboutP1: "",
    aboutP2: "",
    aboutP3: "",
  });

  // Fetch data
  const { data: submissions } = trpc.contact.list.useQuery();
  const { data: posts } = trpc.blog.list.useQuery();
  const { data: projects } = trpc.projects.list.useQuery();

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
            <h2 className="text-2xl font-bold text-secondary mb-6">עריכת תוכן האתר</h2>
            <p className="text-muted-foreground mb-6">
              ערוך את התוכן הראשי של האתר. השינויים ישמרו במסד הנתונים.
            </p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-secondary mb-4">Hero Section</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">כותרת ראשית (עברית)</label>
                    <Input
                      value={contentForm.heroTitle}
                      onChange={(e) => setContentForm({ ...contentForm, heroTitle: e.target.value })}
                      className="glass"
                      placeholder="בונה מערכות AI ואוטומציה..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">תת-כותרת (עברית)</label>
                    <Textarea
                      value={contentForm.heroSubtitle}
                      onChange={(e) => setContentForm({ ...contentForm, heroSubtitle: e.target.value })}
                      className="glass"
                      placeholder="מתמחה בפיתוח פתרונות חכמים..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-primary/20 pt-6">
                <h3 className="text-lg font-bold text-secondary mb-4">About Section</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">פסקה 1 (עברית)</label>
                    <Textarea
                      value={contentForm.aboutP1}
                      onChange={(e) => setContentForm({ ...contentForm, aboutP1: e.target.value })}
                      className="glass"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">פסקה 2 (עברית)</label>
                    <Textarea
                      value={contentForm.aboutP2}
                      onChange={(e) => setContentForm({ ...contentForm, aboutP2: e.target.value })}
                      className="glass"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">פסקה 3 (עברית)</label>
                    <Textarea
                      value={contentForm.aboutP3}
                      onChange={(e) => setContentForm({ ...contentForm, aboutP3: e.target.value })}
                      className="glass"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <Button className="w-full liquid-button rounded-full text-white">
                שמור שינויים
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}


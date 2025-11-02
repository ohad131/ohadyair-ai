import { useEffect, useMemo, useRef, useState } from "react";
import { NOT_ADMIN_ERR_MSG } from "@shared/const";
import type { LanguageCode } from "@shared/language";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAdminToken } from "@/hooks/useAdminToken";
import { trpc, type RouterOutputs } from "@/lib/trpc";
import { translations } from "@/lib/translations";
import { toast } from "sonner";

const SUPPORTED_LANGUAGES: LanguageCode[] = ["he", "en"];

const BASE_IMAGE_URL_REGEX = /\/api\/images\/(\d+)/;

type AdminBlogPost = RouterOutputs["blog"]["adminList"][number];
type AdminProject = RouterOutputs["projects"]["adminList"][number];
type MediaItem = RouterOutputs["images"]["list"][number];

type BlogPostFormState = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  coverImage: string;
  coverImageId: number | null;
  publishedAt: string;
  isPublished: boolean;
  isFeatured: boolean;
};

type ProjectFormState = {
  title: string;
  slug: string;
  description: string;
  fullDescription: string;
  coverImage: string;
  coverImageId: number | null;
  technologiesText: string;
  projectUrl: string;
  githubUrl: string;
  displayOrder: string;
  isPublished: boolean;
  isFeatured: boolean;
};

type SiteContentField = {
  key: string;
  label: string;
  type?: "textarea" | "input";
};

type SiteContentSection = {
  id: string;
  label: string;
  description?: string;
  fields: SiteContentField[];
};

const SITE_CONTENT_SECTIONS: SiteContentSection[] = [
  {
    id: "hero",
    label: "Hero",
    description: "תוכן החלק העליון באתר",
    fields: [
      { key: "heroTitle", label: "Hero Title", type: "textarea" },
      { key: "heroSubtitle", label: "Hero Subtitle", type: "textarea" },
      { key: "heroHighlight", label: "Hero Highlight" },
      { key: "heroPlatforms", label: "Hero Platforms" },
      { key: "heroButton1", label: "Primary Button" },
      { key: "heroButton2", label: "Secondary Button" },
    ],
  },
  {
    id: "services",
    label: "Services",
    description: "כותרות ותיאורים לשירותים",
    fields: [
      { key: "servicesTitle", label: "Services Title" },
      { key: "servicesSubtitle", label: "Services Subtitle", type: "textarea" },
      { key: "service1Title", label: "Service 1 Title" },
      { key: "service1Desc", label: "Service 1 Description", type: "textarea" },
      { key: "service2Title", label: "Service 2 Title" },
      { key: "service2Desc", label: "Service 2 Description", type: "textarea" },
      { key: "service3Title", label: "Service 3 Title" },
      { key: "service3Desc", label: "Service 3 Description", type: "textarea" },
      { key: "service4Title", label: "Service 4 Title" },
      { key: "service4Desc", label: "Service 4 Description", type: "textarea" },
      { key: "service5Title", label: "Service 5 Title" },
      { key: "service5Desc", label: "Service 5 Description", type: "textarea" },
      { key: "service6Title", label: "Service 6 Title" },
      { key: "service6Desc", label: "Service 6 Description", type: "textarea" },
    ],
  },
  {
    id: "about",
    label: "About",
    description: "תוכן מקטע האודות",
    fields: [
      { key: "aboutTitle", label: "About Title" },
      { key: "aboutP1", label: "Paragraph 1", type: "textarea" },
      { key: "aboutP2", label: "Paragraph 2", type: "textarea" },
      { key: "aboutP3", label: "Paragraph 3", type: "textarea" },
      { key: "aboutCard1Title", label: "Card 1 Title" },
      { key: "aboutCard1Subtitle", label: "Card 1 Subtitle" },
      { key: "aboutCard2Title", label: "Card 2 Title" },
      { key: "aboutCard2Subtitle", label: "Card 2 Subtitle" },
      { key: "aboutCard3Title", label: "Card 3 Title" },
      { key: "aboutCard3Subtitle", label: "Card 3 Subtitle" },
      { key: "aboutCard4Title", label: "Card 4 Title" },
      { key: "aboutCard4Subtitle", label: "Card 4 Subtitle" },
    ],
  },
  {
    id: "projects",
    label: "Projects",
    fields: [
      { key: "projectsTitle", label: "Projects Title" },
      { key: "projectsSubtitle", label: "Projects Subtitle", type: "textarea" },
    ],
  },
  {
    id: "faq",
    label: "FAQ",
    fields: [
      { key: "faqTitle", label: "FAQ Title" },
      { key: "faqSubtitle", label: "FAQ Subtitle" },
      { key: "faq1Q", label: "Question 1" },
      { key: "faq1A", label: "Answer 1", type: "textarea" },
      { key: "faq2Q", label: "Question 2" },
      { key: "faq2A", label: "Answer 2", type: "textarea" },
      { key: "faq3Q", label: "Question 3" },
      { key: "faq3A", label: "Answer 3", type: "textarea" },
      { key: "faq4Q", label: "Question 4" },
      { key: "faq4A", label: "Answer 4", type: "textarea" },
      { key: "faq5Q", label: "Question 5" },
      { key: "faq5A", label: "Answer 5", type: "textarea" },
      { key: "faq6Q", label: "Question 6" },
      { key: "faq6A", label: "Answer 6", type: "textarea" },
      { key: "faq7Q", label: "Question 7" },
      { key: "faq7A", label: "Answer 7", type: "textarea" },
    ],
  },
  {
    id: "stats",
    label: "Hero Stats",
    description: "ערכי הכרטיסיות והכותרות שמוצגות ב-Hero",
    fields: [
      { key: "stats1Value", label: "Stat 1 Value" },
      { key: "stats1Label", label: "Stat 1 Label" },
      { key: "stats2Value", label: "Stat 2 Value" },
      { key: "stats2Label", label: "Stat 2 Label" },
      { key: "stats3Value", label: "Stat 3 Value" },
      { key: "stats3Label", label: "Stat 3 Label" },
    ],
  },
];

const SITE_CONTENT_KEYS = SITE_CONTENT_SECTIONS.flatMap(section =>
  section.fields.map(field => field.key)
);

const emptyBlogForm: BlogPostFormState = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  author: "",
  coverImage: "",
  coverImageId: null,
  publishedAt: "",
  isPublished: true,
  isFeatured: false,
};

const emptyProjectForm: ProjectFormState = {
  title: "",
  slug: "",
  description: "",
  fullDescription: "",
  coverImage: "",
  coverImageId: null,
  technologiesText: "",
  projectUrl: "",
  githubUrl: "",
  displayOrder: "0",
  isPublished: true,
  isFeatured: false,
};

function formatDateForInput(value: Date | string | null | undefined): string {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toISOString().slice(0, 16);
}

function parseDateInput(value: string): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function technologiesToText(value: string | null): string {
  if (!value) return "";
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.join(", ");
    }
  } catch {
    return value;
  }
  return "";
}

function technologiesToJson(value: string): string | undefined {
  const items = value
    .split(",")
    .map(item => item.trim())
    .filter(Boolean);
  return items.length > 0 ? JSON.stringify(items) : undefined;
}

function extractImageId(url: string | null | undefined): number | null {
  if (!url) return null;
  const match = url.match(BASE_IMAGE_URL_REGEX);
  if (!match) return null;
  const id = Number.parseInt(match[1] ?? "", 10);
  return Number.isFinite(id) ? id : null;
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        resolve(result);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export default function Admin() {
  const { token, isAuthenticated, saveToken, clearToken } = useAdminToken();
  const [loginToken, setLoginToken] = useState(token ?? "");
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("blog");

  const utils = trpc.useUtils();

  const [blogForm, setBlogForm] = useState<BlogPostFormState>(() => ({ ...emptyBlogForm }));
  const [editingBlogId, setEditingBlogId] = useState<number | null>(null);

  const [projectForm, setProjectForm] = useState<ProjectFormState>(() => ({ ...emptyProjectForm }));
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);

  const [siteContentLanguage, setSiteContentLanguage] = useState<LanguageCode>("he");
  const [siteContentDraft, setSiteContentDraft] = useState<Record<string, string>>({});

  const blogCoverInputRef = useRef<HTMLInputElement>(null);
  const projectCoverInputRef = useRef<HTMLInputElement>(null);
  const blogContentImageInputRef = useRef<HTMLInputElement>(null);
  const projectContentImageInputRef = useRef<HTMLInputElement>(null);
  const mediaUploadInputRef = useRef<HTMLInputElement>(null);

  const blogQuery = trpc.blog.adminList.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });

  const projectQuery = trpc.projects.adminList.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });

  const siteContentQuery = trpc.siteContent.list.useQuery(
    { language: siteContentLanguage },
    { enabled: isAuthenticated }
  );

  const mediaQuery = trpc.images.list.useQuery(undefined, {
    enabled: isAuthenticated && activeTab === "media",
  });

  const blogCreateMutation = trpc.blog.create.useMutation({
    onSuccess: () => {
      toast.success("הפוסט נוצר בהצלחה");
      utils.blog.adminList.invalidate();
      resetBlogForm();
    },
    onError: error => {
      toast.error(error.message || "שמירת הפוסט נכשלה");
    },
  });

  const blogUpdateMutation = trpc.blog.update.useMutation({
    onSuccess: () => {
      toast.success("הפוסט עודכן");
      utils.blog.adminList.invalidate();
      resetBlogForm();
    },
    onError: error => {
      toast.error(error.message || "עדכון הפוסט נכשל");
    },
  });

  const blogDeleteMutation = trpc.blog.delete.useMutation({
    onSuccess: () => {
      toast.success("הפוסט נמחק");
      utils.blog.adminList.invalidate();
    },
    onError: error => {
      toast.error(error.message || "מחיקת הפוסט נכשלה");
    },
  });

  const blogToggleFeaturedMutation = trpc.blog.toggleFeatured.useMutation({
    onSuccess: () => {
      utils.blog.adminList.invalidate();
    },
  });

  const projectCreateMutation = trpc.projects.create.useMutation({
    onSuccess: () => {
      toast.success("הפרויקט נוצר בהצלחה");
      utils.projects.adminList.invalidate();
      resetProjectForm();
    },
    onError: error => {
      toast.error(error.message || "שמירת הפרויקט נכשלה");
    },
  });

  const projectUpdateMutation = trpc.projects.update.useMutation({
    onSuccess: () => {
      toast.success("הפרויקט עודכן");
      utils.projects.adminList.invalidate();
      resetProjectForm();
    },
    onError: error => {
      toast.error(error.message || "עדכון הפרויקט נכשל");
    },
  });

  const projectDeleteMutation = trpc.projects.delete.useMutation({
    onSuccess: () => {
      toast.success("הפרויקט נמחק");
      utils.projects.adminList.invalidate();
    },
    onError: error => {
      toast.error(error.message || "מחיקת הפרויקט נכשלה");
    },
  });

  const projectToggleFeaturedMutation = trpc.projects.toggleFeatured.useMutation({
    onSuccess: () => {
      utils.projects.adminList.invalidate();
    },
  });

  const siteContentSaveMutation = trpc.siteContent.setMany.useMutation({
    onSuccess: () => {
      toast.success("התוכן נשמר");
      utils.siteContent.list.invalidate({ language: siteContentLanguage });
    },
    onError: error => {
      toast.error(error.message || "שמירת התוכן נכשלה");
    },
  });

  const uploadImageMutation = trpc.images.upload.useMutation({
    onSuccess: () => {
      utils.images.list.invalidate();
    },
    onError: error => {
      toast.error(error.message || "העלאת התמונה נכשלה");
    },
  });

  const deleteImageMutation = trpc.images.delete.useMutation({
    onSuccess: () => {
      toast.success("התמונה נמחקה");
      utils.images.list.invalidate();
    },
    onError: error => {
      toast.error(error.message || "מחיקת התמונה נכשלה");
    },
  });

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!siteContentQuery.data) return;

    const fallback = translations[siteContentLanguage];
    const next: Record<string, string> = {};

    SITE_CONTENT_KEYS.forEach(key => {
      const stored = siteContentQuery.data?.[key];
      const fallbackValue = (fallback as Record<string, string>)[key] ?? "";
      next[key] = typeof stored === "string" ? stored : fallbackValue;
    });

    setSiteContentDraft(next);
  }, [isAuthenticated, siteContentQuery.data, siteContentLanguage]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (siteContentQuery.data) return;
    const fallback = translations[siteContentLanguage];
    const next: Record<string, string> = {};
    SITE_CONTENT_KEYS.forEach(key => {
      next[key] = (fallback as Record<string, string>)[key] ?? "";
    });
    setSiteContentDraft(next);
  }, [isAuthenticated, siteContentLanguage, siteContentQuery.data]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const error = blogQuery.error || projectQuery.error;
    if (!error) {
      setAuthError(null);
      return;
    }

    const code = error.data?.code;
    if (code === "UNAUTHORIZED") {
      setAuthError(NOT_ADMIN_ERR_MSG);
      clearToken();
      setLoginToken("");
    } else {
      setAuthError(error.message ?? "אירעה שגיאה");
    }
  }, [blogQuery.error, projectQuery.error, clearToken, isAuthenticated]);

  const posts = useMemo(() => blogQuery.data ?? [], [blogQuery.data]);
  const projects = useMemo(() => projectQuery.data ?? [], [projectQuery.data]);
  const mediaItems = useMemo(() => mediaQuery.data ?? [], [mediaQuery.data]);

  const isUploadingImage = uploadImageMutation.isPending;

  function resetBlogForm() {
    setEditingBlogId(null);
    setBlogForm({ ...emptyBlogForm });
  }

  function resetProjectForm() {
    setEditingProjectId(null);
    setProjectForm({ ...emptyProjectForm });
  }

  async function handleLoginSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!loginToken.trim()) {
      setAuthError("נא להזין טוקן מנהל תקין");
      return;
    }

    saveToken(loginToken.trim());
    setAuthError(null);
    await Promise.all([
      blogQuery.refetch(),
      projectQuery.refetch(),
      siteContentQuery.refetch(),
      mediaQuery.refetch(),
    ]);
    toast.success("ברוך הבא");
  }

  async function handleUploadImage(file: File) {
    const base64 = await fileToBase64(file);
    const result = await uploadImageMutation.mutateAsync({
      fileName: file.name,
      mimeType: file.type,
      base64Data: base64,
    });
    toast.success("התמונה הועלתה בהצלחה");
    return result;
  }

  function handleEditPost(post: AdminBlogPost) {
    setEditingBlogId(post.id);
    setBlogForm({
      title: post.title ?? "",
      slug: post.slug ?? "",
      excerpt: post.excerpt ?? "",
      content: post.content ?? "",
      author: post.author ?? "",
      coverImage: post.coverImage ?? "",
      coverImageId: extractImageId(post.coverImage ?? ""),
      publishedAt: formatDateForInput(post.publishedAt ?? new Date()),
      isPublished: post.isPublished ?? true,
      isFeatured: post.isFeatured ?? false,
    });
  }

  function handleEditProject(project: AdminProject) {
    setEditingProjectId(project.id);
    setProjectForm({
      title: project.title ?? "",
      slug: project.slug ?? "",
      description: project.description ?? "",
      fullDescription: project.fullDescription ?? "",
      coverImage: project.coverImage ?? "",
      coverImageId: extractImageId(project.coverImage ?? ""),
      technologiesText: technologiesToText(project.technologies ?? null),
      projectUrl: project.projectUrl ?? "",
      githubUrl: project.githubUrl ?? "",
      displayOrder: project.displayOrder?.toString() ?? "0",
      isPublished: project.isPublished ?? true,
      isFeatured: project.isFeatured ?? false,
    });
  }

  async function handleBlogSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!blogForm.title.trim() || !blogForm.slug.trim()) {
      toast.error("יש למלא כותרת וכתובת קבועה (slug)");
      return;
    }

    const payload = {
      title: blogForm.title.trim(),
      slug: blogForm.slug.trim().toLowerCase(),
      excerpt: blogForm.excerpt.trim(),
      content: blogForm.content.trim(),
      author: blogForm.author.trim(),
      coverImage: blogForm.coverImage ? blogForm.coverImage.trim() : undefined,
      isPublished: blogForm.isPublished,
      isFeatured: blogForm.isFeatured,
      publishedAt: parseDateInput(blogForm.publishedAt) ?? new Date(),
    };

    if (editingBlogId) {
      await blogUpdateMutation.mutateAsync({ id: editingBlogId, data: payload });
    } else {
      await blogCreateMutation.mutateAsync(payload);
    }
  }

  async function handleProjectSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!projectForm.title.trim() || !projectForm.slug.trim()) {
      toast.error("יש למלא כותרת וכתובת קבועה (slug)");
      return;
    }

    const displayOrderNumber = Number.parseInt(projectForm.displayOrder || "0", 10) || 0;
    const technologiesJson = technologiesToJson(projectForm.technologiesText);

    const payload = {
      title: projectForm.title.trim(),
      slug: projectForm.slug.trim().toLowerCase(),
      description: projectForm.description.trim(),
      fullDescription: projectForm.fullDescription,
      coverImage: projectForm.coverImage ? projectForm.coverImage.trim() : undefined,
      technologies: technologiesJson,
      projectUrl: projectForm.projectUrl.trim() || undefined,
      githubUrl: projectForm.githubUrl.trim() || undefined,
      displayOrder: displayOrderNumber,
      isPublished: projectForm.isPublished,
      isFeatured: projectForm.isFeatured,
    };

    if (editingProjectId) {
      await projectUpdateMutation.mutateAsync({ id: editingProjectId, data: payload });
    } else {
      await projectCreateMutation.mutateAsync(payload);
    }
  }

  async function handleSiteContentSave() {
    const entries = SITE_CONTENT_KEYS.map(key => ({
      key,
      value: siteContentDraft[key] ?? "",
    }));

    await siteContentSaveMutation.mutateAsync({
      language: siteContentLanguage,
      entries,
    });
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md p-8 glass">
          <h1 className="text-2xl font-bold mb-2 text-secondary text-center">ממשק ניהול</h1>
          <p className="text-muted-foreground mb-6 text-center">
            הזן את טוקן המנהל כדי לגשת ללוח הבקרה
          </p>
          <form className="space-y-4" onSubmit={handleLoginSubmit}>
            <div className="space-y-2">
              <Label htmlFor="admin-token">Admin Token</Label>
              <Input
                id="admin-token"
                value={loginToken}
                onChange={event => setLoginToken(event.target.value)}
                placeholder="הכנס טוקן"
                type="password"
              />
            </div>
            {authError && <p className="text-sm text-red-500">{authError}</p>}
            <Button type="submit" className="w-full">
              התחבר
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="container mx-auto space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-secondary">ממשק הניהול</h1>
            <p className="text-muted-foreground">
              עריכת תכני האתר, פרויקטים, פוסטים וספריית המדיה
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => {
              clearToken();
              setLoginToken("");
              toast("נותקת מהמערכת");
            }}>
              התנתק
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="blog">ניהול בלוג</TabsTrigger>
            <TabsTrigger value="projects">ניהול פרויקטים</TabsTrigger>
            <TabsTrigger value="content">תוכן האתר</TabsTrigger>
            <TabsTrigger value="media">ספריית מדיה</TabsTrigger>
          </TabsList>

          <TabsContent value="blog" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-secondary">
                    {editingBlogId ? "עריכת פוסט" : "פוסט חדש"}
                  </h2>
                  {editingBlogId && (
                    <Button variant="ghost" onClick={resetBlogForm}>
                      ביטול עריכה
                    </Button>
                  )}
                </div>
                <form className="grid gap-4" onSubmit={handleBlogSubmit}>
                  <div className="grid gap-2">
                    <Label>כותרת</Label>
                    <Input
                      value={blogForm.title}
                      onChange={event => setBlogForm(prev => ({ ...prev, title: event.target.value }))}
                      placeholder="כותרת הפוסט"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Slug</Label>
                    <Input
                      value={blogForm.slug}
                      onChange={event => setBlogForm(prev => ({ ...prev, slug: event.target.value }))}
                      placeholder="example-post"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>תיאור קצר</Label>
                    <Textarea
                      value={blogForm.excerpt}
                      onChange={event => setBlogForm(prev => ({ ...prev, excerpt: event.target.value }))}
                      placeholder="תקציר הפוסט"
                      rows={3}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>תוכן הפוסט (HTML)</Label>
                    <Textarea
                      value={blogForm.content}
                      onChange={event => setBlogForm(prev => ({ ...prev, content: event.target.value }))}
                      rows={8}
                    />
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => blogContentImageInputRef.current?.click()}
                        disabled={isUploadingImage}
                      >
                        העלאת תמונה לתוכן
                      </Button>
                      <input
                        type="file"
                        accept="image/*"
                        ref={blogContentImageInputRef}
                        className="hidden"
                        onChange={async event => {
                          const file = event.target.files?.[0];
                          if (!file) return;
                          try {
                            const result = await handleUploadImage(file);
                            setBlogForm(prev => ({
                              ...prev,
                              content:
                                prev.content +
                                `\n<p><img src="${result.url}" alt="" style="max-width:100%;height:auto;" /></p>\n`,
                            }));
                          } finally {
                            event.target.value = "";
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>שם הכותב</Label>
                    <Input
                      value={blogForm.author}
                      onChange={event => setBlogForm(prev => ({ ...prev, author: event.target.value }))}
                      placeholder="שם הכותב"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>תאריך פרסום</Label>
                    <Input
                      type="datetime-local"
                      value={blogForm.publishedAt}
                      onChange={event => setBlogForm(prev => ({ ...prev, publishedAt: event.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>תמונת שער</Label>
                    {blogForm.coverImage && (
                      <div className="rounded-lg overflow-hidden border border-border/50">
                        <img src={blogForm.coverImage} alt="Cover" className="w-full h-48 object-cover" />
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => blogCoverInputRef.current?.click()}
                        disabled={isUploadingImage}
                      >
                        העלה תמונה
                      </Button>
                      <input
                        ref={blogCoverInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async event => {
                          const file = event.target.files?.[0];
                          if (!file) return;
                          try {
                            const result = await handleUploadImage(file);
                            setBlogForm(prev => ({
                              ...prev,
                              coverImage: result.url,
                              coverImageId: result.id,
                            }));
                          } finally {
                            event.target.value = "";
                          }
                        }}
                      />
                      {blogForm.coverImage && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setBlogForm(prev => ({ ...prev, coverImage: "", coverImageId: null }))}
                        >
                          הסר תמונה
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Switch
                        id="blog-published"
                        checked={blogForm.isPublished}
                        onCheckedChange={value => setBlogForm(prev => ({ ...prev, isPublished: value }))}
                      />
                      <Label htmlFor="blog-published">מפורסם</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="blog-featured"
                        checked={blogForm.isFeatured}
                        onCheckedChange={value => setBlogForm(prev => ({ ...prev, isFeatured: value }))}
                      />
                      <Label htmlFor="blog-featured">מומלץ</Label>
                    </div>
                  </div>
                  <Button type="submit" disabled={blogCreateMutation.isPending || blogUpdateMutation.isPending}>
                    {editingBlogId ? "עדכן פוסט" : "צור פוסט"}
                  </Button>
                </form>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold text-secondary mb-4">פוסטים קיימים</h2>
                <ScrollArea className="h-[600px] pr-3">
                  <div className="space-y-4">
                    {posts.map(post => (
                      <div key={post.id} className="border border-border/60 rounded-lg p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-secondary">{post.title}</h3>
                            <p className="text-xs text-muted-foreground">Slug: {post.slug}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                              {post.isPublished ? "מפורסם" : "טיוטה"}
                            </span>
                            {post.isFeatured && (
                              <span className="text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-500">מומלץ</span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditPost(post)}>
                            ערוך
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => blogDeleteMutation.mutate({ id: post.id })}
                          >
                            מחק
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              blogToggleFeaturedMutation.mutate({ id: post.id, isFeatured: !post.isFeatured })
                            }
                          >
                            {post.isFeatured ? "הסר המלצה" : "סמן כמומלץ"}
                          </Button>
                        </div>
                      </div>
                    ))}
                    {posts.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center">אין פוסטים להצגה</p>
                    )}
                  </div>
                </ScrollArea>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
              <Card className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-secondary">
                    {editingProjectId ? "עריכת פרויקט" : "פרויקט חדש"}
                  </h2>
                  {editingProjectId && (
                    <Button variant="ghost" onClick={resetProjectForm}>
                      ביטול עריכה
                    </Button>
                  )}
                </div>
                <form className="grid gap-4" onSubmit={handleProjectSubmit}>
                  <div className="grid gap-2">
                    <Label>כותרת</Label>
                    <Input
                      value={projectForm.title}
                      onChange={event => setProjectForm(prev => ({ ...prev, title: event.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Slug</Label>
                    <Input
                      value={projectForm.slug}
                      onChange={event => setProjectForm(prev => ({ ...prev, slug: event.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>תיאור קצר</Label>
                    <Textarea
                      rows={3}
                      value={projectForm.description}
                      onChange={event => setProjectForm(prev => ({ ...prev, description: event.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>תיאור מלא (HTML)</Label>
                    <Textarea
                      rows={8}
                      value={projectForm.fullDescription}
                      onChange={event => setProjectForm(prev => ({ ...prev, fullDescription: event.target.value }))}
                    />
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => projectContentImageInputRef.current?.click()}
                        disabled={isUploadingImage}
                      >
                        העלאת תמונה לתוכן
                      </Button>
                      <input
                        type="file"
                        accept="image/*"
                        ref={projectContentImageInputRef}
                        className="hidden"
                        onChange={async event => {
                          const file = event.target.files?.[0];
                          if (!file) return;
                          try {
                            const result = await handleUploadImage(file);
                            setProjectForm(prev => ({
                              ...prev,
                              fullDescription:
                                prev.fullDescription +
                                `\n<p><img src="${result.url}" alt="" style=\"max-width:100%;height:auto;\" /></p>\n`,
                            }));
                          } finally {
                            event.target.value = "";
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>טכנולוגיות (מופרדות בפסיקים)</Label>
                    <Input
                      value={projectForm.technologiesText}
                      onChange={event => setProjectForm(prev => ({ ...prev, technologiesText: event.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>קישורי פרויקט</Label>
                    <div className="grid gap-2 md:grid-cols-2">
                      <Input
                        placeholder="Project URL"
                        value={projectForm.projectUrl}
                        onChange={event => setProjectForm(prev => ({ ...prev, projectUrl: event.target.value }))}
                      />
                      <Input
                        placeholder="GitHub"
                        value={projectForm.githubUrl}
                        onChange={event => setProjectForm(prev => ({ ...prev, githubUrl: event.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>תמונת תצוגה</Label>
                    {projectForm.coverImage && (
                      <div className="rounded-lg overflow-hidden border border-border/50">
                        <img src={projectForm.coverImage} alt="Project" className="w-full h-48 object-cover" />
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => projectCoverInputRef.current?.click()}
                        disabled={isUploadingImage}
                      >
                        העלה תמונה
                      </Button>
                      <input
                        ref={projectCoverInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async event => {
                          const file = event.target.files?.[0];
                          if (!file) return;
                          try {
                            const result = await handleUploadImage(file);
                            setProjectForm(prev => ({
                              ...prev,
                              coverImage: result.url,
                              coverImageId: result.id,
                            }));
                          } finally {
                            event.target.value = "";
                          }
                        }}
                      />
                      {projectForm.coverImage && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setProjectForm(prev => ({ ...prev, coverImage: "", coverImageId: null }))}
                        >
                          הסר תמונה
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>סדר תצוגה</Label>
                    <Input
                      type="number"
                      value={projectForm.displayOrder}
                      onChange={event => setProjectForm(prev => ({ ...prev, displayOrder: event.target.value }))}
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Switch
                        id="project-published"
                        checked={projectForm.isPublished}
                        onCheckedChange={value => setProjectForm(prev => ({ ...prev, isPublished: value }))}
                      />
                      <Label htmlFor="project-published">מפורסם</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="project-featured"
                        checked={projectForm.isFeatured}
                        onCheckedChange={value => setProjectForm(prev => ({ ...prev, isFeatured: value }))}
                      />
                      <Label htmlFor="project-featured">מומלץ</Label>
                    </div>
                  </div>
                  <Button type="submit" disabled={projectCreateMutation.isPending || projectUpdateMutation.isPending}>
                    {editingProjectId ? "עדכן פרויקט" : "צור פרויקט"}
                  </Button>
                </form>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold text-secondary mb-4">פרויקטים קיימים</h2>
                <ScrollArea className="h-[600px] pr-3">
                  <div className="space-y-4">
                    {projects.map(project => (
                      <div key={project.id} className="border border-border/60 rounded-lg p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-secondary">{project.title}</h3>
                            <p className="text-xs text-muted-foreground">Slug: {project.slug}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                              {project.isPublished ? "מפורסם" : "טיוטה"}
                            </span>
                            {project.isFeatured && (
                              <span className="text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-500">מומלץ</span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditProject(project)}>
                            ערוך
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => projectDeleteMutation.mutate({ id: project.id })}
                          >
                            מחק
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              projectToggleFeaturedMutation.mutate({ id: project.id, isFeatured: !project.isFeatured })
                            }
                          >
                            {project.isFeatured ? "הסר המלצה" : "סמן כמומלץ"}
                          </Button>
                        </div>
                      </div>
                    ))}
                    {projects.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center">אין פרויקטים להצגה</p>
                    )}
                  </div>
                </ScrollArea>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card className="p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-secondary">תוכן האתר</h2>
                  <p className="text-muted-foreground text-sm">
                    עדכון טקסטים לכל מקטע באתר לפי שפה
                  </p>
                </div>
                <Select value={siteContentLanguage} onValueChange={value => setSiteContentLanguage(value as LanguageCode)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="בחר שפה" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_LANGUAGES.map(lang => (
                      <SelectItem key={lang} value={lang}>
                        {lang === "he" ? "עברית" : "English"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-8">
                {SITE_CONTENT_SECTIONS.map(section => (
                  <div key={section.id} className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-secondary">{section.label}</h3>
                      {section.description && (
                        <p className="text-sm text-muted-foreground">{section.description}</p>
                      )}
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      {section.fields.map(field => {
                        const value = siteContentDraft[field.key] ?? "";
                        return (
                          <div key={field.key} className="space-y-2">
                            <Label>{field.label}</Label>
                            {field.type === "textarea" ? (
                              <Textarea
                                rows={4}
                                value={value}
                                onChange={event =>
                                  setSiteContentDraft(prev => ({ ...prev, [field.key]: event.target.value }))
                                }
                              />
                            ) : (
                              <Input
                                value={value}
                                onChange={event =>
                                  setSiteContentDraft(prev => ({ ...prev, [field.key]: event.target.value }))
                                }
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSiteContentSave} disabled={siteContentSaveMutation.isPending}>
                  שמור שינויים
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="media" className="space-y-6">
            <Card className="p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-secondary">ספריית המדיה</h2>
                  <p className="text-muted-foreground text-sm">
                    העלה תמונות ושמור אותן לשימוש באתר
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => mediaUploadInputRef.current?.click()}
                    disabled={isUploadingImage}
                  >
                    העלה תמונה חדשה
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={mediaUploadInputRef}
                    onChange={async event => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      try {
                        await handleUploadImage(file);
                      } finally {
                        event.target.value = "";
                      }
                    }}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mediaItems.map((item: MediaItem) => (
                  <Card key={item.id} className="overflow-hidden border border-border/60">
                    <div className="h-40 bg-muted/40 flex items-center justify-center overflow-hidden">
                      <img
                        src={item.url}
                        alt={item.fileName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 space-y-2 text-sm">
                      <div className="font-semibold text-secondary truncate">{item.fileName}</div>
                      <div className="text-muted-foreground text-xs">
                        {item.mimeType}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (navigator.clipboard?.writeText) {
                              navigator.clipboard
                                .writeText(item.url)
                                .then(() => toast.success("הקישור הועתק"))
                                .catch(() => toast.error("נכשל בהעתקת הקישור"));
                            } else {
                              toast.error("הדפדפן לא תומך בהעתקה אוטומטית");
                            }
                          }}
                        >
                          העתק קישור
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteImageMutation.mutate({ id: item.id })}
                        >
                          מחק
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
                {mediaItems.length === 0 && (
                  <div className="col-span-full text-center text-muted-foreground">
                    אין תמונות בספרייה עדיין
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

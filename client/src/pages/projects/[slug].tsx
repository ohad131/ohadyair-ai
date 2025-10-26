import { useMemo } from "react";
import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink, Github } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface AttachmentMetadata {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  sha256: string;
  url: string;
}

export default function ProjectDetail() {
  const params = useParams();
  const slug = params.slug || "";
  
  const { data: project, isLoading } = trpc.projects.getBySlug.useQuery({ slug });

  const attachmentsQuery = useQuery({
    queryKey: ["project-files", project?.id],
    enabled: Boolean(project?.id),
    queryFn: async () => {
      const response = await fetch(`/api/projects/${project!.id}/files`);
      if (!response.ok) {
        throw new Error("Failed to load project media");
      }
      return (await response.json()) as AttachmentMetadata[];
    },
  });

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

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-secondary mb-4">הפרויקט לא נמצא</h1>
          <Link href="/#projects">
            <Button className="liquid-button">חזרה לפרויקטים</Button>
          </Link>
        </div>
      </div>
    );
  }

  let technologies: string[] = [];
  if (project.technologies) {
    try {
      const parsed = JSON.parse(project.technologies);
      if (Array.isArray(parsed)) {
        technologies = parsed as string[];
      }
    } catch {
      technologies = [];
    }
  }

  const coverUrl = useMemo(() => {
    if (!project) return null;
    if (project.coverFileId) return `/api/files/${project.coverFileId}`;
    return project.coverImage ?? null;
  }, [project]);

  const excerpt = project.excerpt ?? project.content ?? "";
  const richContent = project.content ?? "";

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
          <Link href="/#projects">
            <Button variant="outline" className="glass">
              <ArrowRight className="w-4 h-4 ml-2" />
              חזרה לפרויקטים
            </Button>
          </Link>
        </nav>
      </header>

      {/* Project */}
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Cover Image */}
        {coverUrl && (
          <div className="mb-8 rounded-2xl overflow-hidden glass">
            <img
              src={coverUrl}
              alt={project.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
          {project.title}
        </h1>

        {/* Description */}
        <p className="text-xl text-muted-foreground mb-6">
          {excerpt}
        </p>

        {/* Technologies */}
        {technologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {technologies.map((tech: string, index: number) => (
              <span 
                key={index}
                className="px-3 py-1 glass rounded-full text-xs font-medium text-primary"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        <div className="flex gap-4 mb-8 pb-8 border-b border-primary/10">
          {project.projectUrl && (
            <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
              <Button className="liquid-button">
                <ExternalLink className="w-4 h-4 ml-2" />
                צפה בפרויקט
              </Button>
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="glass">
                <Github className="w-4 h-4 ml-2" />
                GitHub
              </Button>
            </a>
          )}
        </div>

        {/* Full Description */}
        {richContent && (
          <div
            className="prose prose-lg max-w-none text-secondary"
            dangerouslySetInnerHTML={{ __html: richContent ?? "" }}
          />
        )}

        {attachmentsQuery.data && attachmentsQuery.data.length > 0 && (
          <section className="mt-12 space-y-6">
            <h2 className="text-2xl font-semibold text-secondary">מדיה מהפרויקט</h2>
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


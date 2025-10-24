import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink, Github } from "lucide-react";

export default function ProjectDetail() {
  const params = useParams();
  const slug = params.slug || "";
  
  const { data: project, isLoading } = trpc.projects.getBySlug.useQuery({ slug });

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

  const technologies = project.technologies ? JSON.parse(project.technologies) : [];

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
        {project.coverImage && (
          <div className="mb-8 rounded-2xl overflow-hidden glass">
            <img 
              src={project.coverImage} 
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
          {project.description}
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
        {project.fullDescription && (
          <div 
            className="prose prose-lg max-w-none text-secondary"
            dangerouslySetInnerHTML={{ __html: project.fullDescription }}
          />
        )}
      </article>
    </div>
  );
}


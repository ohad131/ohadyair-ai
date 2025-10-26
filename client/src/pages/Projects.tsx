import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

export default function ProjectsPage() {
  const { t, language } = useLanguage();
  const isHebrew = language === "he";
  const { data: projects = [], isLoading } = trpc.projects.list.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass p-8 rounded-2xl">
          <p className="text-secondary">{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="glass border-b border-white/20">
        <nav className="container mx-auto py-4 flex items-center justify-between">
          <Link href="/">
            <div className="w-14 h-14 glass-hover rounded-xl overflow-hidden flex items-center justify-center glow-cyan cursor-pointer inline-block">
              <img src="/logo.png" alt="Ohad Yair Logo" className="w-full h-full object-contain p-2" />
            </div>
          </Link>
          <Link href="/">
            <Button variant="outline" className="glass border-primary/30 text-secondary">
              {isHebrew ? "חזרה לדף הבית" : "Back to Home"}
            </Button>
          </Link>
        </nav>
      </header>

      <main className="container mx-auto py-12 md:py-20">
        <section className="text-center mb-16">
          <p className="uppercase tracking-[0.2em] text-primary text-sm mb-3">Projects</p>
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">{t.projectsTitle}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t.projectsSubtitle}</p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map(project => {
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
            return (
              <Card key={project.id} className="glass glass-hover overflow-hidden flex flex-col">
                {project.coverImage && (
                  <div className="h-52 overflow-hidden">
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                )}

                <div className="p-6 flex flex-col h-full" style={{ direction: isHebrew ? "rtl" : "ltr" }}>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h2 className="text-2xl font-bold text-secondary leading-tight">
                      {project.title}
                    </h2>
                    <span className="text-xs font-semibold tracking-wide px-3 py-1 glass rounded-full text-primary uppercase">
                      {project.isFeatured ? (isHebrew ? "בולט" : "Featured") : isHebrew ? "AI" : "AI"}
                    </span>
                  </div>

                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  {technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {technologies.map((tech: string) => (
                        <span key={tech} className="px-3 py-1 glass rounded-full text-xs font-medium text-primary">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto flex flex-wrap gap-3 justify-between items-center">
                    <Link href={`/projects/${project.slug}`}>
                      <Button className="liquid-button px-6 py-2 text-white">
                        {t.projectsReadMore}
                      </Button>
                    </Link>
                    <div className="flex gap-2">
                      {project.projectUrl && (
                        <a
                          href={project.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary text-sm underline hover:text-primary/80"
                        >
                          {isHebrew ? "צפה" : "View"}
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary text-sm underline hover:text-primary/80"
                        >
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </section>

        {projects.length === 0 && (
          <div className="text-center text-muted-foreground mt-12">
            {isHebrew ? "עדיין לא נוספו פרויקטים." : "No projects have been published yet."}
          </div>
        )}
      </main>
    </div>
  );
}

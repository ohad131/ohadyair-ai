import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAdminToken } from "@/hooks/useAdminToken";
import { trpc, type RouterInputs, type RouterOutputs } from "@/lib/trpc";
import { toast } from "sonner";

type AdminBlogPost = RouterOutputs["blog"]["adminList"][number];
type CreateBlogPostInput = RouterInputs["blog"]["create"];
type UpdateBlogPostInput = RouterInputs["blog"]["update"]["data"];

type BlogPostFormState = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  coverImage: string;
  publishedAt: string;
  isPublished: boolean;
  isFeatured: boolean;
};

const createEmptyFormState = (): BlogPostFormState => ({
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  author: "",
  coverImage: "",
  publishedAt: "",
  isPublished: true,
  isFeatured: false,
});

function formatDateForInput(value: Date | string | null | undefined): string {
  if (!value) return "";
  const isoValue = value instanceof Date ? value.toISOString() : new Date(value).toISOString();
  return isoValue.slice(0, 16);
}

function formatDateForDisplay(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  return date.toLocaleString();
}

export default function Admin() {
  const { token, isAuthenticated, saveToken, clearToken } = useAdminToken();
  const utils = trpc.useUtils();

  const [formState, setFormState] = useState<BlogPostFormState>(() => createEmptyFormState());
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loginToken, setLoginToken] = useState(() => token ?? "");
  const [authError, setAuthError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const postsQuery = trpc.blog.adminList.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });

  useEffect(() => {
    if (postsQuery.status === "success") {
      setAuthError(null);
    }
  }, [postsQuery.status]);

  useEffect(() => {
    const error = postsQuery.error;
    if (!error) {
      return;
    }

    if (error.data?.code === "UNAUTHORIZED") {
      setAuthError("Invalid admin token. Please try again.");
      setLoginToken("");
      clearToken();
    } else {
      setAuthError("Failed to load admin data. Please refresh and try again.");
    }
  }, [clearToken, postsQuery.error, setLoginToken]);

  const posts = useMemo(() => postsQuery.data ?? [], [postsQuery.data]);

  const resetForm = () => {
    setFormState(createEmptyFormState());
    setEditingId(null);
    setFormError(null);
  };

  const createPost = trpc.blog.create.useMutation({
    onMutate: async (newPost: CreateBlogPostInput) => {
      await utils.blog.adminList.cancel();
      const previous = utils.blog.adminList.getData();
      const publishedAt: Date = newPost.publishedAt instanceof Date
        ? newPost.publishedAt
        : new Date();
      const updatedAt: Date = new Date();
      const optimisticPost: AdminBlogPost = {
        id: Date.now() * -1,
        title: newPost.title,
        slug: newPost.slug.toLowerCase(),
        excerpt: newPost.excerpt,
        content: newPost.content,
        author: newPost.author,
        coverImage: newPost.coverImage ?? null,
        isPublished: newPost.isPublished ?? true,
        isFeatured: newPost.isFeatured ?? false,
        publishedAt,
        updatedAt,
        views: 0,
      };

      utils.blog.adminList.setData(undefined, current => [optimisticPost, ...(current ?? [])]);

      return { previous };
    },
    onError: (error, _variables, context) => {
      if (context?.previous) {
        utils.blog.adminList.setData(undefined, context.previous);
      }
      toast.error(error.message ?? "Failed to create blog post");
    },
    onSuccess: () => {
      toast.success("Blog post created");
      resetForm();
    },
    onSettled: () => {
      utils.blog.adminList.invalidate();
    },
  });

  const updatePost = trpc.blog.update.useMutation({
    onMutate: async (variables: RouterInputs["blog"]["update"]) => {
      await utils.blog.adminList.cancel();
      const previous = utils.blog.adminList.getData();

      utils.blog.adminList.setData(undefined, current =>
        (current ?? []).map(post => {
          if (post.id !== variables.id) return post;

          const next: AdminBlogPost = { ...post, updatedAt: new Date() };
          const { data } = variables;

          if (data.title !== undefined) next.title = data.title;
          if (data.slug !== undefined) next.slug = data.slug.toLowerCase();
          if (data.excerpt !== undefined) next.excerpt = data.excerpt;
          if (data.content !== undefined) next.content = data.content;
          if (data.author !== undefined) next.author = data.author;
          if (data.coverImage !== undefined) {
            next.coverImage = data.coverImage ? data.coverImage : null;
          }
          if (data.isPublished !== undefined) next.isPublished = data.isPublished;
          if (data.isFeatured !== undefined) next.isFeatured = data.isFeatured;
          if (data.publishedAt instanceof Date) {
            next.publishedAt = data.publishedAt;
          }
          if (data.views !== undefined) next.views = data.views;

          return next;
        })
      );

      return { previous };
    },
    onError: (error, _variables, context) => {
      if (context?.previous) {
        utils.blog.adminList.setData(undefined, context.previous);
      }
      toast.error(error.message ?? "Failed to update blog post");
    },
    onSuccess: () => {
      toast.success("Blog post updated");
      resetForm();
    },
    onSettled: () => {
      utils.blog.adminList.invalidate();
    },
  });

  const deletePost = trpc.blog.delete.useMutation({
    onMutate: async variables => {
      await utils.blog.adminList.cancel();
      const previous = utils.blog.adminList.getData();

      utils.blog.adminList.setData(
        undefined,
        current => (current ?? []).filter(post => post.id !== variables.id)
      );

      return { previous };
    },
    onError: (error, _variables, context) => {
      if (context?.previous) {
        utils.blog.adminList.setData(undefined, context.previous);
      }
      toast.error(error.message ?? "Failed to delete blog post");
    },
    onSettled: () => {
      utils.blog.adminList.invalidate();
    },
  });

  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedToken = loginToken.trim();
    if (!trimmedToken) {
      setAuthError("Token is required");
      return;
    }

    saveToken(trimmedToken);
    setAuthError(null);
    await postsQuery.refetch();
  };

  const handleEdit = (post: AdminBlogPost) => {
    setEditingId(post.id);
    setFormState({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      coverImage: post.coverImage ?? "",
      publishedAt: formatDateForInput(post.publishedAt),
      isPublished: post.isPublished,
      isFeatured: post.isFeatured,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (post: AdminBlogPost) => {
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) {
      return;
    }

    deletePost.mutate(
      { id: post.id },
      {
        onSuccess: () => {
          toast.success("Blog post deleted");
          if (editingId === post.id) {
            resetForm();
          }
        },
      }
    );
  };

  const buildPayload = (): CreateBlogPostInput => {
    const publishedAt: Date | undefined = formState.publishedAt
      ? new Date(formState.publishedAt)
      : undefined;

    return {
      title: formState.title.trim(),
      slug: formState.slug.trim(),
      excerpt: formState.excerpt.trim(),
      content: formState.content.trim(),
      author: formState.author.trim(),
      coverImage: formState.coverImage.trim() || undefined,
      isPublished: formState.isPublished,
      isFeatured: formState.isFeatured,
      publishedAt,
    };
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (formState.publishedAt) {
      const parsed = new Date(formState.publishedAt);
      if (Number.isNaN(parsed.getTime())) {
        setFormError("Publish date is invalid.");
        return;
      }
    }

    const payload = buildPayload();

    if (
      !payload.title ||
      !payload.slug ||
      !payload.excerpt ||
      !payload.content ||
      !payload.author
    ) {
      setFormError("All fields except cover image and published at are required.");
      return;
    }

    const normalizedPayload: CreateBlogPostInput = {
      ...payload,
      slug: payload.slug.toLowerCase(),
    };

    if (editingId) {
      const updatePayload: UpdateBlogPostInput = { ...normalizedPayload };
      updatePost.mutate({ id: editingId, data: updatePayload });
    } else {
      createPost.mutate(normalizedPayload);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md p-8 space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold text-secondary">Admin Login</h1>
            <p className="text-sm text-muted-foreground">
              Enter the admin token to access the management tools.
            </p>
          </div>
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-secondary" htmlFor="admin-token">
                Admin token
              </label>
              <Input
                id="admin-token"
                type="password"
                value={loginToken}
                onChange={event => setLoginToken(event.target.value)}
                placeholder="Paste the shared token"
                required
              />
            </div>
            {authError && <p className="text-sm text-red-500">{authError}</p>}
            <Button type="submit" className="w-full" disabled={postsQuery.isLoading}>
              {postsQuery.isLoading ? "Checking token..." : "Sign in"}
            </Button>
          </form>
          <Link href="/" className="block text-center text-sm text-muted-foreground hover:text-secondary">
            ← Back to site
          </Link>
        </Card>
      </div>
    );
  }

  const isProcessing = createPost.isPending || updatePost.isPending;

  return (
    <div className="min-h-screen bg-muted/20 py-10">
      <div className="container mx-auto px-4 space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-secondary">Blog Admin</h1>
            <p className="text-sm text-muted-foreground">
              Manage blog posts, publish updates and review existing content.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/">← Back to site</Link>
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                clearToken();
                resetForm();
                setLoginToken("");
              }}
            >
              Log out
            </Button>
          </div>
        </header>

        <Card className="p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-secondary">
              {editingId ? "Edit blog post" : "Create a new blog post"}
            </h2>
            <p className="text-sm text-muted-foreground">
              All fields are required unless marked optional.
            </p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary" htmlFor="title">
                  Title
                </label>
                <Input
                  id="title"
                  value={formState.title}
                  onChange={event => setFormState(prev => ({ ...prev, title: event.target.value }))}
                  placeholder="Write a catchy headline"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary" htmlFor="slug">
                  Slug
                </label>
                <Input
                  id="slug"
                  value={formState.slug}
                  onChange={event => setFormState(prev => ({ ...prev, slug: event.target.value }))}
                  placeholder="post-slug"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-secondary" htmlFor="excerpt">
                Excerpt
              </label>
              <Textarea
                id="excerpt"
                value={formState.excerpt}
                onChange={event => setFormState(prev => ({ ...prev, excerpt: event.target.value }))}
                rows={3}
                placeholder="Short summary that appears on the blog listing"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-secondary" htmlFor="content">
                Content
              </label>
              <Textarea
                id="content"
                value={formState.content}
                onChange={event => setFormState(prev => ({ ...prev, content: event.target.value }))}
                rows={8}
                placeholder="Markdown or HTML content"
                required
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary" htmlFor="author">
                  Author
                </label>
                <Input
                  id="author"
                  value={formState.author}
                  onChange={event => setFormState(prev => ({ ...prev, author: event.target.value }))}
                  placeholder="Author name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary" htmlFor="coverImage">
                  Cover image URL (optional)
                </label>
                <Input
                  id="coverImage"
                  value={formState.coverImage}
                  onChange={event => setFormState(prev => ({ ...prev, coverImage: event.target.value }))}
                  placeholder="https://example.com/cover.png"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="flex items-center gap-2 text-sm font-medium text-secondary">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={formState.isPublished}
                  onChange={event => setFormState(prev => ({ ...prev, isPublished: event.target.checked }))}
                />
                Published
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-secondary">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={formState.isFeatured}
                  onChange={event => setFormState(prev => ({ ...prev, isFeatured: event.target.checked }))}
                />
                Featured
              </label>
              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary" htmlFor="publishedAt">
                  Publish at (optional)
                </label>
                <Input
                  id="publishedAt"
                  type="datetime-local"
                  value={formState.publishedAt}
                  onChange={event => setFormState(prev => ({ ...prev, publishedAt: event.target.value }))}
                />
              </div>
            </div>
            {formError && <p className="text-sm text-red-500">{formError}</p>}
            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" disabled={isProcessing}>
                {editingId
                  ? isProcessing
                    ? "Saving..."
                    : "Update post"
                  : isProcessing
                  ? "Publishing..."
                  : "Publish post"}
              </Button>
              {editingId && (
                <Button type="button" variant="ghost" onClick={resetForm} disabled={isProcessing}>
                  Cancel edit
                </Button>
              )}
            </div>
          </form>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-secondary">Posts</h2>
              <p className="text-sm text-muted-foreground">
                {posts.length} {posts.length === 1 ? "entry" : "entries"} total
              </p>
            </div>
            <Button variant="outline" onClick={() => postsQuery.refetch()} disabled={postsQuery.isRefetching}>
              {postsQuery.isRefetching ? "Refreshing..." : "Refresh"}
            </Button>
          </div>

          {postsQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading posts...</p>
          ) : posts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No posts yet. Start by creating a new one above.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="py-2 pr-4 font-medium text-secondary">Title</th>
                    <th className="py-2 pr-4 font-medium text-secondary">Slug</th>
                    <th className="py-2 pr-4 font-medium text-secondary">Status</th>
                    <th className="py-2 pr-4 font-medium text-secondary">Updated</th>
                    <th className="py-2 pr-4 font-medium text-secondary">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {posts.map(post => {
                    const isDeleting = deletePost.isPending && deletePost.variables?.id === post.id;
                    const isEditing = editingId === post.id;
                    return (
                      <tr key={post.id} className={isEditing ? "bg-muted/40" : undefined}>
                        <td className="py-3 pr-4">
                          <div className="font-medium text-secondary">{post.title}</div>
                          <div className="text-xs text-muted-foreground">By {post.author}</div>
                        </td>
                        <td className="py-3 pr-4 text-muted-foreground">{post.slug}</td>
                        <td className="py-3 pr-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              post.isPublished ? "bg-emerald-100 text-emerald-700" : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {post.isPublished ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-muted-foreground">
                          {formatDateForDisplay(post.updatedAt)}
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex flex-wrap gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEdit(post)}>
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(post)}
                              disabled={isDeleting}
                            >
                              {isDeleting ? "Deleting..." : "Delete"}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

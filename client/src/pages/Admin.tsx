import type { ChangeEvent, FormEvent } from "react";
import { useMemo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminToken } from "@/hooks/useAdminToken";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const ADMIN_FILES_QUERY_KEY = ["admin-files"] as const;

interface AdminFileMetadata {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  sha256: string;
  uploadedBy: string | null;
  createdAt: string | null;
  url: string;
}

interface UploadResponse {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  sha256: string;
}

function formatFileSize(bytes: number) {
  if (!Number.isFinite(bytes)) return "–";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function buildAuthorizationHeaders(token: string, headers?: HeadersInit) {
  const result = new Headers(headers);
  result.set("Authorization", `Bearer ${token}`);
  return result;
}

export default function Admin() {
  const { token, isAuthenticated, saveToken, clearToken } = useAdminToken();
  const [tokenDraft, setTokenDraft] = useState(token ?? "");
  const [blogPostIdInput, setBlogPostIdInput] = useState("");
  const [projectIdInput, setProjectIdInput] = useState("");
  const queryClient = useQueryClient();

  const adminFetch = useCallback(
    async (path: string, init?: RequestInit) => {
      if (!token) {
        throw new Error("Missing admin token");
      }

      const response = await fetch(path, {
        ...init,
        headers: buildAuthorizationHeaders(token, init?.headers),
      });

      if (!response.ok) {
        const fallbackMessage = `Request failed (${response.status})`;
        const payload = await response.json().catch(() => null);
        const message = typeof payload?.error === "string" ? payload.error : fallbackMessage;
        const error = new Error(message);
        (error as Error & { status?: number }).status = response.status;
        throw error;
      }

      return response;
    },
    [token]
  );

  const filesQuery = useQuery({
    queryKey: ADMIN_FILES_QUERY_KEY,
    enabled: isAuthenticated,
    queryFn: async () => {
      const response = await adminFetch("/api/admin/files");
      return (await response.json()) as AdminFileMetadata[];
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const results: UploadResponse[] = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        const response = await adminFetch("/api/admin/uploads", {
          method: "POST",
          body: formData,
        });
        results.push((await response.json()) as UploadResponse);
      }
      return results;
    },
    onSuccess: results => {
      if (results.length > 0) {
        toast.success(`Uploaded ${results.length} file${results.length === 1 ? "" : "s"}`);
      }
      queryClient.invalidateQueries({ queryKey: ADMIN_FILES_QUERY_KEY });
    },
    onError: error => {
      toast.error((error as Error).message);
    },
  });

  const attachBlogMutation = useMutation({
    mutationFn: async ({ fileId, blogPostId }: { fileId: string; blogPostId: number }) => {
      await adminFetch(`/api/admin/blog-posts/${blogPostId}/files`, {
        method: "POST",
        headers: buildAuthorizationHeaders(token!, { "Content-Type": "application/json" }),
        body: JSON.stringify({ fileId }),
      });
    },
    onSuccess: () => {
      toast.success("Attached file to blog post");
    },
    onError: error => {
      toast.error((error as Error).message);
    },
  });

  const attachProjectMutation = useMutation({
    mutationFn: async ({ fileId, projectId }: { fileId: string; projectId: number }) => {
      await adminFetch(`/api/admin/projects/${projectId}/files`, {
        method: "POST",
        headers: buildAuthorizationHeaders(token!, { "Content-Type": "application/json" }),
        body: JSON.stringify({ fileId }),
      });
    },
    onSuccess: () => {
      toast.success("Attached file to project");
    },
    onError: error => {
      toast.error((error as Error).message);
    },
  });

  const blogCoverMutation = useMutation({
    mutationFn: async ({ fileId, blogPostId }: { fileId: string | null; blogPostId: number }) => {
      await adminFetch(`/api/admin/blog-posts/${blogPostId}/cover`, {
        method: "PATCH",
        headers: buildAuthorizationHeaders(token!, { "Content-Type": "application/json" }),
        body: JSON.stringify({ fileId }),
      });
    },
    onSuccess: () => {
      toast.success("Updated blog post cover");
      queryClient.invalidateQueries({ queryKey: ADMIN_FILES_QUERY_KEY });
    },
    onError: error => {
      toast.error((error as Error).message);
    },
  });

  const projectCoverMutation = useMutation({
    mutationFn: async ({ fileId, projectId }: { fileId: string | null; projectId: number }) => {
      await adminFetch(`/api/admin/projects/${projectId}/cover`, {
        method: "PATCH",
        headers: buildAuthorizationHeaders(token!, { "Content-Type": "application/json" }),
        body: JSON.stringify({ fileId }),
      });
    },
    onSuccess: () => {
      toast.success("Updated project cover");
      queryClient.invalidateQueries({ queryKey: ADMIN_FILES_QUERY_KEY });
    },
    onError: error => {
      toast.error((error as Error).message);
    },
  });

  const handleTokenSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!tokenDraft.trim()) {
        toast.error("Token is required");
        return;
      }
      saveToken(tokenDraft.trim());
      toast.success("Token saved");
    },
    [saveToken, tokenDraft]
  );

  const handleUploadChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files ? Array.from(event.target.files) : [];
      if (files.length === 0) return;
      await uploadMutation.mutateAsync(files);
      event.target.value = "";
    },
    [uploadMutation]
  );

  const files = filesQuery.data ?? [];

  const blogPostId = useMemo(() => {
    const parsed = Number.parseInt(blogPostIdInput, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }, [blogPostIdInput]);

  const projectId = useMemo(() => {
    const parsed = Number.parseInt(projectIdInput, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }, [projectIdInput]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Access</CardTitle>
            <CardDescription>Enter the admin token to manage media assets.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleTokenSubmit}>
              <div className="space-y-2">
                <Label htmlFor="admin-token">Admin token</Label>
                <Input
                  id="admin-token"
                  type="password"
                  value={tokenDraft}
                  onChange={event => setTokenDraft(event.target.value)}
                  placeholder="••••••"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Save token
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="container mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Media Library</h1>
            <p className="text-muted-foreground">Upload files, attach them to content, and manage cover media.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Token saved • {token?.slice(0, 4)}…
            </span>
            <Button variant="outline" onClick={clearToken}>
              Sign out
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload media</CardTitle>
            <CardDescription>Supported types: PNG, JPEG, WEBP, GIF, MP4, WEBM (up to 50 MB).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="file"
              multiple
              accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm"
              onChange={handleUploadChange}
              disabled={uploadMutation.isPending}
            />
            {uploadMutation.isPending && (
              <p className="text-sm text-muted-foreground">Uploading…</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Link media</CardTitle>
            <CardDescription>Attach uploaded files to blog posts or projects and update cover images.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <Label htmlFor="blog-post-id">Blog post ID</Label>
              <Input
                id="blog-post-id"
                placeholder="e.g. 1"
                value={blogPostIdInput}
                onChange={event => setBlogPostIdInput(event.target.value)}
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="project-id">Project ID</Label>
              <Input
                id="project-id"
                placeholder="e.g. 1"
                value={projectIdInput}
                onChange={event => setProjectIdInput(event.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Uploaded files</CardTitle>
            <CardDescription>
              {filesQuery.isLoading
                ? "Loading files…"
                : files.length === 0
                  ? "No files uploaded yet."
                  : "Preview and manage uploaded media."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Preview</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>SHA-256</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map(file => {
                  const previewUrl = file.url;
                  const isImage = file.mimeType.startsWith("image/");
                  const isVideo = file.mimeType.startsWith("video/");

                  return (
                    <TableRow key={file.id}>
                      <TableCell>
                        <div className="h-20 w-24 overflow-hidden rounded-md bg-muted flex items-center justify-center">
                          {isImage ? (
                            <img
                              src={previewUrl}
                              alt={file.filename}
                              className="h-full w-full object-cover"
                            />
                          ) : isVideo ? (
                            <video
                              src={previewUrl}
                              className="h-full w-full object-cover"
                              controls
                              preload="metadata"
                            />
                          ) : (
                            <span className="text-xs text-muted-foreground">No preview</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">{file.filename}</span>
                          <span className="text-xs text-muted-foreground">{file.createdAt ? new Date(file.createdAt).toLocaleString() : ""}</span>
                        </div>
                      </TableCell>
                      <TableCell>{file.mimeType}</TableCell>
                      <TableCell>{formatFileSize(file.size)}</TableCell>
                      <TableCell className="font-mono text-xs">{file.sha256.slice(0, 12)}…</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            disabled={!blogPostId || attachBlogMutation.isPending}
                            onClick={() => {
                              if (!blogPostId) {
                                toast.error("Enter a blog post ID first");
                                return;
                              }
                              attachBlogMutation.mutate({ fileId: file.id, blogPostId });
                            }}
                          >
                            Attach to post
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            disabled={!projectId || attachProjectMutation.isPending}
                            onClick={() => {
                              if (!projectId) {
                                toast.error("Enter a project ID first");
                                return;
                              }
                              attachProjectMutation.mutate({ fileId: file.id, projectId });
                            }}
                          >
                            Attach to project
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={!blogPostId || blogCoverMutation.isPending}
                            onClick={() => {
                              if (!blogPostId) {
                                toast.error("Enter a blog post ID first");
                                return;
                              }
                              blogCoverMutation.mutate({ fileId: file.id, blogPostId });
                            }}
                          >
                            Set blog cover
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={!projectId || projectCoverMutation.isPending}
                            onClick={() => {
                              if (!projectId) {
                                toast.error("Enter a project ID first");
                                return;
                              }
                              projectCoverMutation.mutate({ fileId: file.id, projectId });
                            }}
                          >
                            Set project cover
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={!blogPostId || blogCoverMutation.isPending}
                            onClick={() => {
                              if (!blogPostId) {
                                toast.error("Enter a blog post ID first");
                                return;
                              }
                              blogCoverMutation.mutate({ fileId: null, blogPostId });
                            }}
                          >
                            Clear blog cover
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={!projectId || projectCoverMutation.isPending}
                            onClick={() => {
                              if (!projectId) {
                                toast.error("Enter a project ID first");
                                return;
                              }
                              projectCoverMutation.mutate({ fileId: null, projectId });
                            }}
                          >
                            Clear project cover
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

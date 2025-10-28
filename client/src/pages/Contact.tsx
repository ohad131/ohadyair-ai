import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const submitMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      toast.success("ההודעה נשלחה בהצלחה!", {
        description: "נחזור אליך בהקדם האפשרי",
      });
      setFormData({ name: "", email: "", phone: "", message: "" });
    },
    onError: (error) => {
      toast.error("שגיאה בשליחת ההודעה", {
        description: error.message || "אנא נסה שוב מאוחר יותר",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Background gradient effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute w-[467px] h-[765px] right-[20%] top-[15%] bg-gradient-to-b from-[#2bffff]/20 to-[#2bffff]/0 blur-[40px] rotate-[25deg]" />
        <div className="absolute w-[406px] h-[783px] right-[25%] top-[10%] bg-gradient-to-b from-[#2bffff]/25 to-[#2bffff]/0 blur-[20px] rotate-[25deg]" />
      </div>

      <div className="relative z-10 isolation-isolate container mx-auto px-20 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-4">צור קשר</h1>
            <p className="text-lg text-[#cee0e0]">
              מוזמנים ליצור קשר לשיחת ייעוץ ראשונית ללא התחייבות
            </p>
          </div>

          <Card className="p-8 bg-card/50 border-border/50 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-white mb-2"
                >
                  שם מלא *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg text-white placeholder-[#a7bdbd] focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="הכנס את שמך המלא"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-white mb-2"
                >
                  אימייל *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg text-white placeholder-[#a7bdbd] focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-white mb-2"
                >
                  טלפון
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg text-white placeholder-[#a7bdbd] focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="050-1234567"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-white mb-2"
                >
                  הודעה *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg text-white placeholder-[#a7bdbd] focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="ספר לי על הפרויקט שלך..."
                  required
                  minLength={10}
                />
              </div>

              <Button
                type="submit"
                disabled={submitMutation.isPending}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitMutation.isPending ? "שולח..." : "שלח הודעה"}
              </Button>
            </form>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-[#a7bdbd] mb-4">או צור קשר ישירות:</p>
            <div className="flex justify-center gap-6">
              <a
                href="mailto:ohadyair.ai@gmail.com"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                ohadyair.ai@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


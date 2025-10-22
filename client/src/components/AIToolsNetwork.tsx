import { useEffect, useRef, useState } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  name: string;
  color: string;
  width: number;
  height: number;
  rotation: number;
  rotationSpeed: number;
}

const AI_TOOLS = [
  { name: "n8n", color: "239, 75, 113" },
  { name: "Activepieces", color: "123, 92, 255" },
  { name: "Lovable", color: "255, 107, 157" },
  { name: "Bolt", color: "255, 184, 0" },
  { name: "ChatGPT", color: "16, 163, 127" },
  { name: "Gemini", color: "66, 133, 244" },
  { name: "Grok", color: "139, 92, 246" },
  { name: "Claude", color: "217, 119, 87" },
  { name: "Perplexity", color: "32, 128, 141" },
  { name: "Copilot", color: "94, 92, 230" },
  { name: "Base44", color: "245, 158, 11" },
  { name: "Midjourney", color: "0, 188, 212" },
  { name: "Kling", color: "236, 72, 153" },
];

export default function AIToolsNetwork() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return; // Skip animation on mobile

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Initialize nodes with slow consistent velocities
    nodesRef.current = AI_TOOLS.map((tool) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.3 + Math.random() * 0.2;
      return {
        x: Math.random() * (width - 200) + 100,
        y: Math.random() * (height - 100) + 50,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        name: tool.name,
        color: tool.color,
        width: 100 + Math.random() * 30,
        height: 50 + Math.random() * 15,
        rotation: (Math.random() - 0.5) * 5,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
      };
    });

    // Animation loop
    const animate = () => {
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Update nodes
      nodesRef.current.forEach((node, i) => {
        // Update position with constant velocity
        node.x += node.vx;
        node.y += node.vy;
        node.rotation += node.rotationSpeed;

        // Bounce off edges
        const halfWidth = node.width / 2;
        const halfHeight = node.height / 2;

        if (node.x < halfWidth || node.x > width - halfWidth) {
          node.vx *= -1;
          node.x = Math.max(halfWidth, Math.min(width - halfWidth, node.x));
        }
        if (node.y < halfHeight || node.y > height - halfHeight) {
          node.vy *= -1;
          node.y = Math.max(halfHeight, Math.min(height - halfHeight, node.y));
        }

        // Check collisions
        nodesRef.current.slice(i + 1).forEach((otherNode) => {
          const dx = otherNode.x - node.x;
          const dy = otherNode.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = Math.max(node.width, node.height) / 2 + Math.max(otherNode.width, otherNode.height) / 2 + 20;

          if (distance < minDistance && distance > 0) {
            // Elastic collision
            const angle = Math.atan2(dy, dx);
            const sin = Math.sin(angle);
            const cos = Math.cos(angle);

            const vx1 = node.vx * cos + node.vy * sin;
            const vy1 = node.vy * cos - node.vx * sin;
            const vx2 = otherNode.vx * cos + otherNode.vy * sin;
            const vy2 = otherNode.vy * cos - otherNode.vx * sin;

            const finalVx1 = vx2;
            const finalVx2 = vx1;

            node.vx = finalVx1 * cos - vy1 * sin;
            node.vy = vy1 * cos + finalVx1 * sin;
            otherNode.vx = finalVx2 * cos - vy2 * sin;
            otherNode.vy = vy2 * cos + finalVx2 * sin;

            // Separate nodes
            const overlap = minDistance - distance;
            const separateX = (overlap / 2) * cos;
            const separateY = (overlap / 2) * sin;
            node.x -= separateX;
            node.y -= separateY;
            otherNode.x += separateX;
            otherNode.y += separateY;
          }
        });
      });

      // Render
      container.innerHTML = "";

      // Draw connections
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("class", "absolute inset-0 pointer-events-none");
      svg.setAttribute("width", width.toString());
      svg.setAttribute("height", height.toString());

      nodesRef.current.forEach((node, i) => {
        nodesRef.current.slice(i + 1).forEach((otherNode) => {
          const dx = otherNode.x - node.x;
          const dy = otherNode.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 280) {
            const opacity = (1 - distance / 280) * 0.25;
            const gradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
            const gradientId = `grad-${i}-${nodesRef.current.indexOf(otherNode)}`;
            gradient.setAttribute("id", gradientId);
            gradient.innerHTML = `
              <stop offset="0%" style="stop-color:rgb(${node.color});stop-opacity:${opacity}" />
              <stop offset="100%" style="stop-color:rgb(${otherNode.color});stop-opacity:${opacity}" />
            `;
            svg.appendChild(gradient);

            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", node.x.toString());
            line.setAttribute("y1", node.y.toString());
            line.setAttribute("x2", otherNode.x.toString());
            line.setAttribute("y2", otherNode.y.toString());
            line.setAttribute("stroke", `url(#${gradientId})`);
            line.setAttribute("stroke-width", "1");
            svg.appendChild(line);
          }
        });
      });

      container.appendChild(svg);

      // Draw liquid glass nodes
      nodesRef.current.forEach((node) => {
        const nodeEl = document.createElement("div");
        nodeEl.className = "absolute transition-all duration-75";
        nodeEl.style.left = `${node.x - node.width / 2}px`;
        nodeEl.style.top = `${node.y - node.height / 2}px`;
        nodeEl.style.width = `${node.width}px`;
        nodeEl.style.height = `${node.height}px`;
        nodeEl.style.transform = `rotate(${node.rotation}deg)`;
        nodeEl.style.zIndex = "10";

        // Liquid glass effect
        nodeEl.innerHTML = `
          <div class="liquid-glass-tile w-full h-full rounded-2xl backdrop-blur-2xl border flex items-center justify-center px-4 py-2 transition-all duration-300 hover:scale-105 relative overflow-hidden"
               style="
                 background: linear-gradient(135deg, 
                   rgba(${node.color}, 0.15) 0%, 
                   rgba(${node.color}, 0.08) 50%, 
                   rgba(${node.color}, 0.12) 100%);
                 border-color: rgba(${node.color}, 0.25);
                 box-shadow: 
                   0 8px 32px rgba(${node.color}, 0.2),
                   inset 0 1px 0 rgba(255, 255, 255, 0.3),
                   inset 0 -1px 0 rgba(0, 0, 0, 0.1);
               ">
            <div class="absolute inset-0 rounded-2xl" 
                 style="background: linear-gradient(120deg, 
                   transparent 0%, 
                   rgba(255, 255, 255, 0.15) 40%, 
                   rgba(255, 255, 255, 0.25) 50%, 
                   rgba(255, 255, 255, 0.15) 60%, 
                   transparent 100%);
                   transform: translateX(-100%);
                   animation: liquid-shine 8s ease-in-out infinite;">
            </div>
            <div class="text-sm font-bold text-center whitespace-nowrap relative z-10" 
                 style="color: rgb(${node.color}); 
                        text-shadow: 0 1px 2px rgba(0,0,0,0.1);">
              ${node.name}
            </div>
          </div>
        `;

        container.appendChild(nodeEl);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isMobile]);

  // Mobile: Static grid layout
  if (isMobile) {
    return (
      <div className="w-full h-full p-4">
        <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
          {AI_TOOLS.map((tool, index) => (
            <div
              key={index}
              className="liquid-glass-tile rounded-lg backdrop-blur-xl border flex items-center justify-center p-2 relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, 
                  rgba(${tool.color}, 0.15) 0%, 
                  rgba(${tool.color}, 0.08) 50%, 
                  rgba(${tool.color}, 0.12) 100%)`,
                borderColor: `rgba(${tool.color}, 0.25)`,
                boxShadow: `
                  0 4px 16px rgba(${tool.color}, 0.2),
                  inset 0 1px 0 rgba(255, 255, 255, 0.3),
                  inset 0 -1px 0 rgba(0, 0, 0, 0.1)`,
              }}
            >
              <div
                className="absolute inset-0 rounded-lg"
                style={{
                  background: `linear-gradient(120deg, 
                    transparent 0%, 
                    rgba(255, 255, 255, 0.15) 40%, 
                    rgba(255, 255, 255, 0.25) 50%, 
                    rgba(255, 255, 255, 0.15) 60%, 
                    transparent 100%)`,
                  transform: "translateX(-100%)",
                  animation: "liquid-shine 8s ease-in-out infinite",
                  animationDelay: `${index * 0.3}s`,
                }}
              />
              <div
                className="text-xs font-bold text-center relative z-10"
                style={{
                  color: `rgb(${tool.color})`,
                  textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                }}
              >
                {tool.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Desktop: Animated floating tiles
  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  );
}


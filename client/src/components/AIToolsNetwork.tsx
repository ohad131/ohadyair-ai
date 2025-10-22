import { useEffect, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";

interface Node {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  name: string;
  url: string;
  color: string;
  width: number;
  height: number;
  rotation: number;
  rotationSpeed: number;
}

// Check mobile IMMEDIATELY before component renders
const getIsMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
};

export default function AIToolsNetwork() {
  // Initialize with immediate check
  const [isMobile, setIsMobile] = useState(getIsMobile);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const mouseRef = useRef({ x: 0, y: 0 });

  // Fetch AI tools from database
  const { data: aiTools = [] } = trpc.aiTools.list.useQuery();

  useEffect(() => {
    const handleResize = () => {
      const mobile = getIsMobile();
      setIsMobile(mobile);
      
      // Stop animation immediately if switching to mobile
      if (mobile && animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // CRITICAL: Do not start animation on mobile
    if (isMobile || aiTools.length === 0) {
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    container.addEventListener("mousemove", handleMouseMove);

    // Initialize nodes with slow consistent velocities
    nodesRef.current = aiTools.map((tool) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.4 + Math.random() * 0.3;
      return {
        id: tool.id,
        x: Math.random() * (width - 200) + 100,
        y: Math.random() * (height - 100) + 50,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        name: tool.name,
        url: tool.url,
        color: tool.color,
        width: 100 + Math.random() * 30,
        height: 50 + Math.random() * 15,
        rotation: (Math.random() - 0.5) * 5,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
      };
    });

    // Animation loop
    const animate = () => {
      // Double check mobile state during animation
      if (getIsMobile()) {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = undefined;
        }
        return;
      }

      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Update nodes
      nodesRef.current.forEach((node, i) => {
        // Mouse interaction - repel from mouse
        const dx = node.x - mouseRef.current.x;
        const dy = node.y - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const mouseRadius = 150;

        if (distance < mouseRadius && distance > 0) {
          const force = (mouseRadius - distance) / mouseRadius * 0.5;
          node.vx += (dx / distance) * force;
          node.vy += (dy / distance) * force;
        }

        // Apply friction to prevent infinite acceleration
        node.vx *= 0.98;
        node.vy *= 0.98;

        // Ensure minimum speed
        const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
        if (speed < 0.3) {
          const angle = Math.atan2(node.vy, node.vx);
          node.vx = Math.cos(angle) * 0.3;
          node.vy = Math.sin(angle) * 0.3;
        }

        // Update position
        node.x += node.vx;
        node.y += node.vy;
        node.rotation += node.rotationSpeed;

        // Bounce off edges with realistic physics
        const halfWidth = node.width / 2;
        const halfHeight = node.height / 2;

        if (node.x < halfWidth) {
          node.x = halfWidth;
          node.vx = Math.abs(node.vx) * 0.8; // Energy loss on bounce
        }
        if (node.x > width - halfWidth) {
          node.x = width - halfWidth;
          node.vx = -Math.abs(node.vx) * 0.8;
        }
        if (node.y < halfHeight) {
          node.y = halfHeight;
          node.vy = Math.abs(node.vy) * 0.8;
        }
        if (node.y > height - halfHeight) {
          node.y = height - halfHeight;
          node.vy = -Math.abs(node.vy) * 0.8;
        }

        // Check collisions with other nodes
        nodesRef.current.slice(i + 1).forEach((otherNode) => {
          const dx = otherNode.x - node.x;
          const dy = otherNode.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = Math.max(node.width, node.height) / 2 + Math.max(otherNode.width, otherNode.height) / 2 + 20;

          if (distance < minDistance && distance > 0) {
            // Realistic elastic collision
            const angle = Math.atan2(dy, dx);
            const sin = Math.sin(angle);
            const cos = Math.cos(angle);

            // Rotate velocities
            const vx1 = node.vx * cos + node.vy * sin;
            const vy1 = node.vy * cos - node.vx * sin;
            const vx2 = otherNode.vx * cos + otherNode.vy * sin;
            const vy2 = otherNode.vy * cos - otherNode.vx * sin;

            // Swap velocities (elastic collision)
            const finalVx1 = vx2 * 0.9; // Energy loss
            const finalVx2 = vx1 * 0.9;

            // Rotate back
            node.vx = finalVx1 * cos - vy1 * sin;
            node.vy = vy1 * cos + finalVx1 * sin;
            otherNode.vx = finalVx2 * cos - vy2 * sin;
            otherNode.vy = vy2 * cos + finalVx2 * sin;

            // Separate nodes to prevent overlap
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

      // Draw liquid glass nodes (clickable)
      nodesRef.current.forEach((node) => {
        const nodeEl = document.createElement("a");
        nodeEl.href = node.url;
        nodeEl.target = "_blank";
        nodeEl.rel = "noopener noreferrer";
        nodeEl.className = "absolute transition-all duration-75 cursor-pointer";
        nodeEl.style.left = `${node.x - node.width / 2}px`;
        nodeEl.style.top = `${node.y - node.height / 2}px`;
        nodeEl.style.width = `${node.width}px`;
        nodeEl.style.height = `${node.height}px`;
        nodeEl.style.transform = `rotate(${node.rotation}deg)`;
        nodeEl.style.zIndex = "10";

        // Liquid glass effect
        nodeEl.innerHTML = `
          <div class="liquid-glass-tile w-full h-full rounded-2xl backdrop-blur-2xl border flex items-center justify-center px-4 py-2 transition-all duration-300 hover:scale-110 hover:shadow-2xl relative overflow-hidden"
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
      container.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
    };
  }, [isMobile, aiTools]);

  // Mobile: Static grid layout ONLY - return early
  if (isMobile) {
    return (
      <div className="w-full py-6">
        <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto px-4">
          {aiTools.map((tool, index) => (
            <a
              key={tool.id}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="liquid-glass-tile rounded-xl backdrop-blur-xl border flex items-center justify-center py-3 px-2 relative overflow-hidden hover:scale-105 transition-transform"
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
                className="absolute inset-0 rounded-xl"
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
            </a>
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


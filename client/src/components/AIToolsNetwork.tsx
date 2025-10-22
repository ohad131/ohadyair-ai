import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  name: string;
  color: string;
  size: number;
  glow: number;
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
  { name: "DeepSeek", color: "99, 102, 241" },
  { name: "Manus", color: "139, 92, 246" },
  { name: "Perplexity", color: "32, 128, 141" },
  { name: "Copilot", color: "94, 92, 230" },
  { name: "Base44", color: "245, 158, 11" },
  { name: "Midjourney", color: "0, 188, 212" },
  { name: "Kling", color: "236, 72, 153" },
  { name: "ElevenLabs", color: "124, 58, 237" },
  { name: "Suno", color: "16, 185, 129" },
];

export default function AIToolsNetwork() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Initialize nodes with better spacing
    nodesRef.current = AI_TOOLS.map((tool, index) => {
      const angle = (index / AI_TOOLS.length) * Math.PI * 2;
      const radius = Math.min(width, height) * 0.25;
      return {
        x: width / 2 + Math.cos(angle) * radius + (Math.random() - 0.5) * 100,
        y: height / 2 + Math.sin(angle) * radius + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
        name: tool.name,
        color: tool.color,
        size: 70 + Math.random() * 20,
        glow: 0,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1,
      };
    });

    // Animation loop
    const animate = () => {
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Update nodes
      nodesRef.current.forEach((node, i) => {
        // Update position
        node.x += node.vx;
        node.y += node.vy;
        node.rotation += node.rotationSpeed;

        // Bounce off edges with glow
        if (node.x < node.size / 2 || node.x > width - node.size / 2) {
          node.vx *= -0.9;
          node.x = Math.max(node.size / 2, Math.min(width - node.size / 2, node.x));
          node.glow = 1;
        }
        if (node.y < node.size / 2 || node.y > height - node.size / 2) {
          node.vy *= -0.9;
          node.y = Math.max(node.size / 2, Math.min(height - node.size / 2, node.y));
          node.glow = 1;
        }

        // Check collisions with other nodes
        nodesRef.current.slice(i + 1).forEach((otherNode) => {
          const dx = otherNode.x - node.x;
          const dy = otherNode.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = (node.size + otherNode.size) / 2 + 10;

          if (distance < minDistance) {
            // Collision - bounce with ripple effect
            const angle = Math.atan2(dy, dx);
            const targetX = node.x + Math.cos(angle) * minDistance;
            const targetY = node.y + Math.sin(angle) * minDistance;

            const ax = (targetX - otherNode.x) * 0.08;
            const ay = (targetY - otherNode.y) * 0.08;

            node.vx -= ax;
            node.vy -= ay;
            otherNode.vx += ax;
            otherNode.vy += ay;

            // Strong glow on collision
            node.glow = 1.5;
            otherNode.glow = 1.5;
          }
        });

        // Decay glow
        node.glow *= 0.92;

        // Friction
        node.vx *= 0.995;
        node.vy *= 0.995;
      });

      // Render
      container.innerHTML = "";

      // Draw connections first (behind nodes)
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("class", "absolute inset-0 pointer-events-none");
      svg.setAttribute("width", width.toString());
      svg.setAttribute("height", height.toString());

      nodesRef.current.forEach((node, i) => {
        nodesRef.current.slice(i + 1).forEach((otherNode) => {
          const dx = otherNode.x - node.x;
          const dy = otherNode.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 250) {
            const opacity = (1 - distance / 250) * 0.4;
            const gradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
            const gradientId = `gradient-${i}-${nodesRef.current.indexOf(otherNode)}`;
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
            line.setAttribute("stroke-width", "2");
            svg.appendChild(line);
          }
        });
      });

      container.appendChild(svg);

      // Draw nodes on top
      nodesRef.current.forEach((node) => {
        const nodeEl = document.createElement("div");
        nodeEl.className = "absolute transition-all duration-100";
        nodeEl.style.left = `${node.x - node.size / 2}px`;
        nodeEl.style.top = `${node.y - node.size / 2}px`;
        nodeEl.style.width = `${node.size}px`;
        nodeEl.style.height = `${node.size}px`;
        nodeEl.style.transform = `rotate(${node.rotation}deg)`;
        nodeEl.style.zIndex = "10";

        const glowIntensity = Math.min(1, 0.4 + node.glow * 0.6);
        const bgOpacity = 0.12 + node.glow * 0.08;

        nodeEl.innerHTML = `
          <div class="w-full h-full rounded-2xl backdrop-blur-xl border-2 flex flex-col items-center justify-center p-3 transition-all duration-300 hover:scale-110"
               style="
                 background: rgba(${node.color}, ${bgOpacity});
                 border-color: rgba(${node.color}, ${0.3 + node.glow * 0.4});
                 box-shadow: 
                   0 10px 40px rgba(${node.color}, ${glowIntensity * 0.5}),
                   inset 0 2px 4px rgba(255, 255, 255, 0.3),
                   0 0 ${30 + node.glow * 50}px rgba(${node.color}, ${glowIntensity * 0.8}),
                   inset 0 -2px 4px rgba(0, 0, 0, 0.1);
               ">
            <div class="text-xs font-bold text-center leading-tight" style="color: rgb(${node.color}); text-shadow: 0 0 10px rgba(${node.color}, 0.8);">
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
  }, []);

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-secondary/5">
      {/* Title overlay - above everything */}
      <div className="absolute top-6 left-0 right-0 z-50 text-center px-4">
        <div className="inline-block glass-dark px-6 py-4 rounded-2xl backdrop-blur-xl border border-white/20">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
            מתמחה בשילוב הכלים המתקדמים ביותר
          </h3>
          <p className="text-xs md:text-sm text-white/80">
            17+ פלטפורמות AI ואוטומציה בשליטה מלאה
          </p>
        </div>
      </div>

      {/* Animated nodes container */}
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  );
}


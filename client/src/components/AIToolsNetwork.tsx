import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  name: string;
  color: string;
  width: number;
  height: number;
  glow: number;
  rotation: number;
  rotationSpeed: number;
  wobble: number;
  ripple: number;
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

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Initialize nodes with SLOW consistent velocities
    nodesRef.current = AI_TOOLS.map((tool) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.3 + Math.random() * 0.2; // Very slow speed
      return {
        x: Math.random() * (width - 200) + 100,
        y: Math.random() * (height - 100) + 50,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        name: tool.name,
        color: tool.color,
        width: 100 + Math.random() * 30,
        height: 50 + Math.random() * 15,
        glow: 0,
        rotation: (Math.random() - 0.5) * 5,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        wobble: 0,
        ripple: 0,
      };
    });

    // Animation loop
    const animate = () => {
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Update nodes
      nodesRef.current.forEach((node, i) => {
        // Update position with CONSTANT velocity
        node.x += node.vx;
        node.y += node.vy;
        node.rotation += node.rotationSpeed;

        // Bounce off edges - maintain speed
        const halfWidth = node.width / 2;
        const halfHeight = node.height / 2;

        if (node.x < halfWidth || node.x > width - halfWidth) {
          node.vx *= -1; // Perfect elastic collision
          node.x = Math.max(halfWidth, Math.min(width - halfWidth, node.x));
          node.glow = 1;
          node.wobble = 0.8;
          node.ripple = 0.8;
        }
        if (node.y < halfHeight || node.y > height - halfHeight) {
          node.vy *= -1; // Perfect elastic collision
          node.y = Math.max(halfHeight, Math.min(height - halfHeight, node.y));
          node.glow = 1;
          node.wobble = 0.8;
          node.ripple = 0.8;
        }

        // Check collisions
        nodesRef.current.slice(i + 1).forEach((otherNode) => {
          const dx = otherNode.x - node.x;
          const dy = otherNode.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = Math.max(node.width, node.height) / 2 + Math.max(otherNode.width, otherNode.height) / 2 + 20;

          if (distance < minDistance && distance > 0) {
            // Elastic collision - preserve energy
            const angle = Math.atan2(dy, dx);
            const sin = Math.sin(angle);
            const cos = Math.cos(angle);

            // Rotate velocities
            const vx1 = node.vx * cos + node.vy * sin;
            const vy1 = node.vy * cos - node.vx * sin;
            const vx2 = otherNode.vx * cos + otherNode.vy * sin;
            const vy2 = otherNode.vy * cos - otherNode.vx * sin;

            // Swap velocities (elastic collision)
            const finalVx1 = vx2;
            const finalVx2 = vx1;

            // Rotate back
            node.vx = finalVx1 * cos - vy1 * sin;
            node.vy = vy1 * cos + finalVx1 * sin;
            otherNode.vx = finalVx2 * cos - vy2 * sin;
            otherNode.vy = vy2 * cos + finalVx2 * sin;

            // Separate nodes to prevent sticking
            const overlap = minDistance - distance;
            const separateX = (overlap / 2) * cos;
            const separateY = (overlap / 2) * sin;
            node.x -= separateX;
            node.y -= separateY;
            otherNode.x += separateX;
            otherNode.y += separateY;

            // Wobble-ripple effect
            node.glow = 1.2;
            otherNode.glow = 1.2;
            node.wobble = 1;
            otherNode.wobble = 1;
            node.ripple = 1;
            otherNode.ripple = 1;
          }
        });

        // Decay effects
        node.glow *= 0.92;
        node.wobble *= 0.9;
        node.ripple *= 0.88;

        // NO FRICTION - maintain constant speed
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
            const opacity = (1 - distance / 280) * 0.3;
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
            line.setAttribute("stroke-width", "1.5");
            svg.appendChild(line);
          }
        });
      });

      container.appendChild(svg);

      // Draw nodes
      nodesRef.current.forEach((node) => {
        const nodeEl = document.createElement("div");
        nodeEl.className = "absolute transition-all duration-75";
        nodeEl.style.left = `${node.x - node.width / 2}px`;
        nodeEl.style.top = `${node.y - node.height / 2}px`;
        nodeEl.style.width = `${node.width}px`;
        nodeEl.style.height = `${node.height}px`;
        
        // Wobble effect
        const wobbleX = Math.sin(node.wobble * Math.PI * 3) * node.wobble * 3;
        const wobbleY = Math.cos(node.wobble * Math.PI * 3) * node.wobble * 3;
        nodeEl.style.transform = `rotate(${node.rotation + wobbleX}deg) translate(${wobbleX}px, ${wobbleY}px)`;
        nodeEl.style.zIndex = "10";

        const glowIntensity = Math.min(1.2, 0.35 + node.glow * 0.5);
        const bgOpacity = 0.08 + node.glow * 0.06;
        const rippleScale = 1 + node.ripple * 0.1;

        nodeEl.innerHTML = `
          <div class="w-full h-full rounded-xl backdrop-blur-xl border-2 flex items-center justify-center px-4 py-2 transition-all duration-200 hover:scale-105"
               style="
                 background: rgba(${node.color}, ${bgOpacity});
                 border-color: rgba(${node.color}, ${0.2 + node.glow * 0.3});
                 box-shadow: 
                   0 10px 40px rgba(${node.color}, ${glowIntensity * 0.5}),
                   inset 0 2px 6px rgba(255, 255, 255, 0.2),
                   0 0 ${35 + node.glow * 50}px rgba(${node.color}, ${glowIntensity * 0.8}),
                   inset 0 -2px 6px rgba(0, 0, 0, 0.08);
                 transform: scale(${rippleScale});
               ">
            <div class="text-sm font-bold text-center whitespace-nowrap" 
                 style="color: rgb(${node.color}); 
                        text-shadow: 0 0 10px rgba(${node.color}, 0.8), 0 2px 3px rgba(0,0,0,0.2);">
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
    <div className="relative w-full h-full">
      {/* Animated nodes container - NO BACKGROUND */}
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  );
}


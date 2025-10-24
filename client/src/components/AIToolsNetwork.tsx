import { useEffect, useRef, useState } from "react";

interface Tool {
  id: number;
  name: string;
  url: string;
  color: string;
}

interface Node extends Tool {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  rotation: number;
  element?: HTMLAnchorElement;
}

interface Props {
  tools: Tool[];
}

export default function AIToolsNetwork({ tools }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | undefined>(undefined);
  const [isMobile, setIsMobile] = useState(() => 
    typeof window !== 'undefined' && window.innerWidth < 768
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !tools || tools.length === 0 || isMobile) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Initialize nodes once
    if (nodesRef.current.length === 0) {
      nodesRef.current = tools.map((tool) => ({
        ...tool,
        x: Math.random() * (width - 200) + 100,
        y: Math.random() * (height - 100) + 50,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        width: 120 + Math.random() * 40,
        height: 45 + Math.random() * 10,
        rotation: Math.random() * 10 - 5,
      }));

      // Create DOM elements once
      nodesRef.current.forEach((node) => {
        const nodeEl = document.createElement("a");
        nodeEl.href = node.url;
        nodeEl.target = "_blank";
        nodeEl.rel = "noopener noreferrer";
        nodeEl.className = "absolute transition-none cursor-pointer block";
        nodeEl.style.zIndex = "10";
        nodeEl.style.pointerEvents = "auto";

        nodeEl.innerHTML = `
          <div class="liquid-glass-tile w-full h-full rounded-2xl backdrop-blur-2xl border flex items-center justify-center px-4 py-2 hover:scale-110 hover:shadow-2xl relative overflow-hidden transition-transform duration-300"
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

        node.element = nodeEl;
        container.appendChild(nodeEl);
      });
    }

    // Track mouse
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    container.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    const animate = () => {
      nodesRef.current.forEach((node, i) => {
        // Mouse repulsion (gentle)
        const dx = node.x - mouseRef.current.x;
        const dy = node.y - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const mouseRadius = 150;

        if (distance < mouseRadius && distance > 0) {
          const force = ((mouseRadius - distance) / mouseRadius) * 0.15;
          node.vx += (dx / distance) * force;
          node.vy += (dy / distance) * force;
        }

        // Apply friction
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

        // Bounce off walls
        const halfWidth = node.width / 2;
        const halfHeight = node.height / 2;

        if (node.x < halfWidth) {
          node.x = halfWidth;
          node.vx = Math.abs(node.vx) * 0.8;
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
          const minDistance =
            (Math.max(node.width, node.height) * 0.8) / 2 +
            (Math.max(otherNode.width, otherNode.height) * 0.8) / 2 +
            10;

          if (distance < minDistance && distance > 0) {
            // Elastic collision
            const angle = Math.atan2(dy, dx);
            const targetX = node.x + Math.cos(angle) * minDistance;
            const targetY = node.y + Math.sin(angle) * minDistance;

            const ax = (targetX - otherNode.x) * 0.05;
            const ay = (targetY - otherNode.y) * 0.05;

            node.vx -= ax;
            node.vy -= ay;
            otherNode.vx += ax;
            otherNode.vy += ay;
          }
        });

        // Update DOM element position (not recreating!)
        if (node.element) {
          node.element.style.left = `${node.x - node.width / 2}px`;
          node.element.style.top = `${node.y - node.height / 2}px`;
          node.element.style.width = `${node.width}px`;
          node.element.style.height = `${node.height}px`;
          node.element.style.transform = `rotate(${node.rotation}deg)`;
        }
      });

      // Draw connections (SVG)
      const existingSvg = container.querySelector("svg");
      if (existingSvg) existingSvg.remove();

      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("class", "absolute inset-0 pointer-events-none");
      svg.setAttribute("width", width.toString());
      svg.setAttribute("height", height.toString());
      svg.style.zIndex = "5";

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

      container.insertBefore(svg, container.firstChild);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [tools, isMobile]);

  // Mobile grid view
  if (isMobile) {
    return (
      <div className="w-full px-4 mx-auto grid grid-cols-3 gap-2 max-w-sm overflow-hidden">
        {tools?.map((tool) => (
          <a
            key={tool.id}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-glass-tile rounded-xl backdrop-blur-2xl border flex items-center justify-center px-2 py-3 hover:scale-105 transition-transform duration-300 relative overflow-hidden text-xs font-semibold"
            style={{
              background: `linear-gradient(135deg, 
                rgba(${tool.color}, 0.15) 0%, 
                rgba(${tool.color}, 0.08) 50%, 
                rgba(${tool.color}, 0.12) 100%)`,
              borderColor: `rgba(${tool.color}, 0.25)`,
              boxShadow: `
                0 8px 32px rgba(${tool.color}, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.3),
                inset 0 -1px 0 rgba(0, 0, 0, 0.1)`,
            }}
          >
            <div
              className="absolute inset-0 rounded-2xl"
              style={{
                background: `linear-gradient(120deg, 
                  transparent 0%, 
                  rgba(255, 255, 255, 0.15) 40%, 
                  rgba(255, 255, 255, 0.25) 50%, 
                  rgba(255, 255, 255, 0.15) 60%, 
                  transparent 100%)`,
                transform: "translateX(-100%)",
                animation: "liquid-shine 8s ease-in-out infinite",
              }}
            />
            <div
              className="text-xs font-bold text-center whitespace-nowrap relative z-10"
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
    );
  }

  return <div ref={containerRef} className="relative w-full h-full" />;
}


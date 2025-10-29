import { useNav } from "@/contexts/NavContext";

export default function MobileMenu() {
  const { isOpen, close } = useNav();
  return (
    <div id="mobile-menu" className={`fixed inset-0 z-[1100] ${isOpen ? "block" : "hidden"}`}>
      <div className="absolute inset-0 bg-black/40" onClick={close} />
      <nav className="absolute inset-y-0 right-0 w-72 max-w-[85vw] bg-white shadow-xl p-4">
        <button onClick={close} className="mb-4">סגור</button>
        {/* TODO: Add real nav items */}
        <ul className="space-y-3">
          <li><a href="/" onClick={close}>דף הבית</a></li>
          <li><a href="/projects" onClick={close}>פרויקטים</a></li>
          <li><a href="/blog" onClick={close}>בלוג</a></li>
          <li><a href="/contact" onClick={close}>צור קשר</a></li>
        </ul>
      </nav>
    </div>
  );
}



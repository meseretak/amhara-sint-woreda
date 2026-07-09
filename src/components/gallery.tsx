"use client";
import { useState, useEffect } from "react";
import { X, Camera, ArrowUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "./animations";

const GALLERY_IMAGES = [
  { src: "https://sfile.chatglm.cn/images-ppt/d57be5c1e89d.jpg", title: "Highland Landscape", category: "Nature" },
  { src: "https://sfile.chatglm.cn/images-ppt/6c328167366f.jpg", title: "Mountain Scenery", category: "Nature" },
  { src: "https://sfile.chatglm.cn/images-ppt/10cf906e32cf.jpg", title: "Community Life", category: "People" },
  { src: "https://sfile.chatglm.cn/images-ppt/4781a70c681c.jpg", title: "Development Progress", category: "Development" },
  { src: "https://sfile.chatglm.cn/images-ppt/30fee1e622be.jpg", title: "Agricultural Fields", category: "Agriculture" },
  { src: "https://sfile.chatglm.cn/images-ppt/56336ff1a645.jpg", title: "Infrastructure", category: "Infrastructure" },
  { src: "https://sfile.chatglm.cn/images-ppt/4db62da31bf6.png", title: "Woreda Vision", category: "Governance" },
  { src: "https://sfile.chatglm.cn/images-ppt/ba8313230e3e.jpg", title: "Administration Building", category: "Governance" },
  { src: "https://sfile.chatglm.cn/images-ppt/634822b7ff39.jpg", title: "Education Activities", category: "Education" },
  { src: "https://sfile.chatglm.cn/images-ppt/5f0a9b467c16.png", title: "Students Learning", category: "Education" },
  { src: "https://sfile.chatglm.cn/images-ppt/e31dc4b12d41.jpg", title: "Farmland", category: "Agriculture" },
  { src: "https://sfile.chatglm.cn/images-ppt/8f5a14b48d88.jpg", title: "Harvest Season", category: "Agriculture" },
  { src: "https://sfile.chatglm.cn/images-ppt/93701603d414.png", title: "Health Services", category: "Health" },
  { src: "https://sfile.chatglm.cn/images-ppt/c452da5a0fb8.png", title: "Health Center", category: "Health" },
  { src: "https://sfile.chatglm.cn/images-ppt/6710c8032383.jpeg", title: "Road Network", category: "Infrastructure" },
  { src: "https://sfile.chatglm.cn/images-ppt/7f04de62e14f.jpg", title: "Town Development", category: "Infrastructure" },
];

export function GalleryPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");
  const categories = ["All", ...Array.from(new Set(GALLERY_IMAGES.map((i) => i.category)))];
  const filtered = filter === "All" ? GALLERY_IMAGES : GALLERY_IMAGES.filter((i) => i.category === filter);
  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="bg-gradient-to-r from-[#0B3D2E] via-[#145A44] to-[#0B3D2E] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-white/50 text-sm mb-2">Home / Gallery</p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">Photo Gallery</h1>
          <Badge className="bg-[#EAB308]/20 text-[#EAB308] border-[#EAB308]/30 text-sm font-medium"><Camera className="w-4 h-4 mr-1.5" />Explore Our Woreda</Badge>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === cat ? "bg-[#0B3D2E] text-white shadow-md" : "bg-white text-[#0B3D2E]/60 hover:bg-[#0B3D2E]/10 border border-gray-200"}`}>{cat}</button>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((img, i) => (
            <AnimatedSection key={img.src} delay={i * 50}>
              <div onClick={() => setSelected(img.src)} className="relative group cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 aspect-square">
                <img src={img.src} alt={img.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  <h3 className="text-white font-bold text-sm">{img.title}</h3>
                  <Badge className="bg-white/20 text-white text-[10px] w-fit mt-1">{img.category}</Badge>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
      {selected && (
        <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <button className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors" onClick={() => setSelected(null)}><X className="w-8 h-8" /></button>
          <img src={selected} alt="Gallery" className="max-w-full max-h-[85vh] rounded-xl shadow-2xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}

export function ScrollToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-[#0B3D2E] hover:bg-[#145A44] text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/10" aria-label="Scroll to top">
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
import { X } from "lucide-react";
import {
  SiReact, SiTypescript, SiTailwindcss, SiVite,
  SiReactrouter, SiAxios,
  SiNodedotjs, SiFastify, SiPrisma, SiMongodb,
  SiFirebase, SiZod,
  SiBiome, SiEslint,
} from "react-icons/si";
import { DayjsIcon } from "../components/icons/DayjsIcon";
import { RechartsIcon } from "../components/icons/RechartsIcon";

interface TechModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const techs = {
  Frontend: [
    { name: "React", icon: <SiReact className="w-8 h-8 text-[#61DAFB]" /> },
    { name: "TypeScript", icon: <SiTypescript className="w-8 h-8 text-[#3178C6]" /> },
    { name: "Tailwind CSS", icon: <SiTailwindcss className="w-8 h-8 text-[#06B6D4]" /> },
    { name: "Vite", icon: <SiVite className="w-8 h-8 text-[#646CFF]" /> },
    { name: "React Router", icon: <SiReactrouter className="w-8 h-8 text-[#CA4245]" /> },
    { name: "Axios", icon: <SiAxios className="w-8 h-8 text-[#5A29E4]" /> },
    { name: "Recharts", icon: <RechartsIcon className="w-8 h-8" /> },
  ],
  Backend: [
    { name: "Node.js", icon: <SiNodedotjs className="w-8 h-8 text-[#339933]" /> },
    { name: "Fastify", icon: <SiFastify className="w-8 h-8 text-white" /> },
    { name: "Prisma", icon: <SiPrisma className="w-8 h-8 text-white" /> },
    { name: "MongoDB", icon: <SiMongodb className="w-8 h-8 text-[#47A248]" /> },
    { name: "Firebase", icon: <SiFirebase className="w-8 h-8 text-[#FFCA28]" /> },
    { name: "Zod", icon: <SiZod className="w-8 h-8 text-[#3E67B1]" /> },
    { name: "Day.js", icon: <DayjsIcon className="w-8 h-8" /> },
  ],
  Ferramentas: [
    { name: "Biome", icon: <SiBiome className="w-8 h-8 text-[#60A5FA]" /> },
    { name: "ESLint", icon: <SiEslint className="w-8 h-8 text-[#4B32C3]" /> },
  ],
};

export function TechModal({ isOpen, onClose }: TechModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-xl bg-gray-800 p-6 shadow-xl border border-gray-700 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Fechar"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold text-white mb-6">Tecnologias Utilizadas</h2>

        <div className="space-y-6">
          {Object.entries(techs).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-primary-500 uppercase mb-3">
                {category}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {items.map((tech) => (
                  <div
                    key={tech.name}
                    className="flex items-center gap-3 rounded-lg bg-gray-900 p-3 border border-gray-700"
                  >
                    {tech.icon}
                    <span className="text-sm font-medium text-gray-200">
                      {tech.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
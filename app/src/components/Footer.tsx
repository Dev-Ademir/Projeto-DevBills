import { useState } from "react";
import { Plus } from "lucide-react";
import { TechModal } from "./TechModal";

const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <footer className="bg-gray-800 border-t border-gray-700 py-4">
        <div className="container-app">
          <p className="text-sm text-gray-400 text-center">
            &copy; {new Date().getFullYear()} DevBills - Desenvolvido por:{" "}
            <strong>Dev. KyrraH</strong>
          </p>
          <p className="text-xs text-primary-500 text-center mt-2 flex items-center justify-center gap-1">
            Construído com:
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1 text-primary-500 hover:text-primary-400 transition-colors cursor-pointer"
              aria-label="Ver tecnologias utilizadas"
            >
              <Plus className="w-4 h-4 text-black" />
            </button>
          </p>
        </div>
      </footer>

      <TechModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Footer;

//import { Plus } from "lucide-react";

//const footer = () => {
 // return (
   // <footer className="bg-gray-800 border-t border-gray-700 py-4">
   //   <div className="container-app">
   //     <p className="text-sm text-gray-400 text-center">
  //        &copy; {new Date().getFullYear()} DevBills - Desenvolvido por: <strong>Dev. KyrraH</strong>
  //      </p>
   //     <p className="text-xs text-primary-500 text-center mt-2 flex justify-center gap-2">
   //       Construído com: <Plus className="w-4 h-4 mr-2 text-black" />
    //    </p>
   //   </div>
  //  </footer>
 // );
//};

//export default footer;
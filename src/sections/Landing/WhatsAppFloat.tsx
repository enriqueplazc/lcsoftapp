import whatsappIcon from "../../assets/icons/icons8-whatsapp.svg";
import { whatsappLink } from "../../content/site";

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-black/40 transition hover:scale-105"
    >
      <img src={whatsappIcon} alt="" className="h-8 w-8" width={32} height={32} />
    </a>
  );
}

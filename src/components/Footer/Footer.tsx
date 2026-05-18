import {
  EnvelopeIcon,
  PhoneIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import LogoLc from '../../assets/logo/lc-logo-text-left-white.png';
import linkedin from '../../assets/icons/icons8-linkedin.svg';
import whatsapp from '../../assets/icons/icons8-whatsapp.svg';
import { useToggle } from 'react-use';

export function Footer(): JSX.Element {
  const [toggle, setToggle] = useToggle(false);

  // 📱 Configuración de contacto
  const WHATSAPP_NUMBER = '51954760305'; // Formato: código país + número (sin +, espacios ni guiones)
  const WHATSAPP_MESSAGE = 'Hola, me gustaría obtener más información sobre sus servicios.';
  const LINKEDIN_URL = 'https://www.linkedin.com/company/lc-software-consultoria'; // Cambiar por tu URL real

  // Generar link de WhatsApp
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <>
      <div className="py-20 bg-black">
        <div className="content m-auto text-alabasters grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex gap-2 flex-col">
            <figure>
              <img className="w-30" src={LogoLc} alt="logo LC" />
            </figure>
          </div>

          <div>
            <h4 className="mb-4 text-xl font-extrabold">Contacto</h4>
            <ul className="flex flex-col gap-4">
              <li className="grid grid-cols-[2em_1fr] items-center gap-2">
                <div>
                  <EnvelopeIcon />
                </div>
                <li>olazaro@lcsoft.pe</li>
              </li>
              <li className="grid grid-cols-[2em_1fr] items-center gap-2">
                <div>
                  <EnvelopeIcon />
                </div>
                <ul>
                  <li>elazaro@lcsoft.pe</li>
                </ul>
              </li>
              <li className="grid grid-cols-[2em_1fr] items-center gap-2">
                <div>
                  <PhoneIcon />
                </div>
                +51 954760305
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xl font-extrabold">Productos</h4>
            <ul className="flex flex-col gap-4">
              <li>Módulo de Nóminas y Planillas.</li>
              <li>Desarrollo Web Empresarial.</li>
              <li>Módulo de Almacenes.</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xl font-extrabold">Servicios</h4>
            <ul className="flex flex-col gap-4">
              <li>Outsourcing de Planillas.</li>
              <li>Cursos.</li>
              <li>Migración de Información.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="py-2 bg-mine-shaft2 text-alabasters">
        <div className="content m-auto grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="text-center lg:text-left">
            <span>© Todos los derechos reservados.</span>
          </div>
          <div className="flex justify-center lg:justify-end gap-4">
            <a href="">Términos y condiciones</a>
            <a href="">Cookies</a>
            <a href="">Créditos</a>
          </div>
        </div>
      </div>

      {/* Botones flotantes con links funcionales */}
      <div className="fixed right-6 bottom-6 z-50 text-white flex flex-col gap-4">
        <div
          className={`flex transition-all ${toggle ? 'opacity-100' : 'opacity-0'} flex-col items-center justify-center gap-4`}
        >
          {/* WhatsApp - ahora es un link */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-[2.5em] h-[2.5em] rounded-full bg-vulcan text-white p-2 cursor-pointer shadow-lg"
          >
            <img src={whatsapp} alt="whatsapp" />
          </a>

          {/* LinkedIn - ahora es un link */}
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-[2.5em] h-[2.5em] rounded-full bg-vulcan text-white p-2 cursor-pointer shadow-lg"
          >
            <img src={linkedin} alt="linkedin" />
          </a>
        </div>

        {/* Botón principal */}
        <div
          onClick={setToggle}
          className={`w-[3em] transition-all ${toggle ? 'rotate-45' : 'rotate-0'} rounded-full bg-vulcan text-white p-2 cursor-pointer shadow-lg`}
        >
          <PlusIcon />
        </div>
      </div>
    </>
  );
}
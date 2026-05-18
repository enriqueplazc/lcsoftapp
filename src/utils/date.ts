import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';

export function formatDate(date: string) {
  return format(date, "d 'de' MMMM 'del' yyyy", { locale: es });
}

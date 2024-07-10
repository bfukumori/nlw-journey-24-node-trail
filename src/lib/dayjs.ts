import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat.js';
import 'dayjs/locale/pt-br';

dayjs.locale('pt-br');
dayjs.extend(localizedFormat);

export { dayjs };

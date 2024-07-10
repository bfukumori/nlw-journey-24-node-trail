import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import localizedFormat from 'dayjs/plugin/localizedFormat.js';

dayjs.locale('pt-br');
dayjs.extend(localizedFormat);

export { dayjs };

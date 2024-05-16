import path from 'path';
import i18n from 'i18n';

import { languages } from '../utils/enums';

const { en, hi } = languages;

i18n.configure({
  locales: [en, hi],
  defaultLocale: en,
  header: 'accept-language',
  directory: path.join(__dirname, '..', 'locales'),
  register: global,
  updateFiles: false,
});

export default i18n;

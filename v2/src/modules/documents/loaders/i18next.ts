import {
  LoaderOptions,
} from "@medusajs/framework/types"

import i18next  from 'i18next';
import path from "path";

type ModuleOptions = {
  document_language?: string
}

export default async function i18nextLoader({
  container,
  options
}: LoaderOptions<ModuleOptions>) {
  console.info("Starting i18next loader...")

  try {
    const defaultTranslationsPath = path.resolve(__dirname, `../assets/i18n/locales/en/translation.json`);
    const { default: data } = await import(defaultTranslationsPath, { with: { type: "json" } });

    await i18next
      .init({
        fallbackLng: 'en',
        defaultNS: 'translation',
        ns: 'translation',
        resources: {
          en: {
            translation: data
          }
        }
      }).catch((error) => {
        console.error(error); 
      });

  } catch (error) {
    console.error('Error initializing i18next:', error);
  }
  

  try {
    const configLanguage = options?.document_language
    if (configLanguage === undefined) {
      console.info('Language is not configured, using "en" by default.')
    } else {
      console.info(`Language is configured as ${configLanguage}`)
      const translationPath = path.resolve(__dirname, `../assets/i18n/locales/${configLanguage}/translation.json`);
      const translations = await import(translationPath);
      i18next.addResourceBundle(
        configLanguage,
        'translation',
        translations
      )
      i18next.changeLanguage(configLanguage);
    }
  } catch {
    console.error('Error adding language configured in config. Fallback to "en"');
  }

  console.info("Ending i18next loader...")
}
import { Box, FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import style from './LanguageSelector.style';

const LanguageSelector = memo(() => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);

  const onChange = (event: SelectChangeEvent) => setLanguage(event.target.value as string);

  useEffect(() => {
    if (!language || language === i18n.language) return;
    i18n.changeLanguage(language);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    <FormControl fullWidth>
      <Select size="small" value={language} placeholder={t('language')} onChange={onChange}>
        {i18n.languages.map((lang) => (
          <MenuItem key={lang} value={lang}>
            <Box {...style.MenuItemContainerProps}>
              <Box {...style.ImageProps} src={`images/flags/${lang}.png`} alt={lang} />
              {t(lang)}
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
});

export default LanguageSelector;

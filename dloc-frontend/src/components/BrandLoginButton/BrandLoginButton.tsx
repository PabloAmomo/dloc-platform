import { Avatar, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useUserContext } from 'providers/UserProvider';
import style from './BrandLoginButton.style';

const BrandLoginButton = (props: BrandLoginButtonProps) => {
  const { onClick, brand, disabled } = props;
  const { t } = useTranslation();
  const { isLogingIn: isLoging } = useUserContext();

  /** Brand Image */
  const LoginBrandImage = <Avatar alt={`${brand} logo`}  variant="square" {...style.StartIconProps} src={`images/brands/${brand}.png`} />;

  /** Render */
  return (
    <Button disabled={isLoging || disabled} variant={'text'} onClick={onClick} {...style.ButtonProps} startIcon={LoginBrandImage}>
      <span {...style.ButtonTextProps}>{t(`login${brand.toUpperCase()}`)}</span>
    </Button>
  );
};

export default BrandLoginButton;

interface BrandLoginButtonProps {
  onClick: { (): void };
  brand: string;
  disabled?: boolean;
}

import { Button, Grid, Link, TextField } from '@mui/material';
import { configApp } from 'config/configApp';
import { logError } from 'functions/logError';
import { SendEmailResult } from 'models/sendEmailResult';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUserContext } from 'providers/UserProvider';
import contactUs from 'services/contactUs/contactUs';
import isEmail from 'functions/isEmail';
import PageContainer from 'components/PageContainer/PageContainer';
import showAlert from 'functions/showAlert';
import style from './ContactUs.style';

function ContactUs() {
  const { user, isLoggedIn } = useUserContext();
  const { t } = useTranslation();
  const [formValues, setFormValues] = useState({ name: user.profile.name, email: user.profile.email, message: '' });
  const [validForm, setValidForm] = useState(false);
  const abortSendEmail = useRef<AbortController>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!formValues.name || !formValues.email || !formValues.message || !isEmail(formValues.email)) return setValidForm(false);
    setValidForm(true);
  }, [formValues]);

  const clickOnReturn = () => {
    navigate(-1);
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const clickOnSend = () => {
    if (!formValues.name || !formValues.email || !formValues.message) {
      showAlert(t('fillAllFields'), 'error');
      return;
    };
    if (!isEmail(formValues.email)) {
      showAlert(t('invalidEmail'), 'error');
      return;
    }

    contactUs({
      ...formValues,
      callback: (response: SendEmailResult) => {
        try {
          if (!response.error) {
            setFormValues({ ...formValues, message: '' });
            showAlert(t('messageSended'), 'success');
          }
          else throw new Error(response.error.message);

        } catch (error: any) {
          logError('sendEmail', error.message);
          showAlert(t('errorSendingMessage'), 'error');
        }
      },
      abort: abortSendEmail,
    });
  };

  return (
    <PageContainer {...style.PageProps}>
      <Grid container spacing={2} {...style.GridContainerProps}>
        <Grid {...style.GridItemProps} item>
          <Link href={`mailto:${configApp.constactUsEmail}`} {...style.EmailLinkProps}>
            {t('sendUsEmail.line1')}<br />
            {t('sendUsEmail.line2')}
          </Link>
        </Grid>

        <Grid {...style.GridItemProps} item>
          <TextField
            disabled={isLoggedIn}
            label={t("name")}
            name="name"
            value={formValues.name}
            onChange={handleInputChange}
            margin="normal"
            required
            {...style.TextFieldProps}
          />
        </Grid>

        <Grid {...style.GridItemProps} item>
          <TextField
            disabled={isLoggedIn}
            label={t("email")}
            name="email"
            type="email"
            value={formValues.email}
            onChange={handleInputChange}
            margin="normal"
            required
            {...style.TextFieldProps}
          />
        </Grid>

        <Grid {...style.GridItemProps} item>
          <TextField
            label={t("message")}
            name="message"
            value={formValues.message}
            onChange={handleInputChange}
            margin="normal"
            required
            multiline
            rows={4}
            {...style.TextFieldProps}
          />
        </Grid>

        <Grid {...style.GridItemProps} item xs={12}>
          <Grid xs={6} item textAlign={'start'}>
          <Button {...style.ButtonActionProps} onClick={clickOnReturn}>
              {t('return')}
            </Button>
          </Grid>
          <Grid xs={6} item textAlign={'end'}>
            <Button {...style.ButtonActionProps} onClick={clickOnSend} disabled={!validForm}>
              {t('send')}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </PageContainer>
  );
}

export default ContactUs;

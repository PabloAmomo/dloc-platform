import { Avatar, Box, Button, Chip, Dialog, Stack } from '@mui/material';
import { configApp } from 'config/configApp';
import { CopyAll, Delete, Edit, SettingsBackupRestore, ShareTwoTone } from '@mui/icons-material';
import { Device } from 'models/Device';
import { DialogActions, DialogContent, DialogTitle, Grid, IconButton, Typography } from '@mui/material';
import { IconType } from 'enums/IconType';
import { NO_IMAGE_URL, REGEX_INPUT_IMEI, MAX_IMAGE_SIZE } from './DeviceForm.const';
import { SharedWith } from 'models/SharedWith';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserContext } from 'providers/UserProvider';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import CircularLoading from 'components/CircularLoading/CircularLoading';
import CloseIcon from '@mui/icons-material/Close';
import ColorPicker from 'components/ColorPicker/ColorPicker';
import ConfirmDialog from 'components/ConfirmDialog/ConfirmDialog';
import DialogEmailForm from 'components/DialogEmailForm/DialogEmailForm';
import getNoImagePath from 'functions/getNoImagePath';
import PlatformInstructions from 'components/PlatformInstructions/PlatformInstructions';
import resizeImageFile from 'functions/resizeImageFile';
import showAlert from 'functions/showAlert';
import style from './DeviceForm.style';
import TextFieldForParam from 'components/TextFieldFormParam/TextFieldForParam';
import TransitionDialogFromDown from 'components/TransitionDialogFromDown/TransitionDialogFromDown';
import TypeSelector from 'components/TypeSelector/TypeSelector';
import useDeleteDeviceHook from 'hooks/DeleteDeviceHook';
import useDeviceFormHook from 'hooks/DeviceFormHook';

const DeviceForm = (props: DeviceFormProps) => {
  const { device: workDevice, onClose } = props;
  const [isRequestEmail, setIsRequestEmail] = useState<boolean>(false);
  const [isConfigInstructionsOpen, setIsConfigInstructionsOpen] = useState<boolean>(false);
  const [isConfirmDeleteDeviceDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false);
  const [isLooseDataDialogOpen, setIsLooseDataDialogOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { deleteDevice } = useDeleteDeviceHook();
  const { isLoggedIn, user } = useUserContext();
  const { t } = useTranslation();

  const deviceFormHook = useDeviceFormHook();
  const { changeImei, changeName, changeEndTrack, changeMarkerColor } = deviceFormHook.handlers;
  const { changePathColor, changeStartTrack, changeSharedWiths, changeHasImage } = deviceFormHook.handlers;
  const { openDeviceForm, device, isOpen, closeDeviceForm, isNewDevice, dataModified, imageModified, errors, sharedDevice } = deviceFormHook;
  const { saveDevice, cancelSave, avatarUrl, setAvatarUrl, resetAvatarURL } = deviceFormHook;

  const buttonSaveLabel = isNewDevice ? `${t('add')}` : `${t('save')}`;
  const isSharedDevice = (sharedDevice ? true : false) || device?.isShared;
  const titleLabel = isSharedDevice ? `${t('addSharedDevice')}` : isNewDevice ? `${t('addDevice')}` : `${t('editDevice', { name: workDevice?.params.name })}`;

  const canBeSaved = (dataModified || imageModified || isNewDevice) && errors.length === 0 && !isSaving;

  /** Open Device Form (Setting the devive to work with) */
  useEffect(() => {
    if (workDevice) openDeviceForm(workDevice);
  }, [workDevice]);

  /** Save Device */
  const clickOnSave = () => saveDevice({ setIsSaving });

  /** Check if user is logged out */
  useEffect(() => {
    if (!isLoggedIn) {
      setIsConfirmDialogOpen(false);
      cancelSave();
      closeDeviceForm();
      onClose && onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  /** Close Device Form */
  const clickOnCancel = () => {
    /** Ask for confirmation if data has been modified */
    if (dataModified || imageModified) return setIsLooseDataDialogOpen(true);

    /** Close Device Form */
    if (!isSaving) closeDeviceForm();
    cancelSave();
    setIsSaving(false);
    onClose && onClose();
  };

  /** Delete Device */
  const clickOnDelete = () => {
    if (!isNewDevice) setIsConfirmDialogOpen(true);
  };

  /** Open Confirmation Dialog */
  const handleOnConfirmDeleteDeviceDialogYes = () => {
    deleteDevice(device.imei, setIsSaving, (imei: string) => {
      showAlert(t('deviceDeleted', { device: device.params.name }), 'success');
      setIsConfirmDialogOpen(false);
      closeDeviceForm();
    });
  };

  /** Close Confirmation Dialog */
  const handleOnConfirmDeleteDeviceDialogNo = () => setIsConfirmDialogOpen(false);

  /** Open Config Instructions */
  const clickOnConfig = () => setIsConfigInstructionsOpen(true);

  /** Open Add Shared With Form */
  const handleOpenSharedWiths = () => setIsRequestEmail(true);

  /** Remove Shared With */
  const handleRemoveSharedWiths = (chipToDelete: SharedWith) => () =>
    changeSharedWiths((device?.params?.sharedWiths ?? []).filter((shareWith) => shareWith.email !== chipToDelete.email));

  /** Add Shared With */
  const handleAddSharedWiths = (email: string) => {
    if (!email) return;

    /** Check if email is already shared */
    if (device?.params?.sharedWiths?.find((shareWith) => shareWith.email.trim().toLocaleLowerCase() === email.trim().toLocaleLowerCase())) return;
    /** Add email to sharedWiths */
    const newSharedWiths: SharedWith[] = [...(device?.params?.sharedWiths ?? [])];
    newSharedWiths.push({ email });
    changeSharedWiths(newSharedWiths);
  };

  /** Check email previous to submit */
  const handleOnPreSubmit = (email: string): boolean => {
    /** Already shared */
    if (device?.params?.sharedWiths?.find((shareWith) => shareWith.email.trim().toLocaleLowerCase() === email.trim().toLocaleLowerCase())) {
      showAlert(t('alreadySharedWith', { email }), 'error');
      return false;
    }
    /** Can share with yourself */
    if (email.toLocaleLowerCase().trim() === user.profile.email.toLocaleLowerCase().trim()) {
      showAlert(t('cantShareWithYourself'), 'error');
      return false;
    }
    /** Email is valid */
    return true;
  };

  const copyImei = () => {
    showAlert(t('imeiCopiedToClipboard', { text: device.imei }), 'info');
    navigator.clipboard.writeText(device.imei);
  };

  /** Handle Image Change */
  const handleFileInputImageChange = (event: any) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const fileData: string = e.target?.result as string;
        if (fileData)
          resizeImageFile(fileData, MAX_IMAGE_SIZE, (resizedImageUrl: string) => {
            setAvatarUrl(resizedImageUrl);
            changeHasImage(true);
          });
      };

      reader.readAsDataURL(file);
    } catch (error) {
      showAlert(t('errorLoadingImage') + JSON.stringify(error), 'error');
    }
  };

  /** Open File Image Select Dialog */
  const changeImage = (event: any) => document.getElementById('deviceform-fileinputimage')?.click();

  /** Remove Avatar URL */
  const removeAvatarURL = () => {
    setAvatarUrl(NO_IMAGE_URL);
    changeHasImage(false);
  };

  /** Handle Confirm Dialog (Loose Data) */
  const handleOnLooseDataDialogNo = () => setIsLooseDataDialogOpen(false);

  /** Handle Confirm Dialog (Loose Data) */
  const handleOnLooseDataDialogYes = () => {
    setIsLooseDataDialogOpen(false);
    /** Close Device Form */
    closeDeviceForm();
    cancelSave();
    setIsSaving(false);
    onClose && onClose();
  };

  /** Render */
  return (
    <>
      {/* Input to get File Image to use as Avatar */}
      <input type="file" id="deviceform-fileinputimage" onChange={handleFileInputImageChange} style={{ display: 'none' }} />

      {/* Config Instructions */}
      <PlatformInstructions isOpen={isConfigInstructionsOpen} setIsOpen={setIsConfigInstructionsOpen} titleKey="instructions" stepsKey="instructions" preStepKey="instructions" />

      {/* Dialog Email Form */}
      <DialogEmailForm
        isOpen={isRequestEmail}
        setIsOpen={setIsRequestEmail}
        onPreSubmit={handleOnPreSubmit}
        onSubmit={handleAddSharedWiths}
        title={t('addSharedWith')}
        text={t('addSharedWithEmailText')}
        submitText={t('add')}
        cancelText={t('cancel')}
      />

      {/* Confirm Dialog (Loose data) */}
      <ConfirmDialog
        icon={isNewDevice ? <AddLocationAltIcon {...style.DialogTitleIconProps} /> : <Edit {...style.DialogTitleIconProps} />}
        title={t('looseData')}
        text={t('confirmLooseData', { device: device.params.name })}
        onNo={handleOnLooseDataDialogNo}
        onYes={handleOnLooseDataDialogYes}
        yesText={t('yes')}
        isOpen={isLooseDataDialogOpen}
        yesColor="error"
      />

      {/* Confirm Dialog (Remove Device) */}
      <ConfirmDialog
        icon={<Delete />}
        title={t('deleteDevice')}
        text={t('confirmDeleteDevice', { device: device.params.name })}
        onNo={handleOnConfirmDeleteDeviceDialogNo}
        onYes={handleOnConfirmDeleteDeviceDialogYes}
        yesText={t('delete')}
        isOpen={isConfirmDeleteDeviceDialogOpen}
        yesColor="error"
      />

      {/* Device Form */}
      <Dialog TransitionComponent={TransitionDialogFromDown} keepMounted open={isOpen} fullWidth {...style.DialogProps}>
        <IconButton onClick={clickOnCancel} {...style.CloseIconProps}>
          <CloseIcon />
        </IconButton>

        <DialogTitle {...style.DialogTitleProps}>
          <Box position={'relative'}>
            {isNewDevice ? <AddLocationAltIcon {...style.DialogTitleIconProps} /> : <Edit {...style.DialogTitleIconProps} />}
            {isSharedDevice && <Typography {...style.SharedText}>{t('shared')}</Typography>}
          </Box>
          <Box {...style.DialogTitleTextProps}>{titleLabel}</Box>
        </DialogTitle>

        <DialogContent>
          <form autoComplete="off" noValidate onSubmit={(event) => event.preventDefault()}>
            <Grid container spacing={2} pt={isSharedDevice ? 1 : 0.5}>
              {/* IMEI */}
              {!isSharedDevice && !device.imei.startsWith('S') && (
                <Grid item xs={12} display={'flex'} flexDirection={'row'}>
                  {!isNewDevice ? (
                    <>
                      <Typography>{t('imei')}</Typography>
                      <Typography {...style.ImeiAccordionSummaryImeProps}>{device.imei}</Typography>

                      {/* Copy IMEI */}
                      <Box onClick={copyImei} {...style.CopyIconContainerProps}>
                        <CopyAll {...style.CopyIconProps} />
                        <Typography>{t('copy')}</Typography>
                      </Box>
                    </>
                  ) : (
                    <TextFieldForParam
                      sx={{ mt: 0 }}
                      error={errors.includes('imei')}
                      regex={isNewDevice ? REGEX_INPUT_IMEI : undefined}
                      onChange={changeImei}
                      maxLength={configApp.maxLengths.imei}
                      disabled={isSaving || !isNewDevice}
                      helperText={t('imeiHelper')}
                      value={device.imei}
                      withOutGrid={true}
                    />
                  )}
                </Grid>
              )}

              {/* NAME AND AVATAR */}
              <Grid item xs={12} {...style.NameAndAvatarGridContainerProps}>
                <Grid container spacing={2} flexWrap={'nowrap'}>
                  <Grid item flexGrow={1}>
                    {/* NAME */}
                    <TextFieldForParam
                      {...style.NameInputProps}
                      error={errors.includes('name')}
                      onChange={changeName}
                      maxLength={configApp.maxLengths.name}
                      disabled={isSaving}
                      label={t('name')}
                      helperText={t('nameHelper')}
                      value={device.params.name}
                    />
                  </Grid>
                  {/* AVATAR */}
                  <Grid item {...style.AvatarGridContainerProps}>
                    {imageModified && <SettingsBackupRestore color={'primary'} {...style.ResetAvatarIconProps} onClick={resetAvatarURL} />}

                    <Box {...style.AvatarContainerProps}>
                      <Avatar
                        onClick={changeImage}
                        variant="rounded"
                        alt=""
                        src={device.params.hasImage ? avatarUrl : getNoImagePath()}
                        {...style.AvatarProps}
                      />
                    </Box>

                    {/* Delete Avatar Image */}
                    <Button onClick={removeAvatarURL} disabled={!device.params.hasImage} variant="text" color="error" {...style.AvatarDeleteButtonProps}>
                      {t('delete')}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>

              {/* PET TYPE */}
              <Grid item xs={12} {...style.PetTypeGridContainerProps}>
                <Typography fontWeight={'bold'} variant="subtitle1">
                  {t('marker')}
                </Typography>
                {/* PET MARKER */}
                <Grid container spacing={2}>
                  <Grid item flexGrow={1}>
                    <TypeSelector
                      fillColor={device.params.markerColor}
                      type={device.params.endTrack}
                      setType={changeEndTrack}
                      types={IconType}
                      typeName="IconType"
                      placeholder="maker"
                      selectables={configApp.deviceSelectablesTypes}
                    />
                  </Grid>
                  {/* PET MARKER - COLOR */}
                  <Grid item>
                    <ColorPicker disabled={device.params.endTrack === IconType.pin} color={device.params.markerColor} setColor={changeMarkerColor} />
                  </Grid>
                </Grid>
              </Grid>

              {/* JOURNEY */}
              <Grid item xs={12}>
                <Typography fontWeight={'bold'} variant="subtitle1">
                  {t('pathColor')}
                </Typography>
                {/* JOURNEY START ICON */}
                <Grid container spacing={2}>
                  <Grid item flexGrow={1}>
                    <TypeSelector
                      fillColor={device.params.pathColor}
                      type={device.params.startTrack}
                      setType={changeStartTrack}
                      types={IconType}
                      typeName="IconType"
                      placeholder="startIcon"
                      selectables={configApp.startPathSelectablesTypes}
                    />
                  </Grid>
                  {/* JOURNEY START ICON COLOR  */}
                  <Grid item>
                    <ColorPicker color={device.params.pathColor} setColor={changePathColor} />
                  </Grid>
                </Grid>
              </Grid>

              {/* SHARED WITHS */}
              {!device.isShared && (
                <Grid item xs={12}>
                  <Stack direction="column" justifyContent={'center'} spacing={2}>
                    <Typography fontWeight={'bold'} variant="subtitle1">
                      {t('sharedWiths')}
                    </Typography>
                    {/* SHARED LIST */}
                    {device?.params?.sharedWiths?.length === 0 ? (
                      <Typography mt={2} variant="body2" textAlign={'center'}>
                        {t('shareNobody')}
                      </Typography>
                    ) : (
                      <Stack direction="row" justifyContent="space-around" alignItems="flex-start" spacing={2} useFlexGap flexWrap="wrap">
                        {device?.params?.sharedWiths?.map((shareWith: SharedWith) => (
                          <Chip
                            variant="outlined"
                            key={`${shareWith.email}`}
                            deleteIcon={<Delete />}
                            label={shareWith.email}
                            onDelete={handleRemoveSharedWiths(shareWith)}
                          />
                        ))}
                      </Stack>
                    )}
                    <Box display={'flex'} justifyContent={'center'}>
                      <Button {...style.ButtonShareWithsProps} startIcon={<ShareTwoTone />} disabled={isSaving} onClick={handleOpenSharedWiths}>
                        {t('addSharedWith')}
                      </Button>
                    </Box>
                  </Stack>
                </Grid>
              )}
            </Grid>
          </form>
        </DialogContent>

        <DialogActions {...style.DialogActionsProps}>
          {/* DELETE BUTTO / INSTRUCTIONS BUTTON */}
          {!isNewDevice ? (
            <Button color="error" {...style.ActionButtonProps} disabled={isSaving} onClick={clickOnDelete}>
              {t('delete')}
            </Button>
          ) : (
            !isSharedDevice && (
              <Button disabled={isSaving} onClick={clickOnConfig}>
                {t('instructions.instructions')}
              </Button>
            )
          )}

          <Box {...style.DialogActionsSeparatorProps}></Box>

          {/* CANCEL BUTTON */}
          <Button {...style.ActionButtonProps} onClick={clickOnCancel}>
            {t('cancel')}
          </Button>

          {/* SAVE BUTTON */}
          <Button {...style.ActionButtonProps} disabled={!canBeSaved} onClick={clickOnSave}>
            {isSaving ? <CircularLoading {...style.CircularLoadingProps} /> : buttonSaveLabel}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// (dataModified || imageModified || isNewDevice || errors.length === 0) && !isSaving
export default DeviceForm;

interface DeviceFormProps {
  device: Device | undefined;
  onClose: { (): void };
}

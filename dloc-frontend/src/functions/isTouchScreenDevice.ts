const isTouchScreenDevice = () => {
  try{
      document.createEvent('TouchEvent');
      return true;
  }catch(e){
      return false;
  }
}

export default isTouchScreenDevice;
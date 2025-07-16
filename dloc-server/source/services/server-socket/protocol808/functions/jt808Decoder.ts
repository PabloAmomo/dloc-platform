import jt808FrameDecode from "./jt808FrameDecode";

const jt808Decoder = (data: Buffer): Buffer[] => {
  return [jt808FrameDecode(data)];
}

export default jt808Decoder
const splitJT808Frames = (buffer: any) : any[] => {
    const messages = [];
    let start = -1;

    for (let i = 0; i < buffer.length; i++) {
        if (buffer[i] === 0x7E) {
            if (start === -1) {
                // Inicio de un nuevo mensaje
                start = i;
            } else {
                // Fin del mensaje
                const frame = buffer.slice(start, i + 1);
                messages.push(frame);
                start = -1; // Reset para siguiente mensaje
            }
        }
    }

    return messages;
}

export default splitJT808Frames;
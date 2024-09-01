import axios from 'axios';

// Global Variables
import { IMAGE_BB_key } from '../Assets/GlobalVeriables';

// Props Types
type ImgbbResponse = {
    data: {
        url: string;
    };
}

// Define the type for the FormData
interface FormDataType extends FormData {}

// Send images to imgbb
const sendImagesToImgbb = async (data: FormDataType): Promise<ImgbbResponse | false> => {
    try {
        // Save product images in imgbb
        const response = await axios.post<ImgbbResponse>(
            `https://api.imgbb.com/1/upload?key=${IMAGE_BB_key}`, 
            data
        );

        // Check if the response data contains the expected data
        if (response.data && response.data.data && response.data.data.url) {
            return response.data;
        } else {
            console.error('Unexpected response structure:', response.data);
            return false;
        }
    } catch (err) {
        console.error('Error uploading image:', err);
        return false;
    }
};

export {
    sendImagesToImgbb,
};

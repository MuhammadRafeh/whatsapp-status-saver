import fetchDataFromDirectory, { directorySetup } from "../data/fetchDataFromWhatsApp";

export const SETMEDIA = 'SETMEDIA';

export const setMedia = (isSetupDirectory  = false) => {
    return async (dispatch) => {
        let data = {};
        if (isSetupDirectory){
            const mediaData = await directorySetup();
            data = {...mediaData};
        } else{
            const mediaData = await fetchDataFromDirectory();
            data = {...mediaData};
        }
        dispatch({
            type: SETMEDIA,
            payload: data,
            isSetupDirectory
        });
    }
}

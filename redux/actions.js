import fetchDataFromDirectory from "../data/fetchDataFromWhatsApp";

export const SETMEDIA = 'SETMEDIA';

export const setMedia = () => {
    return async (dispatch) => {
        const data = await fetchDataFromDirectory();
        dispatch({
            type: SETMEDIA,
            payload: data
        });
    }
}

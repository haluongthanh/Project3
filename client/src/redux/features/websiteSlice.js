import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosPublic } from '../axiosPublic';
import axiosPrivate from '../axiosPrivate';


export const getWebsite = createAsyncThunk('website/getWebsite', async({ toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPublic.get(`/web`);
        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})



export const WebsiteDetails = createAsyncThunk('website/getWebsiteDetails', async({ id, toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPublic.get(`/web/${id}`);
        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

export const updateWebsite = createAsyncThunk('website/updateWebsite', async({ id, jsonData, toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPrivate.put(`/web/${id}`, jsonData, { headers: { 'Content-type': 'multipart/form-data' } });
        toast.success('Website updeted.')
        return data;
    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})
const websiteSlice = createSlice({
    name: 'web',
    initialState: {
        mutationResult: { success: false },
        weblist: {},
        webDetails: {}
    },
    reducers: {
        resetMutationResult: (state) => {
            state.mutationResult.success = false;
        }
    },
    extraReducers: {
        [getWebsite.pending]: (state, action) => {
            state.weblist.loading = true;
        },
        [getWebsite.fulfilled]: (state, action) => {
            state.weblist.loading = false;
            state.weblist.website = action.payload.website;
        },
        [getWebsite.rejected]: (state, action) => {
            state.weblist.loading = false;
            state.weblist.error = action.payload;
        },
        [WebsiteDetails.pending]: (state, action) => {
            state.webDetails.loading = true;
        },
        [WebsiteDetails.fulfilled]: (state, action) => {
            state.webDetails.loading = false;
            state.webDetails.website = action.payload.website;
        },
        [WebsiteDetails.rejected]: (state, action) => {
            state.webDetails.loading = false;
            state.webDetails.error = action.payload;
        },
        [updateWebsite.pending]: (state, action) => {
            state.mutationResult.loading = true;
        },
        [updateWebsite.fulfilled]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.success = action.payload.success;
        },
        [updateWebsite.rejected]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.error = action.payload;
        },
    }
})

export const selectBrandMutationResult = (state) => state.web.mutationResult;
export const selectWebsite = (state) => state.web.weblist;
export const selectWebsiteDetails = (state) => state.web.WebsiteDetails;
export const { resetMutationResult } = websiteSlice.actions;

export default websiteSlice.reducer;
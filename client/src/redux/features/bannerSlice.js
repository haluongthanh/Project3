import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosPublic } from '../axiosPublic';
import axiosPrivate from '../axiosPrivate';



export const getBanners = createAsyncThunk('banner/getBanners', async ({ toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPublic.get(`/banners`);
        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})
export const getBannersAuthorizeRole = createAsyncThunk('banner/getBlogsBanersAuthorizeRole', async ({ search, currentPage, startDate, endDate, status, toast }, { rejectWithValue }) => {
    try {
        let query = '';
        if (search) query += `keyword=${search}&`;
        if (currentPage) query += `page=${currentPage}&`;
        if (startDate) query += `createdAt[gte]=${startDate}T00:00:00.000Z&`;
        if (endDate) query += `createdAt[lte]=${endDate}T23:59:59.999Z&`;
        if (status) query += `status=${status}&`;

        query = query.endsWith('&') ? query.slice(0, -1) : query;
        const { data } = await axiosPrivate.get(`/athorized/banners?${query}`);

        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})
export const addBanner = createAsyncThunk('banner/addBanner', async ({ jsonData, toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPrivate.post(`/banners`, jsonData, { headers: { 'Content-type': 'multipart/form-data' } });
        toast.success('Đã thêm thành công biểu ngữ mới.');
        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})
export const deleteBanner = createAsyncThunk('banner/deleteBanner', async ({ id, toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPrivate.delete(`/banners/${id}`);
        toast.success('Đã xóa biểu ngữ thành công.');

        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

export const bannerDetails = createAsyncThunk('banner/bannerDetails', async ({ id, toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPublic.get(`/banners/${id}`);
        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

export const fetchBannerData = createAsyncThunk('banner/fetchBannerData', async ({ toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPublic.get(`/banners`);
        return data;
    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
});

export const updateBanner = createAsyncThunk('banner/updateBanner', async ({ id, jsonData, toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPrivate.put(`/banners/${id}`, jsonData, { headers: { 'Content-type': 'multipart/form-data' } });
        toast.success('Đã cập nhật biểu ngữ thành công.')
        return data;
    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

const bannerSlice = createSlice({
    name: 'banner',
    initialState: {
        mutationResult: { success: false },
        bannerslist: { banners: [] },
        bannersDetails: {}
    },
    reducers: {
        resetMutationResult: (state) => {
            state.mutationResult.success = false;
        },
        resetBanners: (state) => {
            state.bannerslist.banners = [];
        }
    },
    extraReducers: {
        [fetchBannerData.pending]: (state) => {
            state.bannerslist.loading = true;
        },
        [fetchBannerData.fulfilled]: (state, action) => {
            state.bannerslist.loading = false;
            state.bannerslist.banners = action.payload.banners;
        },
        [fetchBannerData.rejected]: (state, action) => {
            state.bannerslist.loading = false;
            state.bannerslist.error = action.payload;
        },
        [addBanner.pending]: (state, action) => {
            state.mutationResult.loading = true;
        },
        [addBanner.fulfilled]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.success = action.payload.success;
        },
        [addBanner.rejected]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.error = action.payload;
        },
        [getBanners.pending]: (state, action) => {
            state.bannerslist.loading = true;
        },
        [getBanners.fulfilled]: (state, action) => {
            state.bannerslist.loading = false;
            state.bannerslist.banners = action.payload.banners;
        },
        [getBanners.rejected]: (state, action) => {
            state.bannerslist.loading = false;
            state.bannerslist.error = action.payload;
        },
        [getBannersAuthorizeRole.pending]: (state, action) => {
            state.bannerslist.loading = true;
        },
        [getBannersAuthorizeRole.fulfilled]: (state, action) => {
            state.bannerslist.loading = false;
            state.bannerslist.banners = action.payload.banners;
            state.bannerslist.bannerCount = action.payload.bannerCount;
            state.bannerslist.resultPerPage = action.payload.resultPerPage;
            state.bannerslist.filteredBannersCount = action.payload.filteredBannersCount;
        },
        [getBannersAuthorizeRole.rejected]: (state, action) => {
            state.bannerslist.loading = false;
            state.bannerslist.error = action.payload;
        },
        [deleteBanner.pending]: (state, action) => {
            state.mutationResult.loading = true;
        },
        [deleteBanner.fulfilled]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.success = action.payload.success;
        },
        [deleteBanner.rejected]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.error = action.payload;
        },
        [bannerDetails.pending]: (state, action) => {
            state.bannersDetails.loading = true;
        },
        [bannerDetails.fulfilled]: (state, action) => {
            state.bannersDetails.loading = false;
            state.bannersDetails.banner = action.payload.banner;
        },
        [bannerDetails.rejected]: (state, action) => {
            state.bannersDetails.loading = false;
            state.bannersDetails.error = action.payload;
        },
        [updateBanner.pending]: (state, action) => {
            state.mutationResult.loading = true;
        },
        [updateBanner.fulfilled]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.success = action.payload.success;
        },
        [updateBanner.rejected]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.error = action.payload;
        },

    }
})

export const selectBannerMutationResult = (state) => state.banner.mutationResult;
export const selectAllBanner = (state) => state.banner.bannerslist;
export const selectBannerDetails = (state) => state.banner.bannersDetails;

export const { resetMutationResult,resetBanners } = bannerSlice.actions;

export default bannerSlice.reducer;
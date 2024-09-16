import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosPublic } from '../axiosPublic';
import axiosPrivate from '../axiosPrivate';

export const addBrand = createAsyncThunk('brand/addBrand', async({ jsonData, toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPrivate.post(`/brands`, jsonData);
        toast.success('Đã thêm thương hiệu mới thành công.');
        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})
export const getBrands = createAsyncThunk('brand/getBrands', async({ toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPublic.get(`/brands`);
        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})
export const getBrandsAuthorizeRole = createAsyncThunk('brand/getBrandsAuthorizeRole', async({ search, currentPage,startDate,endDate,status, toast }, { rejectWithValue }) => {
    try {
        let query = '';
        if (search) query += `keyword=${search}&`;
        if (currentPage) query += `page=${currentPage}&`;
        if (startDate) query += `createdAt[gte]=${startDate}T00:00:00.000Z&`;
        if (endDate) query += `createdAt[lte]=${endDate}T23:59:59.999Z&`;
        if (status) query += `status=${status}&`;
        query = query.endsWith('&') ? query.slice(0, -1) : query;
        const { data } = await axiosPrivate.get(`/athorized/brands?${query}`);

        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})
export const deleteBrand = createAsyncThunk('brand/deleteBrand', async({ id, toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPrivate.delete(`/brands/${id}`);
        toast.success('Đã xóa thương hiệu thành công.');

        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

export const brandDetails = createAsyncThunk('brand/brandDetails', async({ id, toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPublic.get(`/brands/${id}`);
        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

export const updateBrand = createAsyncThunk('brand/updateBrand', async({ id, jsonData, toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPrivate.put(`/brands/${id}`, jsonData);
        toast.success('Đã cập nhật thương hiệu thành công.')
        return data;
    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})
const brandSlice = createSlice({
    name: 'brand',
    initialState: {
        mutationResult: { success: false },
        brandlist: { brands:[] },
        brandDetails: {}
    },
    reducers: {
        resetMutationResult: (state) => {
            state.mutationResult.success = false;
        }
    },
    extraReducers: {
        //add new brand
        [addBrand.pending]: (state, action) => {
            state.mutationResult.loading = true;
        },
        [addBrand.fulfilled]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.success = action.payload.success;
        },
        [addBrand.rejected]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.error = action.payload;
        },
        // get all brand list
        [getBrands.pending]: (state, action) => {
            state.brandlist.loading = true;
        },
        [getBrands.fulfilled]: (state, action) => {
            state.brandlist.loading = false;
            state.brandlist.brands = action.payload.brands;
        },
        [getBrands.rejected]: (state, action) => {
            state.brandlist.loading = false;
            state.brandlist.error = action.payload;
        },
        [getBrandsAuthorizeRole.pending]: (state, action) => {
            state.brandlist.loading = true;
        },
        [getBrandsAuthorizeRole.fulfilled]: (state, action) => {
            state.brandlist.loading = false;
            state.brandlist.brands = action.payload.brands;
            state.brandlist.brandCount = action.payload.brandCount;
            state.brandlist.resultPerPage = action.payload.resultPerPage;
            state.brandlist.filteredBrandsCount = action.payload.filteredBlogsCount;
        },
        [getBrandsAuthorizeRole.rejected]: (state, action) => {
            state.brandlist.loading = false;
            state.brandlist.error = action.payload;
        },
        //delete a brand
        [deleteBrand.pending]: (state, action) => {
            state.mutationResult.loading = true;
        },
        [deleteBrand.fulfilled]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.success = action.payload.success;
        },
        [deleteBrand.rejected]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.error = action.payload;
        },
        //get brand details
        [brandDetails.pending]: (state, action) => {
            state.brandDetails.loading = true;
        },
        [brandDetails.fulfilled]: (state, action) => {
            state.brandDetails.loading = false;
            state.brandDetails.brand = action.payload.brand;
        },
        [brandDetails.rejected]: (state, action) => {
            state.brandDetails.loading = false;
            state.brandDetails.error = action.payload;
        },
        //update brand
        [updateBrand.pending]: (state, action) => {
            state.mutationResult.loading = true;
        },
        [updateBrand.fulfilled]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.success = action.payload.success;
        },
        [updateBrand.rejected]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.error = action.payload;
        },
    }
})

export const selectBrandMutationResult = (state) => state.brand.mutationResult;
export const selectAllBrands = (state) => state.brand.brandlist;
export const selectBrandDetails = (state) => state.brand.brandDetails;
export const { resetMutationResult } = brandSlice.actions;

export default brandSlice.reducer;
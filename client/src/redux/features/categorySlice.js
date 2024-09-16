import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosPublic } from '../axiosPublic';
import axiosPrivate from '../axiosPrivate';

export const addCategory = createAsyncThunk('category/addCategory', async ({ formData, toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPrivate.post(`/categories`, formData, { headers: { 'Content-type': 'multipart/form-data' } });
        toast.success('Đã thêm danh mục mới thành công.');
        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})
export const getCategories = createAsyncThunk('category/getCategories', async ({ toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPublic.get(`/categories`);
        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})
export const getCategoriesAuthorizeRole = createAsyncThunk('category/getCategoriesAuthorizeRole', async ({limit, search, currentPage, startDate, endDate, status, toast }, { rejectWithValue }) => {
    try {
        let query = '';
        if (search) query += `keyword=${search}&`;
        if (currentPage) query += `page=${currentPage}&`;
        if (limit) query += `limit=${limit}&`;

        if (startDate) query += `createdAt[gte]=${startDate}T00:00:00.000Z&`;
        if (endDate) query += `createdAt[lte]=${endDate}T23:59:59.999Z&`;
        if (status) query += `status=${status}&`;
        query = query.endsWith('&') ? query.slice(0, -1) : query;
        const { data } = await axiosPrivate.get(`/athorized/categorys?${query}`);
        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})
export const deleteCategory = createAsyncThunk('category/deleteCategory', async ({ id, toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPrivate.delete(`/categories/${id}`);
        toast.success('Đã xóa danh mục thành công');

        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

export const categoryDetails = createAsyncThunk('category/categoryDetails', async ({ id, toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPublic.get(`/categories/${id}`);
        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

export const updateCategory = createAsyncThunk('category/updateCategory', async ({ id, formData, toast }, { rejectWithValue }) => {
    try {

        const { data } = await axiosPrivate.put(`/categories/${id}`, formData, { headers: { 'Content-type': 'multipart/form-data' } });
        toast.success('Đã cập nhật danh mục  thành công')
        return data;
    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})
const categorySlice = createSlice({
    name: 'category',
    initialState: {
        mutationResult: { success: false },
        categorylist: { categories: [] },
        categoryDetails: {}
    },
    reducers: {
        resetMutationResult: (state) => {
            state.mutationResult.success = false;
        }
    },
    extraReducers: {
        //add new category
        [addCategory.pending]: (state, action) => {
            state.mutationResult.loading = true;
        },
        [addCategory.fulfilled]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.success = action.payload.success;
        },
        [addCategory.rejected]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.error = action.payload;
        },
        // get all category list
        [getCategories.pending]: (state, action) => {
            state.categorylist.loading = true;
        },
        [getCategories.fulfilled]: (state, action) => {
            state.categorylist.loading = false;
            state.categorylist.categories = action.payload.categories;
        },
        [getCategories.rejected]: (state, action) => {
            state.categorylist.loading = false;
            state.categorylist.error = action.payload;
        },
        [getCategoriesAuthorizeRole.pending]: (state, action) => {
            state.categorylist.loading = true;
        },
        [getCategoriesAuthorizeRole.fulfilled]: (state, action) => {
            state.categorylist.loading = false;
            state.categorylist.categories = action.payload.categories;
            state.categorylist.categoryCount = action.payload.categoryCount;
            state.categorylist.resultPerPage = action.payload.resultPerPage;
            state.categorylist.filteredCategiriesCount = action.payload.filteredCategiriesCount;
        },
        [getCategoriesAuthorizeRole.rejected]: (state, action) => {
            state.categorylist.loading = false;
            state.categorylist.error = action.payload;
        },
        //delete a category
        [deleteCategory.pending]: (state, action) => {
            state.mutationResult.loading = true;
        },
        [deleteCategory.fulfilled]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.success = action.payload.success;
        },
        [deleteCategory.rejected]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.error = action.payload;
        },
        //get category details
        [categoryDetails.pending]: (state, action) => {
            state.categoryDetails.loading = true;
        },
        [categoryDetails.fulfilled]: (state, action) => {
            state.categoryDetails.loading = false;
            state.categoryDetails.category = action.payload.category;
        },
        [categoryDetails.rejected]: (state, action) => {
            state.categoryDetails.loading = false;
            state.categoryDetails.error = action.payload;
        },
        //update category
        [updateCategory.pending]: (state, action) => {
            state.mutationResult.loading = true;
        },
        [updateCategory.fulfilled]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.success = action.payload.success;
        },
        [updateCategory.rejected]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.error = action.payload;
        },
    }
})

export const selectCategoryMutationResult = (state) => state.category.mutationResult;
export const selectAllCategories = (state) => state.category.categorylist;
export const selectCategoryDetails = (state) => state.category.categoryDetails;
export const { resetMutationResult } = categorySlice.actions;

export default categorySlice.reducer;
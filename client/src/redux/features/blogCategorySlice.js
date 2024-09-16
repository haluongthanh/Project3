import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosPublic } from '../axiosPublic';
import axiosPrivate from '../axiosPrivate';

export const addBlogCategory = createAsyncThunk('blogcategory/addBlogCategory', async ({ formData, toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPrivate.post(`/blogcategories`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Đã thêm thành công danh mục tin mới.');
        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})


export const getBlogCategoriesAuthorizeRole = createAsyncThunk('blogcategory/getBlogsCategoryAuthorizeRole', async ({ search, currentPage, startDate, endDate, status, toast }, { rejectWithValue }) => {
    try {
        let query = '';
        if (search) query += `keyword=${search}&`;
        if (currentPage) query += `page=${currentPage}&`;
        if (startDate) query += `createdAt[gte]=${startDate}T00:00:00.000Z&`;
        if (endDate) query += `createdAt[lte]=${endDate}T23:59:59.999Z&`;
        if (status) query += `status=${status}&`;
        query = query.endsWith('&') ? query.slice(0, -1) : query;
        const { data } = await axiosPrivate.get(`/athorized/blogcategorys?${query}`);
        console.log(data)
        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

export const getBlogsCategory = createAsyncThunk('blogcategory/getBlogsCategory', async ({ toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPublic.get(`/blogcategories`);
        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

export const deleteBlogCategory = createAsyncThunk('blogcategory/deleteBlogCategory', async ({ id, toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPrivate.delete(`/blogcategories/${id}`);
        toast.success('Đã xóa danh mục tin thành công.');

        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

export const blogsCategoryDetails = createAsyncThunk('blogcategory/blogCategoryDetails', async ({ id, toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPublic.get(`/blogcategories/${id}`);
        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

export const updateBlogCategory = createAsyncThunk('blogcategory/updateBlogCategory', async ({ id, formData, toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPrivate.put(`/blogcategories/${id}`, formData, { headers: { 'Content-type': 'multipart/form-data' } });
        toast.success('Đã cập nhật danh mục tin thành công.')
        return data;
    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})
const blogCategorySlice = createSlice({
    name: 'blogCategory',
    initialState: {
        mutationResult: { success: false },
        blogcategorieslist: { blogCategories: [] },
        blogcategoriesDetails: {}
    },
    reducers: {
        resetMutationResult: (state) => {
            state.mutationResult.success = false;
        },
        resetBlogCategory:(stare)=>{
            stare.blogcategorieslist.blogCategories=[]
        }
    },
    extraReducers: {
        [addBlogCategory.pending]: (state, action) => {
            state.mutationResult.loading = true;
        },
        [addBlogCategory.fulfilled]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.success = action.payload.success;
        },
        [addBlogCategory.rejected]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.error = action.payload;
        },
        [getBlogsCategory.pending]: (state, action) => {
            state.blogcategorieslist.loading = true;
        },
        [getBlogsCategory.fulfilled]: (state, action) => {
            state.blogcategorieslist.loading = false;
            state.blogcategorieslist.blogCategorys = action.payload.blogCategorys;
        },
        [getBlogsCategory.rejected]: (state, action) => {
            state.blogcategorieslist.loading = false;
            state.blogcategorieslist.error = action.payload;
        },
        [getBlogCategoriesAuthorizeRole.pending]: (state, action) => {
            state.blogcategorieslist.loading = true;
        },
        [getBlogCategoriesAuthorizeRole.fulfilled]: (state, action) => {
            state.blogcategorieslist.loading = false;
            state.blogcategorieslist.blogCategories =action.payload.blogCategories;
            state.blogcategorieslist.blogCategoryCount = action.payload.blogCategoryCount;
            state.blogcategorieslist.resultPerPage = action.payload.resultPerPage;
            state.blogcategorieslist.filteredBlogCategoriesCount = action.payload.filteredBlogCategoriesCount;
        },
        [getBlogCategoriesAuthorizeRole.rejected]: (state, action) => {
            state.blogcategorieslist.loading = false;
            state.blogcategorieslist.error = action.payload;
        },
        [deleteBlogCategory.pending]: (state, action) => {
            state.mutationResult.loading = true;
        },
        [deleteBlogCategory.fulfilled]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.success = action.payload.success;
        },
        [deleteBlogCategory.rejected]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.error = action.payload;
        },
        [blogsCategoryDetails.pending]: (state, action) => {
            state.blogcategoriesDetails.loading = true;
        },
        [blogsCategoryDetails.fulfilled]: (state, action) => {
            state.blogcategoriesDetails.loading = false;
            state.blogcategoriesDetails.blogCategory = action.payload.blogCategory;
        },
        [blogsCategoryDetails.rejected]: (state, action) => {
            state.blogcategoriesDetails.loading = false;
            state.blogcategoriesDetails.error = action.payload;
        },
        [updateBlogCategory.pending]: (state, action) => {
            state.mutationResult.loading = true;
        },
        [updateBlogCategory.fulfilled]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.success = action.payload.success;
        },
        [updateBlogCategory.rejected]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.error = action.payload;
        },
    }
})

export const selectBlogCategoryMutationResult = (state) => state.blogCategory.mutationResult;
export const selectAllBlogCategory = (state) => state.blogCategory.blogcategorieslist;
export const selectBlogCategoryDetails = (state) => state.blogCategory.blogcategoriesDetails;
export const { resetMutationResult,resetBlogCategory } = blogCategorySlice.actions;

export default blogCategorySlice.reducer;
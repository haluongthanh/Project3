import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosPublic } from '../axiosPublic';
import axiosPrivate from '../axiosPrivate';

export const addBlog = createAsyncThunk('blog/addBlog', async({ jsonData, toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPrivate.post(`/blogs`, jsonData, { headers: { 'Content-type': 'multipart/form-data' } });
        toast.success('Successfully added new banner.');
        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

export const getBlogs = createAsyncThunk('blog/getBlogs', async({ toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPublic.get(`/blogs`);
        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

export const getBlogsAuthorizeRole = createAsyncThunk('blog/getBlogsAuthorizeRole', async({ toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPrivate.get('/athorized/blogs');
        return data;
    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})
export const deleteBlog = createAsyncThunk('blog/deleteBlog', async({ id, toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPrivate.delete(`/blogs/${id}`);
        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

export const blogDetails = createAsyncThunk('blog/blogDetails', async({ id, toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPublic.get(`/blogs/${id}`);
        return data;

    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})



export const updateBlog = createAsyncThunk('blog/updateBlog', async({ id, jsonData, toast }, { rejectWithValue }) => {
    try {
        const { data } = await axiosPrivate.put(`/blogs/${id}`, jsonData, { headers: { 'Content-type': 'multipart/form-data' } });
        toast.success('blog updated.')
        return data;
    } catch (error) {
        toast.error(error.response.data.message);
        return rejectWithValue(error.response.data.message);
    }
})

const blogSlice = createSlice({
    name: 'blog',
    initialState: {
        mutationResult: { success: false },
        blogslist: {},
        blogsDetails: {},
        blogslistAuthorizeRole: {}
    },
    reducers: {
        resetMutationResult: (state) => {
            state.mutationResult.success = false;
        }
    },
    extraReducers: {
        //add new category
        [addBlog.pending]: (state, action) => {
            state.mutationResult.loading = true;
        },
        [addBlog.fulfilled]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.success = action.payload.success;
        },
        [addBlog.rejected]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.error = action.payload;
        },
        // get all category list
        [getBlogs.pending]: (state, action) => {
            state.blogslist.loading = true;
        },
        [getBlogs.fulfilled]: (state, action) => {
            state.blogslist.loading = false;
            state.blogslist.blogs = action.payload.blogs;
        },
        [getBlogs.rejected]: (state, action) => {
            state.blogslist.loading = false;
            state.blogslist.error = action.payload;
        },
        // get all category list by role
        [getBlogsAuthorizeRole.pending]: (state, action) => {
            state.blogslistAuthorizeRole.loading = true;
        },
        [getBlogsAuthorizeRole.fulfilled]: (state, action) => {
            state.blogslistAuthorizeRole.loading = false;
            state.blogslistAuthorizeRole.blogs = action.payload.blogs;
        },
        [getBlogsAuthorizeRole.rejected]: (state, action) => {
            state.blogslistAuthorizeRole.loading = false;
            state.blogslistAuthorizeRole.error = action.payload;
        },
        //delete a category
        [deleteBlog.pending]: (state, action) => {
            state.mutationResult.loading = true;
        },
        [deleteBlog.fulfilled]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.success = action.payload.success;
        },
        [deleteBlog.rejected]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.error = action.payload;
        },
        //get category details
        [blogDetails.pending]: (state, action) => {
            state.blogsDetails.loading = true;
        },
        [blogDetails.fulfilled]: (state, action) => {
            state.blogsDetails.loading = false;
            state.blogsDetails.blog = action.payload.blog;
        },
        [blogDetails.rejected]: (state, action) => {
            state.blogsDetails.loading = false;
            state.blogsDetails.error = action.payload;
        },
        //update category
        [updateBlog.pending]: (state, action) => {
            state.mutationResult.loading = true;
        },
        [updateBlog.fulfilled]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.success = action.payload.success;
        },
        [updateBlog.rejected]: (state, action) => {
            state.mutationResult.loading = false;
            state.mutationResult.error = action.payload;
        },

    }
})

export const selectBlogMutationResult = (state) => state.blog.mutationResult;
export const selectAllBlog = (state) => state.blog.blogslist;
export const selectBlogDetails = (state) => state.blog.blogsDetails;
export const selectAllBlogAuthorizeRole = (state) => state.blog.blogslistAuthorizeRole;
export const { resetMutationResult } = blogSlice.actions;

export default blogSlice.reducer;
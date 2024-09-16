import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addBlogCategory, resetMutationResult, selectBlogCategoryMutationResult } from '../../../redux/features/blogCategorySlice';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import PhotoIcon from '@mui/icons-material/Photo';

const AddNewBlogCategory = () => {
  const dispatch = useDispatch();
  const { loading, success } = useSelector(selectBlogCategoryMutationResult);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [Image, setImage] = useState('');
  const [blogCategoryImg, setImgUrl] = useState('');
  const [status, setStatus] = useState('');

  const imageHandler = (e) => {
    if (e.target.name === 'Img') {
      setImgUrl(e.target.files);
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImage(reader.result);
        }
      }
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (blogCategoryImg === '') {
      toast.warn('Vui lòng chọn một hình ảnh');
      return false;
    }
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('Status',status)
    Object.keys(blogCategoryImg).forEach(key => {
      formData.append(blogCategoryImg.item(key).name, blogCategoryImg.item(key));
    })

    dispatch(addBlogCategory({ formData, toast }));
  }

  useEffect(() => {
    if (success) {
      dispatch(resetMutationResult());
      setTitle('');
      setDescription('');
      setImage('');
      setImgUrl('');
      setStatus('');
    }
  }, [success, dispatch]);
console.log(status)
  return (
    <div className="container mt-3">
      <h5 className="text-center">Thêm Danh Mục Tin Mới</h5>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Tiêu Đề</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Mô Tả</label>
          <textarea
            id="description"
            className="form-control"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Ảnh</label>
          <input
            type="file"
            className="form-control ms-3"
            name="Img"
            onChange={imageHandler}
          />
          <div className="mt-3">
            {Image && (
              <img src={Image} alt="Selected" className="img-thumbnail" style={{ maxWidth: '150px', height: 'auto' }} />
            )}
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="status" className="form-label">Trạng Thái</label>
          <select
            id="status"
            className="form-select"
            value={status || ''}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="">Chọn Trạng Thái</option>
            <option value="active">Hoạt Động</option>
            <option value="pause">Tạm Dừng</option>
          </select>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          <AddBoxOutlinedIcon /> Thêm Mới
        </button>
      </form>
    </div>
  );
}

export default AddNewBlogCategory;

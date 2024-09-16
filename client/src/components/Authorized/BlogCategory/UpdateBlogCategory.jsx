import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import BoxShadowLoader from '../../Skeletons/BoxShadowLoader';
import { blogsCategoryDetails, resetMutationResult, selectBlogCategoryDetails, selectBlogCategoryMutationResult, updateBlogCategory } from '../../../redux/features/blogCategorySlice';
import { IMAGE_BASEURL } from '../../../constants/baseURL';
import UpdateIcon from '@mui/icons-material/Update';
import PhotoIcon from '@mui/icons-material/Photo';

const UpdateBlogCategory = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [blogCategoryImg, setBlogCategoryImg] = useState('');
  const [file, setFile] = useState('');
  const [status, setStatus] = useState('');

  const { loading, blogCategory } = useSelector(selectBlogCategoryDetails);
  const { loading: isUpdating, success } = useSelector(selectBlogCategoryMutationResult);

  const imageHandler = (e) => {
    if (e.target.name === 'logo') {
      setFile(e.target.files);
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

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('Status', status);
    if (file !== '') {
      Object.keys(file).forEach(key => {
        formData.append(file.item(key).name, file.item(key));
      })
    }
    dispatch(updateBlogCategory({ id, formData, toast }));
  }

  useEffect(() => {
    if (success) {
      dispatch(resetMutationResult());
    }
    dispatch(blogsCategoryDetails({ id, toast }));
  }, [dispatch, id, success]);

  useEffect(() => {
    if (blogCategory) {
      setTitle(blogCategory.title);
      setDescription(blogCategory.description);
      setBlogCategoryImg(blogCategory?.blogCategoryImg?.url);
      setStatus(blogCategory.Status);
    }
  }, [blogCategory]);
  const reverseTranslateStatus = (status) => {
    switch (status) {
      case 'Tạm Dừng':
        return 'pause';
      case 'Hoạt Động':
        return 'active';
      default:
        return status;
    }
  };


  if (blogCategory == undefined
  ) {
    return <BoxShadowLoader />
  }

  return (
    <>
      {loading ? <BoxShadowLoader /> :
        <div className="container mt-3">
          <h5 className="text-center">Cập Nhật Danh Mục Tin</h5>
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
              <label htmlFor="description" className="form-label">Mô tả</label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                rows="4"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Ảnh</label>
              <input
                type="file"
                className="form-control"
                name="logo"
                onChange={imageHandler}
              />
              <div className="mt-3">
                {image ? (
                  <img src={image} alt="Selected" className="img-thumbnail" style={{ maxWidth: '150px' }} />
                ) : (
                  <img src={IMAGE_BASEURL + blogCategoryImg} alt="Current" className="img-thumbnail" style={{ maxWidth: '150px' }} />
                )}
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="status" className="form-label">Trạng Thái</label>
              <select
                id="status"
                className="form-select"
                value={status || ''}
                onChange={(e) => setStatus(reverseTranslateStatus(e.target.value))}
                required
              >
                <option value="">Chon Trạng Thái</option>
                <option value="active">Hoạt Động</option>
                <option value="pause">Tạm Dừng</option>
              </select>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isUpdating}
            >
              <UpdateIcon /> Cập Nhật
            </button>
          </form>
        </div>
      }
    </>
  );
}

export default UpdateBlogCategory;

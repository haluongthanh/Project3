import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import BoxShadowLoader from '../../Skeletons/BoxShadowLoader';
import { categoryDetails, resetMutationResult, selectCategoryDetails, selectCategoryMutationResult, updateCategory } from '../../../redux/features/categorySlice';
import { IMAGE_BASEURL } from '../../../constants/baseURL';

const UpdateCategory = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [categoryImg, setCategoryImg] = useState('');
  const [file, setFile] = useState('');
  const [status, setStatus] = useState('');

  const { loading, category } = useSelector(selectCategoryDetails);
  const { loading: isUpdating, success } = useSelector(selectCategoryMutationResult);

  const imageHandler = (e) => {
    if (e.target.name === 'image') {
      setFile(e.target.files);
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImage(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('Status', status);
    if (file !== '') {
      Object.keys(file).forEach(key => {
        formData.append(file.item(key).name, file.item(key));
      });
    }
    dispatch(updateCategory({ id, formData, toast }));
  };

  useEffect(() => {
    if (success) {
      dispatch(resetMutationResult());
    }
    dispatch(categoryDetails({ id, toast }));
  }, [dispatch, id, success]);
  useEffect(() => {
    if (category) {
      setTitle(category.title);
      setDescription(category.description);
      setCategoryImg(category?.CategoryImg?.url);
      setStatus(category.Status);
    }
  }, [category]);
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
  if (category == undefined
  ) {
    return <BoxShadowLoader />
  }
  return (
    <>
      {loading ? <BoxShadowLoader /> :
        <div className="container mt-3">
          <h5 className="text-center">Cập Nhật Danh Mục</h5>
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
                name="image"
                onChange={imageHandler}
              />
              <div className="mt-3">
                {image ? (
                  <img src={image} alt="Selected" className="img-thumbnail" style={{ maxWidth: '150px' }} />
                ) : (
                  <img src={IMAGE_BASEURL + categoryImg} alt="Current" className="img-thumbnail" style={{ maxWidth: '150px' }} />
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
                <option value="">Chọn Trạng Thái</option>
                <option value="active">Hoạt Động</option>
                <option value="pause">Tạm Dừng</option>
              </select>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isUpdating}
            >
              Cập Nhật
            </button>
          </form>
        </div>
      }
    </>
  );
}

export default UpdateCategory;

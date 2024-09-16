import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addBanner, resetMutationResult, selectBannerMutationResult } from '../../../redux/features/bannerSlice';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import PhotoIcon from '@mui/icons-material/Photo';

const AddNewBanner = () => {
  const dispatch = useDispatch();
  const { loading, success } = useSelector(selectBannerMutationResult);
  const [title, setTitle] = useState('');
  const [LinkURL, setLinkURL] = useState('');
  const [bannerStatus, setBannerStatus] = useState('');
  const [Image, setImage] = useState('');
  const [ImageURL, setImageURL] = useState('');

  const imageHandler = (e) => {
    if (e.target.name === 'ImageURL') {
      setImageURL(e.target.files);
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
    e.preventDefault();
    if (ImageURL === '') {
      toast.warn('Vui lòng chọn một hình ảnh');
      return false;
    }
    const formData = new FormData();
    formData.append('title', title);
    formData.append('LinkURL', LinkURL);
    formData.append('Status', bannerStatus);
    Object.keys(ImageURL).forEach(key => {
      formData.append(ImageURL.item(key).name, ImageURL.item(key));
    });

    dispatch(addBanner({ jsonData: formData, toast }));
  };

  useEffect(() => {
    if (success) {
      dispatch(resetMutationResult());
      setTitle('');
      setLinkURL('');
      setBannerStatus('');
      setImage('');
      setImageURL('');
    }
  }, [success, dispatch]);

  return (
    <div className="container mt-3">
      <h5 className="text-center">Thêm Mới Biểu Ngữ</h5>
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
          <label htmlFor="LinkURL" className="form-label">Link URL</label>
          <input
            type="text"
            className="form-control"
            id="LinkURL"
            name="LinkURL"
            required
            value={LinkURL}
            onChange={(e) => setLinkURL(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Ảnh</label>
          <input
            type="file"
            className="form-control"
            name="ImageURL"
            onChange={imageHandler}
          />
          <div className="mt-3">
            {Image && (
              <img src={Image} alt="Selected" className="img-thumbnail" style={{ maxWidth: '150px', height: 'auto' }} />
            )}
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="bannerStatus" className="form-label">Trạng Thái</label>
          <select
            id="bannerStatus"
            className="form-select"
            value={bannerStatus}
            onChange={(e) => setBannerStatus(e.target.value)}
            required
          >
            <option value="">Chọn Trạng Thái</option>
            <option value="pause">Tạm Dừng </option>
            <option value="slide">Thanh Trượt</option>
            <option value="bottom">Dưới</option>
            <option value="right">Phải</option>
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
};

export default AddNewBanner;

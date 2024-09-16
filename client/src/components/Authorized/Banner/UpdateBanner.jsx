import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import BoxShadowLoader from '../../../components/Skeletons/BoxShadowLoader';
import { bannerDetails, resetMutationResult, selectBannerDetails, selectBannerMutationResult, updateBanner, selectAllBanner } from '../../../redux/features/bannerSlice';
import { IMAGE_BASEURL } from '../../../constants/baseURL';
import UpdateIcon from '@mui/icons-material/Update';
import PhotoIcon from '@mui/icons-material/Photo';

const UpdateBanner = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [LinkURL, setLinkURL] = useState('');
  const [bannerStatus, setBannerStatus] = useState('');
  const [image, setImage] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [file, setFile] = useState('');

  const { loading, banner } = useSelector(selectBannerDetails);
  const { loading: isUpdating, success } = useSelector(selectBannerMutationResult);
  const { banners } = useSelector(selectAllBanner);

  const imageHandler = (e) => {
    if (e.target.name === 'ImageURL') {
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
    formData.append('LinkURL', LinkURL);
    formData.append('Status', bannerStatus);
    if (file !== '') {
      Object.keys(file).forEach(key => {
        formData.append(file.item(key).name, file.item(key));
      });
    }
    dispatch(updateBanner({ id, jsonData: formData, toast }));
  };

  useEffect(() => {
    if (success) {
      dispatch(resetMutationResult());
    }
    dispatch(bannerDetails({ id, toast }));
  }, [dispatch, id, success]);

  useEffect(() => {
    if (banner) {
      setTitle(banner.title);
      setLinkURL(banner.LinkURL);
      setBannerStatus(banner.Status);
      setImageURL(banner?.ImageURL?.url);
    }
  }, [banner]);

  const translateStatus = (status) => {
    switch (status) {
        case 'pause':
            return 'Tạm Dừng';
        case 'slide':
            return 'Thanh Trượt';
        case 'bottom':
            return 'Dưới';
        case 'right':
            return 'Phải';
        default:
            return status;
    }
  };

  const reverseTranslateStatus = (status) => {
    switch (status) {
        case 'Tạm Dừng':
            return 'pause';
        case 'Thanh Trượt':
            return 'slide';
        case 'Dưới':
            return 'bottom';
        case 'Phải':
            return 'right';
        default:
            return status;
    }
  };

  const handleStatusChange = (e) => {
    setBannerStatus(reverseTranslateStatus(e.target.value));
  };

  return (
    <>
      {loading ? <BoxShadowLoader /> :
        <div className="container mt-3">
          <h5 className="text-center">Cập Nhật Biểu Ngữ</h5>
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
                {image ? (
                  <img src={image} alt="Selected" className="img-thumbnail" style={{ maxWidth: '150px' }} />
                ) : (
                  <img src={IMAGE_BASEURL + imageURL} alt="Current" className="img-thumbnail" style={{ maxWidth: '150px' }} />
                )}
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="bannerStatus" className="form-label">Trạng Thái</label>
              <select
                id="bannerStatus"
                className="form-select"
                value={translateStatus(bannerStatus) || ''}
                onChange={handleStatusChange}
                required
              >
                <option value="">Chọn Trạng Thái</option>
                <option value="Tạm Dừng">Tạm Dừng</option>
                <option value="Thanh Trượt">Thanh Trượt</option>
                <option value="Dưới">Dưới</option>
                <option value="Phải">Phải</option>
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
};

export default UpdateBanner;



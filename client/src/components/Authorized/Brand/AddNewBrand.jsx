import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addBrand, resetMutationResult, selectBrandMutationResult } from '../../../redux/features/brandSlice';

const AddNewBrand = () => {
  const dispatch = useDispatch();
  const { loading, success } = useSelector(selectBrandMutationResult);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [Status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const jsonData = { title, description, Status };
    dispatch(addBrand({ jsonData, toast }));
  }

  useEffect(() => {
    if (success) {
      dispatch(resetMutationResult());
      setTitle('');
      setDescription('');
      setStatus('');
    }
  }, [success, dispatch]);

  return (
    <div className="container mt-3">
      <h5 className="text-center">Thêm Mới Thương Hiệu</h5>
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
          <label htmlFor="status" className="form-label">Trạng Thái</label>
          <select
            id="status"
            className="form-select"
            value={Status || ''}
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
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Thêm Mới'}
        </button>
      </form>
    </div>
  );
}

export default AddNewBrand;

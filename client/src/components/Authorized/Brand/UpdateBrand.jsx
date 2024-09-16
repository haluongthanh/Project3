import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import BoxShadowLoader from '../../Skeletons/BoxShadowLoader';
import { brandDetails, resetMutationResult, selectBrandDetails, selectBrandMutationResult, updateBrand } from '../../../redux/features/brandSlice';

const UpdateBrand = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [Status, setStatus] = useState('');

    const { loading, brand } = useSelector(selectBrandDetails);
    const { loading: isUpdating, success } = useSelector(selectBrandMutationResult);

    const handleSubmit = (e) => {
        e.preventDefault();
        const jsonData = { title, description, Status };
        dispatch(updateBrand({ id, jsonData, toast }));
    }

    useEffect(() => {
        if (success) {
            dispatch(resetMutationResult());
        }
        dispatch(brandDetails({ id, toast }));
    }, [dispatch, id, success]);

    useEffect(() => {
        if (brand) {
            setTitle(brand.title);
            setDescription(brand.description);
            setStatus(brand.Status);
        }
    }, [brand]);
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
    if (brand == undefined
    ) {
        return <BoxShadowLoader />
    }
    return (
        <>
            {loading ? <BoxShadowLoader /> :
                <div className="container mt-3">
                    <h5 className="text-center">Cập Nhật Thương Hiệu</h5>
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
                            className="btn btn-primary w-100"
                            disabled={isUpdating}
                        >
                            {isUpdating ? 'Updating...' : 'Cập Nhật'}
                        </button>
                    </form>
                </div>
            }
        </>
    )
}

export default UpdateBrand;

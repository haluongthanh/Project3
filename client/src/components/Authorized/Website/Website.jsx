import React, { useEffect, useState } from "react";
import { selectWebsite, getWebsite, updateWebsite } from "../../../redux/features/websiteSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useParams } from "react-router";
import { IMAGE_BASEURL } from "../../../constants/baseURL";
import BoxShadowLoader from '../../Skeletons/BoxShadowLoader';

const Website = () => {
    const dispatch = useDispatch();
    const { loading, website } = useSelector(selectWebsite);
    const [id, setId] = useState('');
    const [logo, setLogo] = useState('');
    const [email, setEmail] = useState('');
    const [hotline, setHotline] = useState('');
    const [file, setFile] = useState(null);
    const [address, setAddress] = useState('');
    const [image, setImage] = useState('');


    const imageHandler = (e) => {
        if (e.target.name === 'logo') {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImage(reader.result);
                }
            }
            reader.readAsDataURL(selectedFile);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const jsonData = new FormData();
        jsonData.append('email', email);
        jsonData.append('hotline', hotline);
        jsonData.append('address', address);
        if (file) {
            jsonData.append('logo', file);
        }
        dispatch(updateWebsite({ id, jsonData, toast }));
    }

    useEffect(() => {
        if (website) {
            setId(website[0]?._id);
            setLogo(website[0]?.logo.url);
            setEmail(website[0]?.email);
            setHotline(website[0]?.hotline);
            setAddress(website[0].address);
        }
    }, [website]);

    useEffect(() => {
        dispatch(getWebsite({ toast }));
    }, [dispatch]);

    return (
        <>
            {loading ? <BoxShadowLoader /> :
                <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h5>Website</h5>
                    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '600px' }}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type='email'
                                id='email'
                                className="form-control"
                                name='email'
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="hotline" className="form-label">Hotline</label>
                            <input
                                type='text'
                                id='hotline'
                                className="form-control"
                                name='hotline'
                                required
                                value={hotline}
                                onChange={(e) => setHotline(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">Address</label>
                            <input
                                type='text'
                                id='address'
                                className="form-control"
                                name='address'
                                required
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label className="form-label">Image</label>
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
                                    <img src={IMAGE_BASEURL + logo} alt="Current" className="img-thumbnail" style={{ maxWidth: '150px' }} />
                                )}
                            </div>
                        </div>
                        <button
                            type='submit'
                            className="btn btn-primary"
                            style={{ marginTop: '1rem' }}
                        >
                            <span className="me-2">Update</span>
                            <i className="bi bi-pencil"></i>
                        </button>
                    </form>
                </div>
            }
        </>
    );
}

export default Website;

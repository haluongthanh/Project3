import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import BoxShadowLoader from '../../../components/Skeletons/BoxShadowLoader';
import { getCategories, selectAllCategories } from '../../../redux/features/categorySlice';
import { getBrands, selectAllBrands } from '../../../redux/features/brandSlice';
import { deleteProductImg, productDetails, resetMutationResult, selectProductDetails, selectProductMutationResult, updateProduct } from '../../../redux/features/productSlice';
import { IMAGE_BASEURL } from '../../../constants/baseURL';
import JoditEditor from 'jodit-react';
import './Product.css';

const UpdateProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState(0);
  const [weight, setWeight] = useState(0);
  const [stock, setStock] = useState(1);
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [localShipmentPolicy, setLocalShipmentPolicy] = useState('standard');
  const [internationalShipmentPolicy, setInternationalShipmentPolicy] = useState('standard');
  const [customLocalShipmentCost, setCustomLocalShipmentCost] = useState('');
  const [customInternationalShipmentCost, setCustomInternationalShipmentCost] = useState('');
  const [images, setImages] = useState([]);
  const [productFiles, setProductFiles] = useState([]);
  const [status, setStatus] = useState('');
  const [deletedImages, setDeletedImages] = useState([]); // Thêm trạng thái cho ảnh đã xóa

  const { loading, product } = useSelector(selectProductDetails);
  const { brands } = useSelector(selectAllBrands);
  const { categories } = useSelector(selectAllCategories);
  const { loading: isUpdating, success } = useSelector(selectProductMutationResult);

  const imageHandler = (e) => {
    const files = Array.from(e.target.files);
  
    setProductFiles((prevFiles) => {
      const existingFileNames = new Set(prevFiles.map(file => file.name));
      const newFiles = files.filter(file => !existingFileNames.has(file.name));
  
      return [...prevFiles, ...newFiles];
    });
  
    const newImages = files.map((file, index) => {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onload = () => {
          if (reader.readyState === 2) {
            resolve({
              id: `temp-${Date.now()}-${index}`,
              url: reader.result,
              file: file,
              name: file.name 
            });
          }
        };
        reader.readAsDataURL(file);
      });
    });
  
    Promise.all(newImages).then((imageUrls) => {
      setImages((prevImages) => [...prevImages, ...imageUrls]);
    });
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('discount', discount);
    formData.append('weight', weight);
    formData.append('stock', stock);
    formData.append('category', category);
    formData.append('brand', brand);
    formData.append('localShipmentPolicy', localShipmentPolicy);
    formData.append('internationalShipmentPolicy', internationalShipmentPolicy);
    formData.append('customLocalShipmentCost', customLocalShipmentCost);
    formData.append('customInternationalShipmentCost', customInternationalShipmentCost);
    formData.append('Status', status);
  
    productFiles.forEach((file, i) => {
      formData.append(`productImage_${i}`, file);
    });
  
    dispatch(updateProduct({ id, formData, toast })).then(() => {
      setProductFiles([]);
      setImages([]);
    });
  };

  useEffect(() => {
    if (success) {
      dispatch(resetMutationResult());
    }
    dispatch(getBrands({ toast }));
    dispatch(getCategories({ toast }));
    dispatch(productDetails({ id, toast }));
  }, [dispatch, id, success]);

  useEffect(() => {
    if (product) {
      setTitle(product?.title);
      setDescription(product?.description);
      setPrice(product?.price);
      setDiscount(product?.discount);
      setWeight(product?.weight);
      setStock(product?.stock);
      setCategory(product?.category?._id);
      setBrand(product?.brand?._id);
      setLocalShipmentPolicy(product?.localShipmentPolicy);
      setInternationalShipmentPolicy(product?.internationalShipmentPolicy);
      setCustomLocalShipmentCost(product?.customLocalShipmentCost);
      setCustomInternationalShipmentCost(product?.customInternationalShipmentCost);
      setImages(product.images.map(img => ({
        id: img._id,
        url: `${IMAGE_BASEURL}${img.url}`
      }))); 
      setStatus(product.Status);
    }
  }, [product]);

  const handleEditorChange = useCallback((newText) => {
    setDescription(newText);
  }, []);

  const editor = useRef(null);

  const config = useMemo(() => ({
    zIndex: 0,
    readonly: false,
    activeButtonsInReadOnly: ['source', 'fullsize', 'print', 'about'],
    toolbarButtonSize: 'middle',
    theme: 'default',
    enableDragAndDropFileToEditor: true,
    saveModeInCookie: false,
    spellcheck: true,
    editorCssClass: false,
    triggerChangeEvent: true,
    height: 500,
    direction: 'ltr',
    language: 'en',
    debugLanguage: false,
    i18n: 'en',
    tabIndex: -1,
    toolbar: true,
    enter: 'P',
    useSplitMode: false,
    colorPickerDefaultTab: 'background',
    imageDefaultWidth: 100,
    disablePlugins: ['paste', 'stat'],
    events: {
      change: (newText) => {
        setDescription(newText);
      },
    },
    textIcons: false,
    uploader: {
      insertImageAsBase64URI: true,
    },
    placeholder: 'Start typings...',
    showXPathInStatusbar: false,
  }), []);

const handleDeleteNewImage = (imageId) => {
  setImages((prevImages) => prevImages.filter((image) => image.id !== imageId));

  setProductFiles((prevFiles) => {
    const imageToDelete = images.find((image) => image.id === imageId);
    if (imageToDelete) {
      return prevFiles.filter((file) => file.name !== imageToDelete.name);
    }
    return prevFiles;
  });
};


  
  const handleDeleteDatabaseImage = (imageId) => {
    dispatch(deleteProductImg({ id, imageId, toast }))
      .then(() => {
        setImages((prevImages) => prevImages.filter((image) => image.id !== imageId));
        setDeletedImages((prevDeletedImages) => [...prevDeletedImages, imageId]);
      })
      .catch((error) => {
        console.error('Error deleting image:', error);
        toast.error('Failed to delete image');
      });
  };
  if (product == undefined
    ||brands==undefined
    ||categories==undefined
  ) {
    return <BoxShadowLoader />
  }
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
  return (
    <>
      {loading ? <BoxShadowLoader /> :
        <div className="container mt-4">
          <h2>Cập Nhật Sản Phẩm</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Tiêu Đề</label>
              <input
                type="text"
                id="title"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <JoditEditor
              ref={editor}
              value={description}
              config={config}
              onChange={handleEditorChange}
            />
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="price" className="form-label">Giá</label>
                <input
                  type="number"
                  id="price"
                  className="form-control"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="discount" className="form-label">Giảm Giá</label>
                <input
                  type="number"
                  id="discount"
                  className="form-control"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="weight" className="form-label">Cân Nặng</label>
                <input
                  type="number"
                  id="weight"
                  className="form-control"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="stock" className="form-label">Số Lượng</label>
                <input
                  type="number"
                  id="stock"
                  className="form-control"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="category" className="form-label">Danh Mục</label>
                <select
                  id="category"
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Chọn Danh Mục</option>
                  {categories && categories.map((cat) =>
                    <option key={cat._id} value={cat._id}>{cat.title}</option>
                  )}
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="brand" className="form-label">Thương Hiệu</label>
                <select
                  id="brand"
                  className="form-select"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  required
                >
                  <option value="">Chọn Thương Hiệu</option>
                  {brands && brands.map((brd) =>
                    <option key={brd._id} value={brd._id}>{brd.title}</option>
                  )}
                </select>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Local Shipment Policy</label>
                <div>
                  <input
                    type="radio"
                    id="localStandard"
                    name="localShipmentPolicy"
                    value="standard"
                    checked={localShipmentPolicy === 'standard'}
                    onChange={(e) => setLocalShipmentPolicy(e.target.value)}
                  />
                  <label htmlFor="localStandard" className="ms-2">Standard</label>
                  <input
                    type="radio"
                    id="localFree"
                    name="localShipmentPolicy"
                    value="free"
                    checked={localShipmentPolicy === 'free'}
                    onChange={(e) => setLocalShipmentPolicy(e.target.value)}
                  />
                  <label htmlFor="localFree" className="ms-2">Free Shipment</label>
                  <input
                    type="radio"
                    id="localCustom"
                    name="localShipmentPolicy"
                    value="custom"
                    checked={localShipmentPolicy === 'custom'}
                    onChange={(e) => setLocalShipmentPolicy(e.target.value)}
                    className="ms-3"
                  />
                  <label htmlFor="localCustom" className="ms-2">Custom</label>
                </div>
                {localShipmentPolicy === 'custom' && (
                  <input
                    type="number"
                    className="form-control mt-2"
                    placeholder="Custom Shipping Cost"
                    value={customLocalShipmentCost}
                    onChange={(e) => setCustomLocalShipmentCost(e.target.value)}
                  />
                )}
              </div>
              <div className="col-md-6">
                <label className="form-label">International Shipment Policy</label>
                <div>
                  <input
                    type="radio"
                    id="internationalStandard"
                    name="internationalShipmentPolicy"
                    value="standard"
                    checked={internationalShipmentPolicy === 'standard'}
                    onChange={(e) => setInternationalShipmentPolicy(e.target.value)}
                  />
                  <label htmlFor="internationalStandard" className="ms-2">Standard</label>
                  <input
                    type="radio"
                    id="internationalFree"
                    name="internationalShipmentPolicy"
                    value="free"
                    checked={internationalShipmentPolicy === 'free'}
                    onChange={(e) => setInternationalShipmentPolicy(e.target.value)}
                  />
                  <label htmlFor="internationalFree" className="ms-2">Free Shipment</label>
                  <input
                    type="radio"
                    id="internationalCustom"
                    name="internationalShipmentPolicy"
                    value="custom"
                    checked={internationalShipmentPolicy === 'custom'}
                    onChange={(e) => setInternationalShipmentPolicy(e.target.value)}
                    className="ms-3"
                  />
                  <label htmlFor="internationalCustom" className="ms-2">Custom</label>
                </div>
                {internationalShipmentPolicy === 'custom' && (
                  <input
                    type="number"
                    className="form-control mt-2"
                    placeholder="Custom Shipping Cost"
                    value={customInternationalShipmentCost}
                    onChange={(e) => setCustomInternationalShipmentCost(e.target.value)}
                  />
                )}
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="images" className="form-label">Hình Ảnh Sản Phẩm</label>
              <input
                type="file"
                id="images"
                className="form-control"
                multiple
                onChange={imageHandler}
              />
              <div className="mt-3">
                {images.map((img) => (
                  <div key={img.id} className="d-inline-block me-2">
                    <img src={img.url} alt={`Product Preview`} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                    <button
                      type="button"
                      className="btn btn-danger btn-sm mt-1"
                      onClick={() => {
                        if (img.id.startsWith('temp-')) {
                          handleDeleteNewImage(img.id);
                        } else {
                          handleDeleteDatabaseImage(img.id);
                        }
                      }} 
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="status" className="form-label">Trạng Thái</label>
              <select
                id="status"
                className="form-select"
                value={status}
                onChange={(e) => setStatus(reverseTranslateStatus(e.target.value))}
                required
              >
                <option value="">Chọn Trạng Thái</option>
                <option value="active">Hoạt Động</option>
                <option value="pause">Tạm Dừng</option>
              </select>
            </div>
            <div className="mb-3">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isUpdating}
              >
                {isUpdating ? 'Updating...' : 'Cập Nhật'}
              </button>
            </div>
          </form>
        </div>
      }
    </>
  );
};

export default UpdateProduct;

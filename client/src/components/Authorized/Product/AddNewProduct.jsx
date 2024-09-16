import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getCategories, selectAllCategories } from '../../../redux/features/categorySlice';
import { getBrands, selectAllBrands } from '../../../redux/features/brandSlice';
import { addProduct, resetMutationResult, selectProductMutationResult } from '../../../redux/features/productSlice';
import { POLICIES } from '../../../constants/policies';
import JoditEditor from 'jodit-react';
import './Product.css'
const AddNewProduct = () => {
  const dispatch = useDispatch();
  const { loading, success } = useSelector(selectProductMutationResult);
  const { brands } = useSelector(selectAllBrands);
  const { categories } = useSelector(selectAllCategories);

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

  const imageHandler = (e) => {
    const files = Array.from(e.target.files);
    const existingFileNames = new Set(productFiles.map(file => file.name));
    const newFiles = [];

    files.forEach((file) => {
      if (!existingFileNames.has(file.name)) {
        newFiles.push(file);
        existingFileNames.add(file.name);
      } else {
        toast.error(`File ${file.name} is already uploaded.`);
      }
    });

    if (newFiles.length > 0) {
      setProductFiles([...productFiles, ...newFiles]);

      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.readyState === 2) {
            setImages((old) => [...old, reader.result]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setProductFiles(productFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (images.length < 1) {
      toast.error('Vui lòng chọn hình ảnh.');
      return;
    }
    if (!description.trim()) {
      toast.error('Vui lòng nhập mô tả sản phẩm.');
      return;
    }
    if ((localShipmentPolicy === 'custom') && (customLocalShipmentCost < 1)) {
      toast.error('Vui lòng nhập chi phí vận chuyển tùy chỉnh');
      return;
    }
    if ((internationalShipmentPolicy === 'custom') && (customInternationalShipmentCost < 1)) {
      toast.error('Vui lòng nhập chi phí vận chuyển tùy chỉnh');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('discount', discount);
    formData.append('weight', weight);
    formData.append('stock', stock);
    formData.append('category', category);
    formData.append('brand', brand);
    formData.append('Status', status);
    formData.append('localShipmentPolicy', localShipmentPolicy);
    formData.append('internationalShipmentPolicy', internationalShipmentPolicy);
    formData.append('customLocalShipmentCost', customLocalShipmentCost);
    formData.append('customInternationalShipmentCost', customInternationalShipmentCost);

    productFiles.forEach((file, i) => {
      formData.append(`productImage_${i}`, file);
    });


    dispatch(addProduct({ formData, toast }));
  };
  console.log(status)

  useEffect(() => {
    dispatch(getBrands({ toast }));
    dispatch(getCategories({ toast }));
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      dispatch(resetMutationResult());
      setTitle('');
      setDescription('');
      setPrice('');
      setDiscount(0);
      setWeight(0);
      setStock(1);
      setCategory('');
      setBrand('');
      setLocalShipmentPolicy('standard');
      setInternationalShipmentPolicy('standard');
      setCustomLocalShipmentCost('');
      setCustomInternationalShipmentCost('');
      setImages([]);
      setProductFiles([]);
    }
  }, [success, dispatch]);

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
    events: {},
    textIcons: false,
    uploader: {
      insertImageAsBase64URI: true
    },
    placeholder: '',
    showXPathInStatusbar: false
  }), []);

  return (
    <div className="container mt-4">
      <h2 className="text-center">Thêm Mới Sản Phẩm</h2>
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

        <div className="mb-3">
          <label htmlFor="description" className="form-label">Mô Tả Sản Phẩm</label>
          <JoditEditor
            ref={editor}
            value={description}
            config={config}
            onChange={handleEditorChange}
            required
          />
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <div className="mb-3">
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
            <div className="mb-3">
              <label htmlFor="discount" className="form-label">Giảm giá</label>
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
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="weight" className="form-label">Cân nặng</label>
              <input
                type="number"
                id="weight"
                className="form-control"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div className="mb-3">
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
                {categories && categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.title}</option>
                ))}
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
                {brands && brands.map((br) => (
                  <option key={br._id} value={br._id}>{br.title}</option>
                ))}
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
          <label htmlFor="images" className="form-label">Hình ảnh sản phẩm</label>
          <input
            type="file"
            id="images"
            className="form-control"
            multiple
            onChange={imageHandler}
          />
          <div className="mt-3">
            {images.length > 0 && (
              <div className="d-flex flex-wrap">
                {images.map((img, index) => (
                  <div key={index} className="position-relative me-2 mb-2">
                    <img src={img} alt={`Product ${index}`} className="img-thumbnail" style={{ maxWidth: '150px' }} />
                    <button
                      type="button"
                      className="btn btn-danger position-absolute top-0 end-0"
                      onClick={() => removeImage(index)}
                    >
                      <i className="bi bi-x">X</i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="status" className="form-label">Trạng Thái</label>
          <select
            id="status"
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="">Chọn Trạng Thái</option>

            <option value="active">Hoạt Động</option>
            <option value="pause">Tạm Dừng</option>
          </select>
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Adding...' : 'Cập Nhật'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewProduct;

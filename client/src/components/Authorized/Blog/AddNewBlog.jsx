import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addBlog, resetMutationResult, selectBlogMutationResult } from '../../../redux/features/blogSlice';
import { selectAllBlogCategory, getBlogsCategory } from '../../../redux/features/blogCategorySlice';

import JoditEditor from 'jodit-react';

const AddNewBlog = () => {
  const dispatch = useDispatch();
  const { loading, success } = useSelector(selectBlogMutationResult);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [Image, setImage] = useState('');
  const [ImageURL, setImgUrl] = useState('');
  const [status, setStatus] = useState('');
  const [blogCategory, setBlogCategory] = useState('');
  const { blogCategorys } = useSelector(selectAllBlogCategory);

  const imageHandler = (e) => {
    if (e.target.name === 'Img') {
      setImgUrl(e.target.files);
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
    if (ImageURL === '') {
      toast.warn('Vui lòng chọn một hình ảnh');
      return false;
    }
    const jsonData = new FormData();
    jsonData.append('title', title);
    jsonData.append('description', description);
    jsonData.append('blogCategory', blogCategory);

    Object.keys(ImageURL).forEach(key => {
      jsonData.append(ImageURL.item(key).name, ImageURL.item(key));
    });
    jsonData.append('Status', status);
    dispatch(addBlog({ jsonData, toast }));
  };

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

  useEffect(() => {
    dispatch(getBlogsCategory({ toast }));
  }, [dispatch]);

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
    <div className="container mt-3">
      <h5 className="text-center">Thêm Tin Mới</h5>
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
          <JoditEditor
            ref={editor}
            value={description}
            config={config}
            onChange={handleEditorChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="blogCategory" className="form-label">Danh Mục</label>
          <select
            id="blogCategory"
            className="form-select"
            value={blogCategory}
            onChange={(e) => setBlogCategory(e.target.value)}
            required
          >
            <option value="">Chọn Danh Mục</option>
            {blogCategorys && blogCategorys.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.title}</option>
            ))}
          </select>
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
          Thêm Mới
        </button>
      </form>
    </div>
  );
};

export default AddNewBlog;

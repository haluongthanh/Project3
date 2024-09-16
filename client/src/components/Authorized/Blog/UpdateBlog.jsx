import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { blogsDetails, updateBlog, resetMutationResult, selectBlogDetails, selectBlogMutationResult } from '../../../redux/features/blogSlice';
import { selectAllBlogCategory, getBlogsCategory } from '../../../redux/features/blogCategorySlice';
import JoditEditor from 'jodit-react';
import { IMAGE_BASEURL } from '../../../constants/baseURL';
import UpdateIcon from '@mui/icons-material/Update';
import PhotoIcon from '@mui/icons-material/Photo';
import BoxShadowLoader from '../../Skeletons/BoxShadowLoader';

const UpdateBlog = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [Image, setImage] = useState('');
  const [ImageURL, setImgUrl] = useState('');
  const [file, setFile] = useState('');
  const [status, setStatus] = useState('');
  const [blogCategory, setBlogCategory] = useState('');

  const { blogCategorys } = useSelector(selectAllBlogCategory);
  const { loading, blog } = useSelector(selectBlogDetails);
  const { loading: isUpdating, success } = useSelector(selectBlogMutationResult);

  const imageHandler = (e) => {
    if (e.target.name === 'Img') {
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
    const jsonData = new FormData();
    jsonData.append('title', title);
    jsonData.append('description', description);
    jsonData.append('blogCategory', blogCategory);

    if (file !== '') {
      Object.keys(file).forEach(key => {
        jsonData.append(file.item(key).name, file.item(key));
      })
    }
    jsonData.append('Status', status);
    dispatch(updateBlog({ id, jsonData, toast }));
  }

  useEffect(() => {
    if (success) {
      dispatch(resetMutationResult());
    }
    dispatch(blogsDetails({ id, toast }));
  }, [dispatch, id, success]);
  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setDescription(blog.description);
      setImgUrl(blog?.ImageURL?.url);
      setStatus(blog.Status);
      setBlogCategory(blog.blogCategory._id);
    }
  }, [blog]);

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

  if (blogCategorys == undefined || blog == undefined) {
    return <BoxShadowLoader />
  }

  return (
    <div className="container mt-3">
      <h5 className="text-center">Cập Nhật Tin</h5>
      <form onSubmit={handleSubmit}>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <>
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
                className="form-control"
                name="Img"
                onChange={imageHandler}
              />
              <div className="mt-3">
                {Image ? (
                  <img src={Image} alt="Selected" className="img-thumbnail" style={{ maxWidth: '150px' }} />
                ) : (
                  <img src={IMAGE_BASEURL + ImageURL} alt="Current" className="img-thumbnail" style={{ maxWidth: '150px' }} />
                )}
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="status" className="form-label">Trạng thái</label>
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
              <UpdateIcon /> Cập Nhật
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default UpdateBlog;

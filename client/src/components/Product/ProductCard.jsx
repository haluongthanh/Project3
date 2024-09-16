import React, { useEffect, useState } from 'react';
import { IMAGE_BASEURL } from '../../constants/baseURL';
import { formatCurrency } from '../../utility/formatCurrency';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import { addItemsToCart, selectCartItems, removeItem } from '../../redux/features/cartSlice';

const ProductCard = React.forwardRef(({ product }, ref) => {
  const dispatch = useDispatch();
  const [exist, setExist] = useState(false);
  const [color, setColor] = useState('info');
  const [icon, setIcon] = useState(<AddShoppingCartIcon />);
  const [text, setText] = useState('Add to cart');

  const { products } = useSelector(selectCartItems);

  const remove = () => {
    setExist(true);
    setColor('error');
    setIcon(<DeleteIcon />);
    setText('Remove from cart');
  }

  const add = () => {
    setExist(false);
    setColor('info');
    setIcon(<AddShoppingCartIcon />);
    setText('Add to cart');
  }

  const cartHandler = () => {
    const _id = product._id;
    const quantity = 1;

    if (exist) {
      dispatch(removeItem(_id));
      toast.error('Item removed from cart');
      add();
      return;
    }
    if (!exist) {
      dispatch(addItemsToCart({ _id, quantity, toast }))
      toast.success('Item added to cart');
      remove();
      return;
    }
  }

  const getExist = () => {
    if (products) {
      const e = products.some(p => p._id === product._id);
      if (e === true) {
        remove();
      }
    }
  }

  useEffect(() => {
    getExist();
  }, []);

  const navigate = useNavigate();

  const linkToDetails = () => { navigate(`/product/${product._id}`); }

  const calculateDiscountPercentage = () => {
    return ((product.discount / product.price) * 100).toFixed(2);
  }

  return (
    <div class="listProduct-row">
      <div class="col-xl-3 col-lg-3 col-6 proloop">
        <div class="proloop-block">
          <div class="proloop-img">
            <div class="proloop-label proloop-label--top">
              <div class="proloop-label--tag"></div>
            </div>
            <a class="aspect-ratio fade-box" href={`/product/${product._id}`}>
              <picture>
                <img src={IMAGE_BASEURL + product?.images[0]?.url} alt={product.title} class="img-default lazyloaded" />
              </picture>
            </a>
            <div class="proloop-button" data-view="">
              <button aria-label="Xem nhanh" class="proloop-action quick-view full" data-handle="" data-id="1054896153">Xem nhanh</button>
              <button aria-label="Thêm vào giỏ" class="proloop-action add-to-cart disabled" disabled="" data-id="1054896153" data-variantid="">Thêm vào giỏ</button>
            </div>
          </div>
          <div class="proloop-detail">
            <h3 class="proloop-name">
              <a href={`/product/${product._id}`}>{product.title}</a>
            </h3>
            <div class="proloop-price">
              {product.discount > 0 ?
                <div class="proloop-price--compare">
                  <del>{formatCurrency(product.price)}</del>
                </div> : null
              }
              <div class="proloop-price--default">
                <span class="proloop-price--highlight">{formatCurrency(product.price - product.discount)}₫</span>
                {product.discount > 0 && 
                  <span class="proloop-label--on-sale">-{calculateDiscountPercentage()}%</span>
                }
              </div>
            </div>
            <div class="proloop-rating">
              <span class="number">{product.ratings}</span>
              <span class="icon">
                <svg viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.09627 11.6195L2.82735 8.16864L0.268563 5.80414C0.268563 5.80414 -0.096986 5.48462 0.0248693 5.03728C0.146725 4.58994 0.634105 4.58994 0.634105 4.58994L4.04582 4.27041L5.38614 1.01124C5.38614 1.01124 5.5689 0.5 5.99538 0.5C6.42185 0.5 6.60461 1.01124 6.60461 1.01124L7.94493 4.27041L11.4785 4.58994C11.4785 4.58994 11.844 4.65385 11.9659 5.03728C12.0877 5.42071 11.844 5.67633 11.844 5.67633L9.1634 8.16864L9.89448 11.7473C9.89448 11.7473 10.0163 12.1308 9.71171 12.3864C9.40709 12.642 8.91971 12.3864 8.91971 12.3864L5.99538 10.5331L3.13197 12.3864C3.13197 12.3864 2.70551 12.642 2.33996 12.3864C1.97442 12.1308 2.09627 11.6195 2.09627 11.6195Z" fill="#FF8A00"></path>
                </svg>
              </span>
              <span class="count">({product.numOfReviews} đánh giá)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default ProductCard;
